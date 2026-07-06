document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Mechanism
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
      themeIcon.className = 'bi bi-sun fs-5';
    } else {
      themeIcon.className = 'bi bi-moon fs-5';
    }
  }

  // Language Switch Simulation Logic
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      console.log(`Simulating Language Shift to: ${selectedLang.toUpperCase()}`);
      
      // Update cards showing translations
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

      // Update visibility of warnings/badges
      const cards = document.querySelectorAll('.post-card');
      cards.forEach(card => {
        const supportedLangs = card.getAttribute('data-supported-langs').split(',');
        const badge = card.querySelector('.badge-translation-warning');
        
        if (badge) {
          if (supportedLangs.includes(selectedLang)) {
            badge.classList.add('d-none');
          } else {
            badge.classList.remove('d-none');
            // Update badge text dynamically
            const origLangName = card.getAttribute('data-orig-lang-name');
            badge.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Available in ${origLangName} only`;
          }
        }
      });
    });
  }

  // Handle dynamic login state sync in header across all static pages
  const currentUser = localStorage.getItem('currentUser');
  const headerRight = document.querySelector('.app-header .header-container .d-flex.align-items-center.ms-auto');
  
  if (currentUser && headerRight) {
    // Check if header is in Guest state (contains a login link button)
    const hasLoginBtn = headerRight.querySelector('a[href*="login.html"]');
    if (hasLoginBtn) {
      // Determine root paths to adjust relative links correctly
      const isSubFolder = window.location.pathname.includes('/pages/');
      const writeUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}create-post.html`;
      const myPostsUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}my-posts.html`;
      const profileUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}profile.html`;
      const pwdUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}change-password.html`;
      const signOutUrl = `${isSubFolder ? '../guest/' : 'pages/guest/'}home.html`;
      const avatarImg = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150";

      // Remove guest login/subscribe links
      const guestLinks = headerRight.querySelectorAll('a[href*="login.html"], a[href*="register.html"]');
      guestLinks.forEach(el => el.remove());

      // Create & insert Write button
      const writeBtn = document.createElement('a');
      writeBtn.className = 'btn btn-primary btn-sm fw-medium px-3 d-none d-sm-inline-flex align-items-center';
      writeBtn.href = writeUrl;
      writeBtn.innerHTML = '<i class="bi bi-pencil-square me-1.5"></i> Write';
      headerRight.insertBefore(writeBtn, headerRight.firstChild);

      // Create & insert User Dropdown
      const dropdownDiv = document.createElement('div');
      dropdownDiv.className = 'dropdown ms-2';
      dropdownDiv.innerHTML = `
        <button class="btn btn-link p-0 border-0 text-reset dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="avatarDropdown"><img src="${avatarImg}" alt="User Avatar" class="rounded-circle" style="width: 34px; height: 34px; object-fit: cover;"></button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border border-light-subtle mt-2">
          <li class="px-3 py-2 border-bottom">
            <span class="d-block fw-bold text-main">${currentUser}</span>
            <span class="text-muted d-block" style="font-size: 0.75rem;">Member</span>
          </li>
          <li><a class="dropdown-item py-2" href="${writeUrl}"><i class="bi bi-pencil-square me-2"></i> Create Post</a></li>
          <li><a class="dropdown-item py-2" href="${myPostsUrl}"><i class="bi bi-journal-text me-2"></i> My Posts</a></li>
          <li><a class="dropdown-item py-2" href="${profileUrl}"><i class="bi bi-person me-2"></i> Profile Settings</a></li>
          <li><a class="dropdown-item py-2" href="${pwdUrl}"><i class="bi bi-shield-lock me-2"></i> Change Password</a></li>
          <li><hr class="dropdown-divider my-1"></li>
          <li><a class="dropdown-item py-2 text-danger" href="${signOutUrl}" id="globalSignOutBtn"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
        </ul>
      `;
      
      // Insert right before themeToggle
      const themeToggleBtn = document.getElementById('themeToggle');
      if (themeToggleBtn) {
        headerRight.insertBefore(dropdownDiv, themeToggleBtn);
      } else {
        headerRight.appendChild(dropdownDiv);
      }

      // Attach sign out event
      const signOutBtn = dropdownDiv.querySelector('#globalSignOutBtn');
      if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userRole');
        });
      }
    }
  }
});
