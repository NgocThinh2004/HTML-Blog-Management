document.addEventListener('DOMContentLoaded', () => {
  // ========================================================
  // Theme Toggle Mechanism
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
      themeIcon.className = 'bi bi-sun fs-5';
    } else {
      themeIcon.className = 'bi bi-moon fs-5';
    }
  }

  // ========================================================
  // Language Switch Simulation Logic
  // ========================================================
  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      console.log(`Simulating Language Shift to: ${selectedLang.toUpperCase()}`);
      
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
            const origLangName = card.getAttribute('data-orig-lang-name');
            badge.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> Available in ${origLangName} only`;
          }
        }
      });
    });
  }

  // ========================================================
  // Session State Sync (Desktop Sidebar & Mobile Header)
  // ========================================================
  const currentUser = localStorage.getItem('currentUser');
  const isSubFolder = window.location.pathname.includes('/pages/');

  // Relative link paths based on directory depth
  const writeUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}create-post.html`;
  const myPostsUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}my-posts.html`;
  const profileUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}profile.html`;
  const pwdUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}change-password.html`;
  const signOutUrl = `${isSubFolder ? '../guest/' : 'pages/guest/'}home.html`;
  const avatarImg = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150";

  // A. MOBILE NAVBAR ADJUSTMENTS
  const mobileHeaderRight = document.getElementById('mobileHeaderRight');
  if (mobileHeaderRight) {
    if (currentUser) {
      mobileHeaderRight.innerHTML = `
        <div class="dropdown">
          <button class="btn btn-link p-0 border-0 text-reset dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="${avatarImg}" alt="User Avatar" class="rounded-circle" style="width: 32px; height: 32px; object-fit: cover;">
          </button>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border border-light-subtle mt-2">
            <li class="px-3 py-2 border-bottom">
              <span class="d-block fw-bold text-main">${currentUser}</span>
              <span class="text-muted d-block" style="font-size: 0.75rem;">Member</span>
            </li>
            <li><a class="dropdown-item py-2" href="${writeUrl}"><i class="bi bi-pencil-square me-2"></i> Create Post</a></li>
            <li><a class="dropdown-item py-2" href="${myPostsUrl}"><i class="bi bi-journal-text me-2"></i> My Posts</a></li>
            <li><a class="dropdown-item py-2" href="${profileUrl}"><i class="bi bi-person me-2"></i> Settings</a></li>
            <li><hr class="dropdown-divider my-1"></li>
            <li><a class="dropdown-item py-2 text-danger" href="${signOutUrl}" id="mobileSignOutLink"><i class="bi bi-box-arrow-right me-2"></i> Sign Out</a></li>
          </ul>
        </div>
      `;
      const mobSignOut = mobileHeaderRight.querySelector('#mobileSignOutLink');
      if (mobSignOut) {
        mobSignOut.addEventListener('click', () => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userRole');
        });
      }
    }
  }

  // B. DESKTOP SIDEBAR ADJUSTMENTS
  const leftSidebar = document.querySelector('.left-sidebar');
  if (leftSidebar) {
    const createBtn = leftSidebar.querySelector('.sidebar-create-btn');
    const profileLink = leftSidebar.querySelector('.sidebar-nav-item[href*="profile.html"]');
    const signOutBtn = leftSidebar.querySelector('#signOutBtn');
    
    // Sửa link dropdown More
    const moreMenuDropdown = leftSidebar.querySelector('.dropdown-menu');
    if (moreMenuDropdown) {
      // Cập nhật lại đường dẫn cho menu More
      const adminLink = moreMenuDropdown.querySelector('a[href*="dashboard.html"]');
      if (adminLink) adminLink.href = `${isSubFolder ? '../admin/' : 'pages/admin/'}dashboard.html`;
      
      const pwdLink = moreMenuDropdown.querySelector('a[href*="change-password.html"]');
      if (pwdLink) pwdLink.href = pwdUrl;
    }

    if (currentUser) {
      // Người dùng đã đăng nhập: hiện nút Write & cập nhật link Profile
      if (createBtn) {
        createBtn.classList.remove('d-none');
        createBtn.href = writeUrl;
      }
      if (profileLink) {
        profileLink.classList.remove('d-none');
        profileLink.href = profileUrl;
        profileLink.innerHTML = `<i class="bi bi-person-fill"></i> ${currentUser}`;
      }
    } else {
      // Người dùng là khách vãng lai: ẩn nút Write & đổi link Profile thành Log In
      if (createBtn) {
        createBtn.classList.add('d-none');
      }
      if (profileLink) {
        profileLink.href = `${isSubFolder ? '../guest/' : 'pages/guest/'}login.html`;
        profileLink.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> Log In`;
      }
    }

    // Attach sign-out handler to desktop logout item
    if (signOutBtn) {
      signOutBtn.addEventListener('click', (e) => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = signOutUrl;
      });
    }
  }
});
