// Theme toggle with localStorage persistence
(function () {
  const KEY = 'careerprepx-theme';
  const saved = localStorage.getItem(KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  function updateLabel() {
    const t = document.documentElement.getAttribute('data-theme');
    document.querySelectorAll('[data-theme-label]').forEach(el => {
      el.textContent = t === 'dark' ? '☀️ Light' : '🌙 Dark';
    });
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    localStorage.setItem(KEY, cur);
    updateLabel();
  });

  document.addEventListener('DOMContentLoaded', updateLabel);
})();

// PROCTORED APTITUDE ENGINE WITH TAB-SWITCH DETECTION
(function () {
  let questions = [];
  let currentIndex = 0;
  let userAnswers = {};
  let warningCount = 0;
  let timeRemaining = 600; // 10 minutes in seconds
  let timerInterval = null;
  let startTime = Date.now();

  const questionCard = document.getElementById('question-card');
  const timerDisplay = document.getElementById('session-timer');
  const warningDisplay = document.getElementById('warning-counter');

  // Load questions dynamically from MySQL
  async function fetchQuestions() {
    if (!questionCard) return; // Exit if not on aptitude.html
    try {
      const response = await fetch('get_aptitude_questions.php');
      const data = await response.json();
      if (data.status === 'success' && data.questions.length > 0) {
        questions = data.questions;
        renderQuestion(0);
        startTimer();
        initProctoring();
      } else {
        questionCard.innerHTML = '<p>No questions found in database. Please seed the database.</p>';
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  }

  function renderQuestion(index) {
    if (!questions[index]) return;
    const q = questions[index];
    
    questionCard.innerHTML = `
      <div class="q-header">
        <span class="pill pill-indigo">${q.category}</span>
        <span>Question ${index + 1} of ${questions.length}</span>
      </div>
      <h3 style="margin: 15px 0;">${q.question_text}</h3>
      <div class="options-grid">
        ${['a', 'b', 'c', 'd'].map(opt => `
          <label class="option-card ${userAnswers[q.id] === opt.toUpperCase() ? 'selected' : ''}">
            <input type="radio" name="option" value="${opt.toUpperCase()}" ${userAnswers[q.id] === opt.toUpperCase() ? 'checked' : ''} onchange="selectOption(${q.id}, '${opt.toUpperCase()}')">
            <strong>${opt.toUpperCase()}:</strong> ${q['option_' + opt]}
          </label>
        `).join('')}
      </div>
      <div style="margin-top: 20px; display: flex; justify-content: space-between;">
        <button class="btn btn-secondary" ${index === 0 ? 'disabled' : ''} id="prev-btn">Previous</button>
        ${index === questions.length - 1 
          ? '<button class="btn btn-primary" id="submit-exam-btn">Submit Exam</button>' 
          : '<button class="btn btn-primary" id="next-btn">Next Question</button>'}
      </div>
    `;

    document.getElementById('prev-btn')?.addEventListener('click', () => {
      currentIndex--;
      renderQuestion(currentIndex);
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      currentIndex++;
      renderQuestion(currentIndex);
    });

    document.getElementById('submit-exam-btn')?.addEventListener('click', () => {
      submitExam('Completed');
    });
  }

  window.selectOption = function (qId, optionVal) {
    userAnswers[qId] = optionVal;
  };

  // Timer function
  function startTimer() {
    timerInterval = setInterval(() => {
      timeRemaining--;
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert('Time is up! Auto-submitting your test.');
        submitExam('Time Expired');
      }
    }, 1000);
  }

  // Anti-Cheat / Proctored Tab Switch Detection
  function initProctoring() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        warningCount++;
        if (warningDisplay) warningDisplay.textContent = warningCount;
        
        if (warningCount >= 3) {
          alert('SECURITY VIOLATION: You switched tabs 3 times. Your test is being terminated and submitted automatically.');
          submitExam('Terminated (Tab Switch Violation)');
        } else {
          alert(`WARNING (${warningCount}/3): Tab switching is strictly prohibited during the proctored test!`);
        }
      }
    });
  }

  // Submit test and save results in MySQL
  async function submitExam(statusReason) {
    clearInterval(timerInterval);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const payload = {
      answers: userAnswers,
      time_taken: timeTaken,
      warnings: warningCount,
      status: statusReason
    };

    try {
      const res = await fetch('submit_aptitude.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.status === 'success') {
        alert(`Test Submitted Successfully!\nScore: ${result.score_percentage}%\nCorrect: ${result.correct_answers}/${result.total_questions}\nStatus: ${result.completion_status}`);
        window.location.href = 'dashboard.html';
      } else {
        alert('Failed to submit test: ' + result.message);
      }
    } catch (err) {
      console.error('Submission error:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', fetchQuestions);
})();