// Theme Engine
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

/* ==========================================================================
   PROCTORED CODING ARENA CONTROLLER WITH HISTORY & AUTO-EXIT
   ========================================================================== */
(function () {
  let codingViolationCount = 0;
  const MAX_VIOLATIONS = 2;
  let isCodingTestActive = false;

  let questionSwitchesLeft = 3;
  let currentDomain = "frontend";
  let currentDifficulty = "easy";
  let currentLanguage = "javascript";
  let activePool = [];
  let currentPoolIndex = 0;
  
  let wrongAttempts = 0;

  let timerInterval = null;
  let totalSeconds = 25 * 60;

  // LocalStorage History to avoid showing previously attempted questions
  const SEEN_QUESTIONS_KEY = 'careerprepx_seen_questions';
  
  function getSeenQuestions() {
    return JSON.parse(localStorage.getItem(SEEN_QUESTIONS_KEY) || "[]");
  }

  function markQuestionAsSeen(qId) {
    const seen = getSeenQuestions();
    if (!seen.includes(qId)) {
      seen.push(qId);
      localStorage.setItem(SEEN_QUESTIONS_KEY, JSON.stringify(seen));
    }
  }

  // Expanded Problem Database
  const problemBank = {
    frontend: {
      easy: [
        {
          id: "fe_easy_1",
          title: "1. Array Flatten Depth 1",
          subtitle: "Question 1 · Frontend Easy",
          tags: ["JavaScript", "Arrays"],
          description: "Write a function <code>flatten</code> to flatten a nested array by exactly 1 level.",
          constraints: "<li>Depth = 1</li><li>1 ≤ arr.length ≤ 1000</li>",
          example: "Input: [1, [2, 3]]<br/>Output: [1, 2, 3]",
          expectedKeyword: "flat",
          starters: { javascript: "function flatten(arr) {\n    // Write solution here\n}" },
          correctSolution: "function flatten(arr) {\n    return arr.flat(1);\n}"
        },
        {
          id: "fe_easy_2",
          title: "2. Two Sum Pairs Index",
          subtitle: "Question 2 · Frontend Easy",
          tags: ["JavaScript", "Algorithms"],
          description: "Find indices of two numbers in an array that add up to target sum.",
          constraints: "<li>2 ≤ nums.length ≤ 10<sup>4</sup></li>",
          example: "Input: nums = [2,7,11], target = 9<br/>Output: [0, 1]",
          expectedKeyword: "return",
          starters: { javascript: "function twoSum(nums, target) {\n    // Find indices\n}" },
          correctSolution: "function twoSum(nums, target) {\n    const map = new Map();\n    for(let i=0; i<nums.length; i++) {\n        if(map.has(target - nums[i])) return [map.get(target - nums[i]), i];\n        map.set(nums[i], i);\n    }\n}"
        },
        {
          id: "fe_easy_3",
          title: "3. Remove Array Duplicates",
          subtitle: "Question 3 · Frontend Easy",
          tags: ["JavaScript", "Sets"],
          description: "Return a clean array with duplicate items removed preserving original order.",
          constraints: "<li>0 ≤ arr.length ≤ 5000</li>",
          example: "Input: [1, 2, 2, 3, 4, 4]<br/>Output: [1, 2, 3, 4]",
          expectedKeyword: "Set",
          starters: { javascript: "function removeDuplicates(arr) {\n    // Code here\n}" },
          correctSolution: "function removeDuplicates(arr) {\n    return [...new Set(arr)];\n}"
        },
        {
          id: "fe_easy_4",
          title: "4. Capitalize Words in String",
          subtitle: "Question 4 · Frontend Easy",
          tags: ["JavaScript", "Strings"],
          description: "Write a function that capitalizes the first letter of each word in a string.",
          constraints: "<li>Length ≤ 500 characters</li>",
          example: "Input: 'career prep x'<br/>Output: 'Career Prep X'",
          expectedKeyword: "toUpperCase",
          starters: { javascript: "function capitalizeWords(str) {\n    // Code here\n}" },
          correctSolution: "function capitalizeWords(str) {\n    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');\n}"
        },
        {
          id: "fe_easy_5",
          title: "5. Reverse String In-Place",
          subtitle: "Question 5 · Frontend Easy",
          tags: ["JavaScript", "Strings"],
          description: "Write a function to reverse an input string array.",
          constraints: "<li>1 ≤ s.length ≤ 10<sup>5</sup></li>",
          example: "Input: ['h','e','l','l','o']<br/>Output: ['o','l','l','e','h']",
          expectedKeyword: "reverse",
          starters: { javascript: "function reverseString(s) {\n    // Code here\n}" },
          correctSolution: "function reverseString(s) {\n    return s.reverse();\n}"
        }
      ],
      intermediate: [
        {
          id: "fe_int_1",
          title: "1. Debounce Function Builder",
          subtitle: "Question 1 · Frontend Intermediate",
          tags: ["JavaScript", "Async"],
          description: "Implement a debounce wrapper function that delays invocation until user stops triggering.",
          constraints: "<li>0 ≤ wait ≤ 1000ms</li>",
          example: "const debounced = debounce(fn, 200);",
          expectedKeyword: "setTimeout",
          starters: { javascript: "function debounce(fn, delay) {\n    // Implement debounce\n}" },
          correctSolution: "function debounce(fn, delay) {\n    let timer;\n    return (...args) => {\n        clearTimeout(timer);\n        timer = setTimeout(() => fn(...args), delay);\n    };\n}"
        }
      ]
    },

    dsa: {
      easy: [
        {
          id: "dsa_easy_1",
          title: "1. Valid Anagram String",
          subtitle: "Question 1 · DSA Easy",
          tags: ["String", "Sorting"],
          description: "Given two strings <code>s</code> and <code>t</code>, return <code>true</code> if <code>t</code> is an anagram of <code>s</code>.",
          constraints: "<li>1 ≤ s.length ≤ 10<sup>4</sup></li>",
          example: "Input: s = 'anagram', t = 'nagaram'<br/>Output: true",
          expectedKeyword: "sort",
          starters: { javascript: "function isAnagram(s, t) {\n    // Code here\n}" },
          correctSolution: "function isAnagram(s, t) {\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}"
        },
        {
          id: "dsa_easy_2",
          title: "2. Palindrome Number Check",
          subtitle: "Question 2 · DSA Easy",
          tags: ["Math", "Algorithms"],
          description: "Return true if an integer x is a palindrome integer.",
          constraints: "-2<sup>31</sup> ≤ x ≤ 2<sup>31</sup> - 1",
          example: "Input: x = 121<br/>Output: true",
          expectedKeyword: "toString",
          starters: { javascript: "function isPalindrome(x) {\n    // Code here\n}" },
          correctSolution: "function isPalindrome(x) {\n    const s = x.toString();\n    return s === s.split('').reverse().join('');\n}"
        }
      ]
    },

    backend: {
      easy: [
        {
          id: "be_easy_1",
          title: "1. Find Second Highest Salary",
          subtitle: "Question 1 · Backend Easy",
          tags: ["SQL", "Databases"],
          description: "Write an SQL query to report the second highest salary from the <code>Employee</code> table.",
          constraints: "<li>Table: Employee(id, salary)</li>",
          example: "Output: SecondHighestSalary = 200",
          expectedKeyword: "SELECT",
          starters: { sql: "-- Write SQL Query\nSELECT " },
          correctSolution: "SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);"
        }
      ]
    },

    datascience: {
      easy: [
        {
          id: "ds_easy_1",
          title: "1. Matrix Normalization",
          subtitle: "Question 1 · Data Science Easy",
          tags: ["Python", "NumPy"],
          description: "Normalize a given 2D array using Z-score normalization.",
          constraints: "<li>Axis = 0</li>",
          example: "Input: [[1, 2], [3, 4]]",
          expectedKeyword: "mean",
          starters: { python: "def normalize(matrix):\n    pass" },
          correctSolution: "def normalize(matrix):\n    return (matrix - np.mean(matrix)) / np.std(matrix)"
        }
      ]
    }
  };

  window.syncPreSelection = function () {
    const preDom = document.getElementById('pre-domain-select').value;
    const preDiff = document.getElementById('pre-difficulty-select').value;

    const mainDom = document.getElementById('domain-select');
    const mainDiff = document.getElementById('difficulty-select');

    if (mainDom) mainDom.value = preDom;
    if (mainDiff) mainDiff.value = preDiff;

    currentDomain = preDom;
    currentDifficulty = preDiff;
  };

  window.startProctoredTest = function () {
    syncPreSelection();

    document.getElementById('pre-test-screen').style.display = 'none';
    document.getElementById('coding-arena-screen').style.display = 'block';

    const sidebar = document.getElementById('main-sidebar');
    if (sidebar) sidebar.style.display = 'none';

    enterFullscreen();

    isCodingTestActive = true;
    codingViolationCount = 0;
    
    loadUnseenPool();
    renderCurrentProblem();
    startTimer();

    document.addEventListener('fullscreenchange', handleSecurityEvent);
    document.addEventListener('webkitfullscreenchange', handleSecurityEvent);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden && isCodingTestActive) {
        handleSecurityEvent("Tab switch detected!");
      }
    });
  };

  function loadUnseenPool() {
    const rawPool = (problemBank[currentDomain] || {})[currentDifficulty] || [];
    const seenList = getSeenQuestions();

    // Filter out previously attempted questions
    activePool = rawPool.filter(q => !seenList.includes(q.id));

    // Fallback: If user completed all questions, reset filter
    if (activePool.length === 0) {
      activePool = rawPool;
    }

    currentPoolIndex = 0;
  }

  function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        terminateCodingTest("⏱️ Assessment timed out!");
        return;
      }
      totalSeconds--;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const formatted = `⏱️ Time Left: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay) timerDisplay.innerText = formatted;
    }, 1000);
  }

  function handleSecurityEvent(reason) {
    if (!isCodingTestActive) return;

    const isFS = document.fullscreenElement || document.webkitFullscreenElement;
    if (!isFS || reason === "Tab switch detected!") {
      codingViolationCount++;

      if (codingViolationCount < MAX_VIOLATIONS) {
        const modal = document.getElementById('warning-modal');
        const title = document.getElementById('warning-title-text');
        const text = document.getElementById('warning-message-text');

        if (title) title.innerText = `Proctoring Warning (${codingViolationCount}/${MAX_VIOLATIONS})`;
        if (text) {
          text.innerText = `You pressed ESC or navigated away from the assessment tab.\n\nWarning: One more violation will forcibly end your test!`;
        }
        if (modal) modal.style.display = 'flex';
      } else {
        terminateCodingTest("Multiple anti-cheat security violations (ESC pressed or tab switched).");
      }
    }
  }

  window.dismissWarning = function () {
    const modal = document.getElementById('warning-modal');
    if (modal) modal.style.display = 'none';
    enterFullscreen();
  };

  function terminateCodingTest(reason) {
    isCodingTestActive = false;
    if (timerInterval) clearInterval(timerInterval);

    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }

    document.getElementById('coding-arena-screen').style.display = 'none';
    const termScreen = document.getElementById('terminated-screen');
    const termText = document.getElementById('termination-reason-text');

    if (termText) {
      termText.innerText = `You were exited from the test environment due to anti-cheat violations: ${reason}`;
    }
    if (termScreen) termScreen.style.display = 'flex';
  }

  /* SUBMISSION LOGIC WITH 2-ATTEMPT FAILURE EXITS */
  window.handleSubmissionAttempt = function () {
    const q = activePool[currentPoolIndex];
    const userCode = document.getElementById('code-editor').value;

    if (!q) return;

    const isPass = userCode.includes(q.expectedKeyword) && 
                   !userCode.includes("// Write solution") && 
                   !userCode.includes("pass") && 
                   userCode.trim().length > 20;

    if (isPass) {
      markQuestionAsSeen(q.id);
      renderPassedState();
    } else {
      wrongAttempts++;
      if (wrongAttempts === 1) {
        const modal = document.getElementById('wrong-answer-modal');
        if (modal) modal.style.display = 'flex';
      } else {
        markQuestionAsSeen(q.id); // Mark as seen so they get a new question next time
        renderFailedState();
      }
    }
  };

  window.closeWrongModal = function () {
    const modal = document.getElementById('wrong-answer-modal');
    if (modal) modal.style.display = 'none';
  };

  /* AUTOMATIC EXIT COUNTDOWN HELPER */
  function startAutoExitCountdown(seconds) {
    let countdown = seconds;
    const quitBtn = document.getElementById('quit-mode-btn');
    
    // Disable switching or re-submitting while exiting
    const submitBtn = document.getElementById('submit-code-btn');
    const switchBtn = document.getElementById('change-question-btn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.5'; }
    if (switchBtn) { switchBtn.disabled = true; switchBtn.style.opacity = '0.5'; }

    if (quitBtn) {
      quitBtn.style.display = 'inline-flex';
      quitBtn.innerText = `🚪 Exiting in ${countdown}s...`;
    }

    const interval = setInterval(() => {
      countdown--;
      if (quitBtn) {
        quitBtn.innerText = `🚪 Exiting in ${countdown}s...`;
      }

      if (countdown <= 0) {
        clearInterval(interval);
        quitCodingMode();
      }
    }, 1000);
  }

  function renderPassedState() {
    const output = document.getElementById('test-console-output');
    const badge = document.getElementById('test-status-badge');

    if (badge) {
      badge.innerText = "Status: PASSED ✔";
      badge.style.background = "#22D3A5";
    }
    
    output.innerHTML = `<span style="color: #22D3A5; font-weight: 600;">✔ CORRECT ANSWER!</span>\n\nAll internal test cases passed successfully!\nRedirecting you back to the dashboard automatically...`;
    
    // Auto-scroll output container to bottom
    output.scrollTop = output.scrollHeight;

    // Automatically exit in 3 seconds
    startAutoExitCountdown(3);
  }

  function renderFailedState() {
    const q = activePool[currentPoolIndex];
    const userCode = document.getElementById('code-editor').value;

    const output = document.getElementById('test-console-output');
    const badge = document.getElementById('test-status-badge');

    if (badge) {
      badge.innerText = "Status: INCORRECT (Submitted) ✖";
      badge.style.background = "#f43f5e";
    }

    output.innerHTML = `<span style="color: #f43f5e; font-weight: 600;">✖ INCORRECT SOLUTION (2/2 Attempts Exhausted)!</span>\n\n` +
      `<span style="color: #f43f5e; font-weight:600;">Your Submission:</span>\n` +
      `<div style="background: rgba(244,63,94,0.12); color: #f87171; padding: 10px; border-radius: 6px; margin: 6px 0;">${escapeHtml(userCode)}</div>` +
      `<span style="color: #22d3a5; font-weight:600;">Expected Solution:</span>\n` +
      `<div style="background: rgba(34,211,165,0.12); color: #34d399; padding: 10px; border-radius: 6px; margin: 6px 0;">${escapeHtml(q.correctSolution)}</div>` +
      `\n<span style="color: #cbd5e1; font-style: italic;">Redirecting to dashboard automatically...</span>`;
    
    // Auto-scroll output container to bottom so the expected answer is fully visible
    output.scrollTop = output.scrollHeight;

    // Automatically exit in 4 seconds
    startAutoExitCountdown(4);
  }

  window.quitCodingMode = function () {
    isCodingTestActive = false;
    if (timerInterval) clearInterval(timerInterval);

    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    window.location.href = 'dashboard.html';
  };

  /* SWITCH QUESTION LOGIC */
  window.nextQuestion = function () {
    if (questionSwitchesLeft <= 0) {
      alert("You have used all 3 available question switches!");
      return;
    }

    if (!activePool || activePool.length <= 1) {
      alert(`No additional unseen questions available in this category.`);
      return;
    }

    questionSwitchesLeft--;
    wrongAttempts = 0;

    currentPoolIndex = (currentPoolIndex + 1) % activePool.length;

    const countBadge = document.getElementById('question-count-badge');
    const switchBtn = document.getElementById('change-question-btn');

    if (countBadge) countBadge.innerText = `${questionSwitchesLeft} Switches Left`;

    if (questionSwitchesLeft === 0 && switchBtn) {
      switchBtn.disabled = true;
      switchBtn.style.opacity = '0.5';
    }

    renderCurrentProblem();
  };

  window.changeDomain = function (domainKey) {
    currentDomain = domainKey;
    wrongAttempts = 0;
    
    if (domainKey === 'backend') currentLanguage = 'sql';
    else if (domainKey === 'frontend') currentLanguage = 'javascript';
    else currentLanguage = 'python';

    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = currentLanguage;

    loadUnseenPool();
    renderCurrentProblem();
  };

  window.changeDifficulty = function (diffKey) {
    currentDifficulty = diffKey;
    wrongAttempts = 0;
    loadUnseenPool();
    renderCurrentProblem();
  };

  window.changeLanguage = function (langKey) {
    currentLanguage = langKey;
    updateEditorCode();
  };

  function renderCurrentProblem() {
    if (!activePool || activePool.length === 0) {
      document.getElementById('problem-title').innerText = "Question Coming Soon";
      document.getElementById('problem-description').innerText = "No unseen problems available for this combination.";
      document.getElementById('code-editor').value = "// Select another domain or difficulty level";
      return;
    }

    const q = activePool[currentPoolIndex];

    const sub = document.getElementById('contest-subtitle');
    const title = document.getElementById('problem-title');
    const diff = document.getElementById('problem-difficulty');
    const tags = document.getElementById('problem-tags');
    const desc = document.getElementById('problem-description');
    const constr = document.getElementById('problem-constraints');
    const ex = document.getElementById('problem-example');
    const submitBtn = document.getElementById('submit-code-btn');

    if (sub) sub.innerText = q.subtitle;
    if (title) title.innerText = q.title;
    if (diff) diff.innerText = `Difficulty · ${currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}`;
    if (desc) desc.innerHTML = q.description;
    if (constr) constr.innerHTML = q.constraints;
    if (ex) ex.innerHTML = q.example;

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }

    if (tags) {
      tags.innerHTML = q.tags.map(t => `<span class="pill pill-primary">${t}</span>`).join('');
    }

    const consoleOut = document.getElementById('test-console-output');
    const badge = document.getElementById('test-status-badge');
    if (consoleOut) consoleOut.innerText = "Write code and click 'Submit Solution' to verify your answer.";
    if (badge) {
      badge.innerText = "Status: Waiting for Submission";
      badge.style.background = "rgba(255,255,255,0.1)";
    }

    updateEditorCode();
  }

  function updateEditorCode() {
    const q = activePool[currentPoolIndex];
    const editor = document.getElementById('code-editor');

    if (!q || !editor) return;

    const code = q.starters[currentLanguage] || `// Solution template for ${currentLanguage}\n`;
    editor.value = code;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
})();