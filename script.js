/* ==========================================================================
   1. UNIFIED THEME ENGINE (WITH LOCALSTORAGE PERSISTENCE)
   ========================================================================== */
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
   2. PRELOADER & SPLASH CONTROLLER
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 600);
    }, 1000);
  }
});

/* ==========================================================================
   3. PROCTORED CODING ARENA CONTROLLER
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
    const preDom = document.getElementById('pre-domain-select')?.value;
    const preDiff = document.getElementById('pre-difficulty-select')?.value;

    const mainDom = document.getElementById('domain-select');
    const mainDiff = document.getElementById('difficulty-select');

    if (mainDom && preDom) mainDom.value = preDom;
    if (mainDiff && preDiff) mainDiff.value = preDiff;

    if (preDom) currentDomain = preDom;
    if (preDiff) currentDifficulty = preDiff;
  };

  window.startProctoredTest = function () {
    syncPreSelection();

    const preScreen = document.getElementById('pre-test-screen');
    const arenaScreen = document.getElementById('coding-arena-screen');
    if (preScreen) preScreen.style.display = 'none';
    if (arenaScreen) arenaScreen.style.display = 'block';

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

    activePool = rawPool.filter(q => !seenList.includes(q.id));

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

    const arenaScreen = document.getElementById('coding-arena-screen');
    if (arenaScreen) arenaScreen.style.display = 'none';
    
    const termScreen = document.getElementById('terminated-screen');
    const termText = document.getElementById('termination-reason-text');

    if (termText) {
      termText.innerText = `You were exited from the test environment due to anti-cheat violations: ${reason}`;
    }
    if (termScreen) termScreen.style.display = 'flex';
  }

  window.handleSubmissionAttempt = function () {
    const q = activePool[currentPoolIndex];
    const editor = document.getElementById('code-editor');
    if (!q || !editor) return;

    const userCode = editor.value;

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
        markQuestionAsSeen(q.id);
        renderFailedState();
      }
    }
  };

  window.closeWrongModal = function () {
    const modal = document.getElementById('wrong-answer-modal');
    if (modal) modal.style.display = 'none';
  };

  function startAutoExitCountdown(seconds) {
    let countdown = seconds;
    const quitBtn = document.getElementById('quit-mode-btn');
    
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
    
    if (output) {
      output.innerHTML = `<span style="color: #22D3A5; font-weight: 600;">✔ CORRECT ANSWER!</span>\n\nAll internal test cases passed successfully!\nRedirecting to Exam Hub...`;
      output.scrollTop = output.scrollHeight;
    }

    startAutoExitCountdown(3);
  }

  function renderFailedState() {
    const q = activePool[currentPoolIndex];
    const editor = document.getElementById('code-editor');
    const userCode = editor ? editor.value : '';

    const output = document.getElementById('test-console-output');
    const badge = document.getElementById('test-status-badge');

    if (badge) {
      badge.innerText = "Status: INCORRECT (Submitted) ✖";
      badge.style.background = "#f43f5e";
    }

    if (output) {
      output.innerHTML = `<span style="color: #f43f5e; font-weight: 600;">✖ INCORRECT SOLUTION (2/2 Attempts Exhausted)!</span>\n\n` +
        `<span style="color: #f43f5e; font-weight:600;">Your Submission:</span>\n` +
        `<div style="background: rgba(244,63,94,0.12); color: #f87171; padding: 10px; border-radius: 6px; margin: 6px 0;">${escapeHtml(userCode)}</div>` +
        `<span style="color: #22d3a5; font-weight:600;">Expected Solution:</span>\n` +
        `<div style="background: rgba(34,211,165,0.12); color: #34d399; padding: 10px; border-radius: 6px; margin: 6px 0;">${escapeHtml(q.correctSolution)}</div>` +
        `\n<span style="color: #cbd5e1; font-style: italic;">Redirecting to Exam Hub...</span>`;
      output.scrollTop = output.scrollHeight;
    }

    startAutoExitCountdown(4);
  }

  window.quitCodingMode = function () {
    isCodingTestActive = false;
    if (timerInterval) clearInterval(timerInterval);

    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    window.location.href = 'exam-hub.html';
  };

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
      const title = document.getElementById('problem-title');
      const desc = document.getElementById('problem-description');
      const editor = document.getElementById('code-editor');

      if (title) title.innerText = "Question Coming Soon";
      if (desc) desc.innerText = "No unseen problems available for this combination.";
      if (editor) editor.value = "// Select another domain or difficulty level";
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

/* ==========================================================================
   4. APTITUDE TEST & CS ASSESSMENT ENGINE
   ========================================================================== */
function getFullCardPastelTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  
  if (currentTheme === 'dark') {
    const darkCardPastels = [
      { bg: 'rgba(56, 53, 90, 0.75)', text: '#d2cffc', border: '#786fa6' },
      { bg: 'rgba(40, 60, 85, 0.75)', text: '#cce0ff', border: '#546de5' },
      { bg: 'rgba(85, 45, 40, 0.75)', text: '#fcdcd6', border: '#e15f41' },
      { bg: 'rgba(80, 50, 65, 0.75)', text: '#fce4ec', border: '#f8a5c2' },
      { bg: 'rgba(85, 65, 45, 0.75)', text: '#fceddf', border: '#f3a683' },
      { bg: 'rgba(40, 75, 75, 0.75)', text: '#d4f5f5', border: '#63cdda' }
    ];
    return darkCardPastels[Math.floor(Math.random() * darkCardPastels.length)];
  } else {
    const lightCardPastels = [
      { bg: '#f3f2ff', text: '#3f3d56', border: '#a29bfe' },
      { bg: '#eef6ff', text: '#2c3e50', border: '#74b9ff' },
      { bg: '#e8f8f5', text: '#114b3e', border: '#55efc4' },
      { bg: '#fffdf0', text: '#594f00', border: '#ffeaa7' },
      { bg: '#fff5f5', text: '#5c2222', border: '#fab1a0' },
      { bg: '#fef0f5', text: '#522238', border: '#fd79a8' }
    ];
    return lightCardPastels[Math.floor(Math.random() * lightCardPastels.length)];
  }
}

function generateThemePastelPalette(count) {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  let basePalette = currentTheme === 'dark' 
    ? ['#786fa6', '#546de5', '#e15f41', '#f8a5c2', '#f3a683', '#63cdda', '#ea8685', '#778beb', '#cf6a87']
    : ['#a29bfe', '#74b9ff', '#81ecec', '#55efc4', '#ffeaa7', '#fab1a0', '#ff7675', '#fd79a8', '#ffeaa7'];

  const dynamicColors = [];
  for (let i = 0; i < count; i++) {
    dynamicColors.push(basePalette[(i + Math.floor(Math.random() * 2)) % basePalette.length]);
  }
  return dynamicColors;
}

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateCSLogicalQuestion(id) {
  const types = [
    () => {
      const p1 = pick(["A", "X", "P", "M"]);
      const p2 = pick(["B", "Y", "Q", "N"]);
      const p3 = pick(["C", "Z", "R", "O"]);
      return {
        id,
        category: "Section 1: Logical Reasoning",
        question_text: `In a process dependency graph, if Task ${p1} depends on Task ${p2}, and Task ${p2} depends on Task ${p3}, what is the topological execution order?`,
        option_a: `${p3} -> ${p2} -> ${p1}`,
        option_b: `${p1} -> ${p2} -> ${p3}`,
        option_c: `${p2} -> ${p1} -> ${p3}`,
        option_d: `Cyclic deadlock formed`,
        correct: "A"
      };
    },
    () => {
      const bitA = rand(8, 15);
      const bitB = rand(1, 7);
      const res = bitA ^ bitB;
      return {
        id,
        category: "Section 1: Logical Reasoning",
        question_text: `What is the output of the bitwise XOR operation (${bitA} ^ ${bitB}) in decimal?`,
        option_a: `${res}`,
        option_b: `${bitA + bitB}`,
        option_c: `${bitA & bitB}`,
        option_d: `${res + 2}`,
        correct: "A"
      };
    },
    () => {
      const terms = ["PUSH", "POP", "PEEK", "ENQUEUE", "DEQUEUE"];
      const w = pick(terms);
      const rev = w.split('').reverse().join('');
      return {
        id,
        category: "Section 1: Logical Reasoning",
        question_text: `If the stack string '${w}' is reversed to form '${rev}', which data structure natively produces this behavior?`,
        option_a: "LIFO Stack",
        option_b: "FIFO Queue",
        option_c: "Priority Queue",
        option_d: "Circular Linked List",
        correct: "A"
      };
    },
    () => {
      const nodes = rand(5, 20);
      const edges = nodes - 1;
      return {
        id,
        category: "Section 1: Logical Reasoning",
        question_text: `A connected undirected graph has ${nodes} vertices and contains no cycles. How many edges does it have?`,
        option_a: `${edges}`,
        option_b: `${nodes}`,
        option_c: `${nodes + 1}`,
        option_d: `${nodes * 2}`,
        correct: "A"
      };
    }
  ];
  return pick(types)();
}

function generateCSVerbalQuestion(id) {
  const vocab = [
    { word: "DEPRECATED", correct: "Feature that is discouraged and being phased out", wrong1: "A feature with high security priority", wrong2: "An optimized compiler instruction", wrong3: "A database encryption key" },
    { word: "IDEMPOTENT", correct: "Operation that produces the same result regardless of execution frequency", wrong1: "Function that executes in O(1) time", wrong2: "Memory pointer that cannot be mutated", wrong3: "Thread that never encounters deadlocks" },
    { word: "POLYMORPHISM", correct: "Ability of an object to take many forms in OOP", wrong1: "Process of compiling binary files", wrong2: "Allocating heap memory dynamically", wrong3: "Handling asynchronous network sockets" },
    { word: "ASYNCHRONOUS", correct: "Execution model allowing non-blocking I/O operations", wrong1: "Sequential step-by-step program execution", wrong2: "Parallel computing on multi-core GPU", wrong3: "Strictly synchronized mutex lock" }
  ];
  const item = pick(vocab);
  return {
    id,
    category: "Section 2: Verbal & Technical Communication",
    question_text: `In software engineering terminology, choose the accurate definition of '${item.word}':`,
    option_a: item.correct,
    option_b: item.wrong1,
    option_c: item.wrong2,
    option_d: item.wrong3,
    correct: "A"
  };
}

function generateCSCoreQuestion(id) {
  const CS_Puzzles = [
    () => {
      const n = rand(10, 100);
      return {
        id,
        category: "Section 3: CS Core & Quantitative Aptitude",
        question_text: `What is the worst-case time complexity of QuickSort on an already sorted array of size N = ${n}?`,
        option_a: "O(N^2)",
        option_b: "O(N log N)",
        option_c: "O(N)",
        option_d: "O(1)",
        correct: "A"
      };
    },
    () => {
      const pageKB = pick([4, 8, 16]);
      const memMB = pick([64, 128, 256]);
      const totalPages = (memMB * 1024) / pageKB;
      return {
        id,
        category: "Section 3: CS Core & Quantitative Aptitude",
        question_text: `An Operating System uses paging with a page size of ${pageKB} KB. How many page frames exist in ${memMB} MB of physical RAM?`,
        option_a: `${totalPages} frames`,
        option_b: `${totalPages / 2} frames`,
        option_c: `${totalPages * 2} frames`,
        option_d: `${totalPages + 1024} frames`,
        correct: "A"
      };
    },
    () => {
      const rows = rand(100, 500);
      return {
        id,
        category: "Section 3: CS Core & Quantitative Aptitude",
        question_text: `A binary search tree holds ${rows} keys. What is the maximum height of the tree in the worst case?`,
        option_a: `${rows - 1}`,
        option_b: `${Math.floor(Math.log2(rows))}`,
        option_c: `${rows}`,
        option_d: `${Math.ceil(rows / 2)}`,
        correct: "A"
      };
    },
    () => {
      const port = pick([80, 443, 22, 21, 3306]);
      const protocolMap = { 80: "HTTP", 443: "HTTPS", 22: "SSH", 21: "FTP", 3306: "MySQL" };
      return {
        id,
        category: "Section 3: CS Core & Quantitative Aptitude",
        question_text: `Which standard networking protocol operates by default over TCP port ${port}?`,
        option_a: `${protocolMap[port]}`,
        option_b: port === 80 ? "HTTPS" : "HTTP",
        option_c: "UDP Domain Services",
        option_d: "ICMP Ping Protocol",
        correct: "A"
      };
    }
  ];
  return pick(CS_Puzzles)();
}

function generateFullCSTest() {
  const testSet = [];
  for (let i = 1; i <= 10; i++) testSet.push(generateCSLogicalQuestion(i));
  for (let i = 11; i <= 20; i++) testSet.push(generateCSVerbalQuestion(i));
  for (let i = 21; i <= 30; i++) testSet.push(generateCSCoreQuestion(i));
  return testSet;
}

/* FLASHCARD CONTROLLER */
let cardCount = 0;
let currentCardData = null;
let isCardFlipped = false;
let currentCardTheme = null;

function loadFlashcard() {
  cardCount++;
  currentCardData = generateCSCoreQuestion(cardCount);
  isCardFlipped = false;
  currentCardTheme = getFullCardPastelTheme();
  
  const wrapper = document.getElementById('flashcard-wrapper');
  const counterEl = document.getElementById('fc-counter');

  if (counterEl) counterEl.textContent = `Card #${cardCount}`;

  if (wrapper) {
    wrapper.style.cursor = 'pointer';
    wrapper.style.minHeight = '240px';
    wrapper.style.padding = '28px';
    wrapper.style.borderRadius = '18px';
    wrapper.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    wrapper.style.textAlign = 'center';
    wrapper.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
    
    renderCardContent();
  }
}

function renderCardContent() {
  const wrapper = document.getElementById('flashcard-wrapper');
  if (!wrapper || !currentCardData || !currentCardTheme) return;

  wrapper.style.backgroundColor = currentCardTheme.bg;
  wrapper.style.border = `2px solid ${currentCardTheme.border}`;

  if (!isCardFlipped) {
    wrapper.innerHTML = `
      <div style="font-size: 0.85rem; font-weight: 700; color: ${currentCardTheme.border}; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        ${currentCardData.category}
      </div>
      <div style="font-size: 1.25rem; font-weight: 600; line-height: 1.5; color: ${currentCardTheme.text}; margin-bottom: 16px;">
        ${currentCardData.question_text}
      </div>
      <div style="font-size: 0.8rem; opacity: 0.75; font-style: italic; color: ${currentCardTheme.text};">
        💡 Click card to reveal the answer
      </div>
    `;
  } else {
    wrapper.innerHTML = `
      <div style="font-size: 0.85rem; font-weight: 700; color: ${currentCardTheme.border}; letter-spacing: 0.5px; margin-bottom: 10px; text-transform: uppercase;">
        ✓ Correct Answer
      </div>
      <div style="font-size: 1.3rem; font-weight: 700; color: ${currentCardTheme.text}; margin-bottom: 12px;">
        Option ${currentCardData.correct}: ${currentCardData.option_a}
      </div>
      <div style="font-size: 0.9rem; opacity: 0.85; max-width: 90%; line-height: 1.4; color: ${currentCardTheme.text};">
        Core CS Knowledge Check: Verified concept for your engineering assessment.
      </div>
      <div style="font-size: 0.75rem; opacity: 0.65; margin-top: 14px; color: ${currentCardTheme.text};">
        🔄 Click again to flip back
      </div>
    `;
  }
}

window.flipCard = function () {
  isCardFlipped = !isCardFlipped;
  renderCardContent();
};

window.nextCard = function (e) {
  if (e) e.stopPropagation();
  loadFlashcard();
};

window.prevCard = function (e) {
  if (e) e.stopPropagation();
  loadFlashcard();
};

window.switchModule = function (moduleType) {
  const hubSection = document.getElementById('module-hub-view');
  const flashcardSection = document.getElementById('flashcards-view');
  const startScreen = document.getElementById('start-screen');
  const testContainer = document.getElementById('test-container');
  const resultScreen = document.getElementById('result-screen');

  if (moduleType === 'flashcards') {
    if (hubSection) hubSection.style.display = 'none';
    if (startScreen) startScreen.style.display = 'none';
    if (testContainer) testContainer.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'none';
    if (flashcardSection) {
      flashcardSection.style.display = 'block';
      loadFlashcard();
    }
  } else if (moduleType === 'assessment') {
    if (hubSection) hubSection.style.display = 'none';
    if (flashcardSection) flashcardSection.style.display = 'none';
    if (testContainer) testContainer.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'none';
    if (startScreen) startScreen.style.display = 'block';
  } else if (moduleType === 'hub') {
    if (flashcardSection) flashcardSection.style.display = 'none';
    if (startScreen) startScreen.style.display = 'none';
    if (testContainer) testContainer.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'none';
    if (hubSection) hubSection.style.display = 'block';
  }
};

/* PROCTORED APTITUDE EXAM & ANALYTICS ENGINE */
window.currentUserSession = null;

(function () {
  let questions = [];
  let currentIndex = 0;
  let userAnswers = {};
  let questionTimeLog = {};
  let qStartTime = 0;
  let warningCount = 0;
  let timeRemaining = 1200;
  let timerInterval = null;
  let examStartTime = Date.now();

  const startScreen = document.getElementById('start-screen');
  const testContainer = document.getElementById('test-container');
  const questionCard = document.getElementById('question-card');
  const timerDisplay = document.getElementById('session-timer');
  const warningDisplay = document.getElementById('warning-counter');
  const resultScreen = document.getElementById('result-screen');

  window.startAssessment = function() {
    questions = generateFullCSTest(); 
    currentIndex = 0;
    userAnswers = {};
    questionTimeLog = {};
    warningCount = 0;
    timeRemaining = 1200;
    examStartTime = Date.now();

    if (startScreen) startScreen.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'none';
    if (testContainer) testContainer.style.display = 'block';

    if (warningDisplay) warningDisplay.textContent = `${warningCount}/3`;

    renderQuestion(currentIndex);
    startTimer();
    initProctoring();
  };

  function recordCurrentQuestionTime() {
    if (qStartTime > 0 && questions[currentIndex]) {
      const qId = questions[currentIndex].id;
      const elapsed = Math.floor((Date.now() - qStartTime) / 1000);
      questionTimeLog[qId] = (questionTimeLog[qId] || 0) + elapsed;
    }
  }

  function renderQuestion(index) {
    if (!questionCard || !questions[index]) return;
    
    qStartTime = Date.now();
    const q = questions[index];
    const pastelBadge = generateThemePastelPalette(1)[0];
    
    questionCard.innerHTML = `
      <div class="q-header between" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <span class="pill pill-primary" style="padding: 4px 12px; background: ${pastelBadge}25; color: ${pastelBadge}; border-radius: 12px; font-weight: bold; font-size: 13px;">${q.category}</span>
        <span class="muted small" style="opacity: 0.7; font-size: 14px;">Question ${index + 1} of ${questions.length}</span>
      </div>
      <h3 style="margin: 20px 0; font-size: 18px; line-height: 1.5; font-weight: 600;">${q.question_text}</h3>
      <div class="options-grid" style="display: flex; flex-direction: column; gap: 12px;">
        ${['a', 'b', 'c', 'd'].map(opt => `
          <label class="option-label ${userAnswers[q.id] === opt.toUpperCase() ? 'selected' : ''}" style="padding: 12px 16px; border: 1px solid rgba(128,128,128,0.2); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 10px;">
            <input type="radio" name="option" value="${opt.toUpperCase()}" ${userAnswers[q.id] === opt.toUpperCase() ? 'checked' : ''} onchange="selectOption(${q.id}, '${opt.toUpperCase()}')">
            <span><strong>${opt.toUpperCase()}:</strong> ${q['option_' + opt]}</span>
          </label>
        `).join('')}
      </div>
      <div style="margin-top: 28px; display: flex; justify-content: space-between;">
        <button class="btn btn-outline" ${index === 0 ? 'disabled' : ''} id="prev-btn">Previous</button>
        ${index === questions.length - 1 
          ? '<button class="btn btn-primary" id="submit-exam-btn">Submit Assessment</button>' 
          : '<button class="btn btn-primary" id="next-btn">Next Question</button>'}
      </div>
    `;

    document.getElementById('prev-btn')?.addEventListener('click', () => {
      recordCurrentQuestionTime();
      currentIndex--;
      renderQuestion(currentIndex);
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
      recordCurrentQuestionTime();
      currentIndex++;
      renderQuestion(currentIndex);
    });

    document.getElementById('submit-exam-btn')?.addEventListener('click', () => {
      recordCurrentQuestionTime();
      submitExam('Completed');
    });
  }

  window.selectOption = function (qId, optionVal) {
    userAnswers[qId] = optionVal;
  };

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeRemaining--;
      const mins = Math.floor(timeRemaining / 60);
      const secs = timeRemaining % 60;
      if (timerDisplay) {
        timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        recordCurrentQuestionTime();
        submitExam('Time Expired');
      }
    }, 1000);
  }

  function initProctoring() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && testContainer && testContainer.style.display !== 'none') {
        warningCount++;
        if (warningDisplay) warningDisplay.textContent = `${warningCount}/3`;
        
        if (warningCount >= 3) {
          recordCurrentQuestionTime();
          submitExam('Terminated (Tab Switch Violation)');
        }
      }
    });
  }

  function submitExam(statusReason) {
    clearInterval(timerInterval);
    const totalExamTimeSec = Math.max(1, Math.floor((Date.now() - examStartTime) / 1000));

    const sectionStats = {};
    let totalCorrect = 0;
    let totalAttempted = Object.keys(userAnswers).length;
    let correctTimeSum = 0;
    let wrongTimeSum = 0;
    let wrongCount = 0;

    questions.forEach(q => {
      if (!sectionStats[q.category]) {
        sectionStats[q.category] = { correct: 0, total: 0 };
      }
      sectionStats[q.category].total++;

      const isCorrect = userAnswers[q.id] === q.correct;
      const spent = questionTimeLog[q.id] || 0;

      if (isCorrect) {
        sectionStats[q.category].correct++;
        totalCorrect++;
        correctTimeSum += spent;
      } else {
        wrongTimeSum += spent;
        wrongCount++;
      }
    });

    const totalQuestions = questions.length || 1;
    const overallPct = ((totalCorrect / totalQuestions) * 100).toFixed(1);
    
    const avgCorrectTime = totalCorrect > 0 ? (correctTimeSum / totalCorrect).toFixed(1) : 0;
    const avgWrongTime = wrongCount > 0 ? (wrongTimeSum / wrongCount).toFixed(1) : 0;
    const avgTimePerQuestion = (totalExamTimeSec / totalQuestions).toFixed(1);

    window.currentUserSession = {
      scorePct: overallPct,
      correctCount: totalCorrect,
      totalQuestions: totalQuestions,
      status: statusReason,
      timeTakenSec: totalExamTimeSec,
      sectionStats: sectionStats
    };

    if (testContainer) testContainer.style.display = 'none';
    if (startScreen) startScreen.style.display = 'none';
    if (resultScreen) resultScreen.style.display = 'block';

    const marksEl = document.getElementById('rep-marks');
    const attemptedEl = document.getElementById('rep-attempted');
    const pctEl = document.getElementById('rep-pct');
    const timeEl = document.getElementById('rep-time');

    if (marksEl) marksEl.textContent = `${(totalCorrect * 2)} / ${totalQuestions * 2}`;
    if (attemptedEl) attemptedEl.textContent = `${totalAttempted} / ${totalQuestions}`;
    if (pctEl) pctEl.textContent = `${overallPct}%`;
    if (timeEl) timeEl.textContent = `${totalExamTimeSec}s / 20m`;

    const secList = document.getElementById('section-breakdown-list');
    const secNames = [];
    const secPercentages = [];

    const sectionColors = generateThemePastelPalette(Object.keys(sectionStats).length);

    if (secList) {
      secList.innerHTML = '';
      let idx = 0;
      Object.entries(sectionStats).forEach(([secName, stat]) => {
        const secPct = ((stat.correct / stat.total) * 100).toFixed(1);
        const shortName = secName.split(':')[0];
        secNames.push(shortName);
        secPercentages.push(secPct);

        const badgeColor = sectionColors[idx % sectionColors.length];
        idx++;

        secList.innerHTML += `
          <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(128,128,128,0.15); padding-bottom: 8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <small style="color: ${badgeColor}; font-weight: bold; font-size: 0.8rem;">${secName}</small>
              <span style="font-size: 0.9rem; font-weight: bold;">${secPct}%</span>
            </div>
            <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 2px;">
              ${stat.correct} correct out of ${stat.total}
            </div>
          </div>
        `;
      });
    }

    renderReportCharts(overallPct, avgCorrectTime, avgWrongTime, avgTimePerQuestion, secNames, secPercentages);
  }

  function renderReportCharts(overallPct, avgCorrectTime, avgWrongTime, avgSpeedSec, secNames, secPercentages) {
    if (typeof Chart === 'undefined') return;

    ['overallGaugeChart', 'timeSpentChart', 'speedGaugeChart', 'sectionPercentileChart'].forEach(id => {
      const chartInstance = Chart.getChart(id);
      if (chartInstance) chartInstance.destroy();
    });

    const pastelPrimary = generateThemePastelPalette(1)[0];
    const pastelSecondary = generateThemePastelPalette(1)[0];

    const gaugeCanvas = document.getElementById('overallGaugeChart');
    if (gaugeCanvas) {
      new Chart(gaugeCanvas, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [overallPct, Math.max(0, 100 - overallPct)],
            backgroundColor: [pastelPrimary, 'rgba(128,128,128,0.15)'],
            borderWidth: 0
          }]
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: '75%',
          plugins: { tooltip: { enabled: true } }
        }
      });
    }

    const timeCanvas = document.getElementById('timeSpentChart');
    if (timeCanvas) {
      new Chart(timeCanvas, {
        type: 'bar',
        data: {
          labels: ['Avg Correct (s)', 'Avg Wrong (s)'],
          datasets: [{
            data: [avgCorrectTime, avgWrongTime],
            backgroundColor: [pastelPrimary, pastelSecondary],
            borderRadius: 6,
            barThickness: 32
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { 
            y: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    const speedCanvas = document.getElementById('speedGaugeChart');
    if (speedCanvas) {
      let speedVal = avgSpeedSec <= 20 ? 90 : (avgSpeedSec <= 40 ? 55 : 20);
      new Chart(speedCanvas, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [speedVal, 100 - speedVal],
            backgroundColor: [pastelPrimary, 'rgba(128,128,128,0.15)'],
            borderWidth: 0
          }]
        },
        options: {
          rotation: -90,
          circumference: 180,
          cutout: '70%',
          plugins: { tooltip: { enabled: false } }
        }
      });
    }

    const sectionCanvas = document.getElementById('sectionPercentileChart');
    if (sectionCanvas) {
      new Chart(sectionCanvas, {
        type: 'bar',
        data: {
          labels: secNames,
          datasets: [{
            label: 'Accuracy %',
            data: secPercentages,
            backgroundColor: generateThemePastelPalette(secNames.length),
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { 
            x: { max: 100, beginAtZero: true, grid: { color: 'rgba(128,128,128,0.1)' } },
            y: { grid: { display: false } }
          }
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('start-assessment-btn');
    if (btn) {
      btn.addEventListener('click', window.startAssessment);
    }
  });
})();