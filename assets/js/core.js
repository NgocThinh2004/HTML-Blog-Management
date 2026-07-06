document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // Theme Toggle Mechanism (Circle button)
  // ========================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  htmlElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = htmlElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-bs-theme', activeTheme);
      localStorage.setItem('theme', activeTheme);
      updateThemeIcon(activeTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'bi bi-sun';
    } else {
      themeIcon.className = 'bi bi-moon';
    }
  }

  // ========================================================
  // Dynamic Language Selector Rendering (CSDL languages table)
  // ========================================================
  // This array simulates the list of languages loaded from your database table 'languages'
  // If you add a new language to the database, you simply add it here and the UI adapts automatically!
  const databaseLanguages = [
    { code: 'en', name: 'EN' },
    { code: 'vi', name: 'VI' },
    { code: 'zh', name: 'ZH' }
    // Example: To add French, just uncomment the line below:
    // , { code: 'fr', name: 'FR' }
  ];

  const languageSelectGroup = document.getElementById('languageSelectGroup');
  if (languageSelectGroup) {
    // Clear static placeholders
    languageSelectGroup.innerHTML = '';

    // Render active languages dynamically
    databaseLanguages.forEach((lang, index) => {
      const button = document.createElement('button');
      button.className = `lang-pill-btn ${index === 0 ? 'active' : ''}`;
      button.setAttribute('data-value', lang.code);
      button.textContent = lang.name;

      button.addEventListener('click', () => {
        // Toggle active status in selector
        document.querySelectorAll('.lang-pill-btn').forEach(p => p.classList.remove('active'));
        button.classList.add('active');

        const selectedLang = lang.code;
        console.log(`Simulating Language Shift to: ${selectedLang.toUpperCase()}`);

        // Translate matching post-title and post-content in feeds
        const translatableTitles = document.querySelectorAll('[data-translate-title]');
        const translatableSummaries = document.querySelectorAll('[data-translate-summary]');

        translatableTitles.forEach(el => {
          const transVal = el.getAttribute(`data-translate-title-${selectedLang}`);
          if (transVal) el.textContent = transVal;
        });

        translatableSummaries.forEach(el => {
          const transVal = el.getAttribute(`data-translate-summary-${selectedLang}`);
          if (transVal) el.textContent = transVal;
        });
      });

      languageSelectGroup.appendChild(button);
    });
  }

  // ========================================================
  // Unified Create Action Gate (Auth check routing)
  // ========================================================
  const isSubFolder = window.location.pathname.includes('/pages/');
  const loginUrl = `${isSubFolder ? '../guest/' : 'pages/guest/'}login.html`;
  const writeUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}create-post.html`;

  // 1. Sidebar Create Button
  const createBtn = document.querySelector('.sidebar-create-btn') || document.getElementById('sidebarCreateBtn');
  if (createBtn) {
    createBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        window.location.href = writeUrl;
      } else {
        alert('Please log in first to write a post!');
        window.location.href = loginUrl;
      }
    });
  }

  // 2. Homepage Quick Draft Card
  const quickDraftCard = document.getElementById('quickDraftCard');
  if (quickDraftCard) {
    quickDraftCard.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        window.location.href = writeUrl;
      } else {
        alert('Please log in first to write a post!');
        window.location.href = loginUrl;
      }
    });
  }
});
