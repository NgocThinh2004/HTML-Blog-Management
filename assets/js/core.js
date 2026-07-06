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
  // Language Switch Simulation Logic (Inline Custom Pills)
  // ========================================================
  const langPills = document.querySelectorAll('.lang-pill-btn');
  langPills.forEach(pill => {
    pill.addEventListener('click', () => {
      langPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const selectedLang = pill.getAttribute('data-value');
      
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

      // Update warnings
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
  });

  // ========================================================
  // Session State Sync (CSDL Roles & Login validations)
  // ========================================================
  const currentUser = localStorage.getItem('currentUser');
  const userRole = localStorage.getItem('userRole'); // 'admin', 'author', or null
  const isSubFolder = window.location.pathname.includes('/pages/');

  // Relative link paths based on directory depth
  const loginUrl = `${isSubFolder ? '../guest/' : 'pages/guest/'}login.html`;
  const writeUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}create-post.html`;
  const myPostsUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}my-posts.html`;
  const profileUrl = `${isSubFolder ? '../owner/' : 'pages/owner/'}profile.html`;
  const signOutUrl = `${isSubFolder ? '../guest/' : 'pages/guest/'}home.html`;
  const avatarImg = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150";

  // A. MOBILE NAVBAR STATE ADJUSTMENT
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
    } else {
      mobileHeaderRight.innerHTML = `<a href="${loginUrl}" class="btn btn-primary btn-sm fw-medium px-3">Log in</a>`;
    }
  }

  // B. DESKTOP SIDEBAR STATE ADJUSTMENTS (CSDL Role gates)
  const leftSidebar = document.querySelector('.left-sidebar');
  if (leftSidebar) {
    const createBtn = leftSidebar.querySelector('.sidebar-create-btn') || document.getElementById('sidebarCreateBtn');
    const profileLink = leftSidebar.querySelector('.sidebar-nav-item[href*="profile.html"]') || document.getElementById('sidebarProfileLink');
    const signOutBtn = leftSidebar.querySelector('#signOutBtn');
    const adminPanelLink = leftSidebar.querySelector('a[href*="dashboard.html"]') || document.getElementById('adminPanelLink');
    const quickDraftCard = document.getElementById('quickDraftCard');

    // 1. Check logged-in user session
    if (currentUser) {
      // User logged in: show writing options
      if (createBtn) {
        createBtn.classList.remove('d-none');
        createBtn.href = writeUrl;
      }
      if (profileLink) {
        profileLink.href = profileUrl;
        profileLink.innerHTML = `<i class="bi bi-person-fill" style="color: var(--primary-color);"></i> ${currentUser}`;
      }
      if (quickDraftCard) {
        quickDraftCard.style.display = 'flex'; // Show quick draft box on home page feed
        const qAvatar = document.getElementById('quickDraftAvatar');
        if (qAvatar) qAvatar.src = avatarImg;
      }
      
      // 2. Authorization checks: Admin role check
      if (userRole === 'admin') {
        if (adminPanelLink) {
          adminPanelLink.closest('li').style.display = 'block'; // Show Admin panel link
        }
      } else {
        if (adminPanelLink) {
          adminPanelLink.closest('li').style.display = 'none'; // Hide Admin panel link for regular authors/readers
        }
      }
    } else {
      // Guest state: hide writing widgets, change profile to Login action
      if (createBtn) {
        createBtn.classList.add('d-none');
      }
      if (profileLink) {
        profileLink.href = loginUrl;
        profileLink.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> Log In`;
      }
      if (quickDraftCard) {
        quickDraftCard.style.display = 'none'; // Hide quick draft
      }
      if (adminPanelLink) {
        adminPanelLink.closest('li').style.display = 'none'; // Hide Admin panel link for guests
      }
    }

    // Attach sign-out handler to desktop logout action item
    if (signOutBtn) {
      signOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = signOutUrl;
      });
    }
  }
});
