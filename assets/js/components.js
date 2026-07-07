// ========================================================
// MundiBlog Global Component Interactivity & Search Modal
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('MundiBlog Component Interactivity Initialized.');
  initGlobalSearchModal();
});

/**
 * Initializes the Substack-style Global Search Modal Overlay.
 * Automatically creates DOM elements, binds keyboard shortcuts (Ctrl+K, ESC),
 * triggers from existing search boxes, and handles live instant search.
 */
function initGlobalSearchModal() {
  if (document.getElementById('globalSearchModal')) return;

  // 1. Build Modal DOM Structure
  const modalDiv = document.createElement('div');
  modalDiv.id = 'globalSearchModal';
  modalDiv.className = 'search-modal-backdrop';
  modalDiv.setAttribute('role', 'dialog');
  modalDiv.setAttribute('aria-modal', 'true');

  modalDiv.innerHTML = `
    <div class="search-modal-box" id="searchModalBox">
      <div class="search-modal-header">
        <i class="bi bi-search"></i>
        <input type="text" id="modalSearchInput" class="search-modal-input" placeholder="Search people, publications, or topics..." autocomplete="off">
        <button type="button" class="search-modal-close" id="modalSearchClose" aria-label="Clear text" style="display: none;">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="search-modal-body">
        <!-- Horizontally Scrollable Avatars & Topics -->
        <div id="modalPeopleContainer">
          <div class="search-section-title" id="modalSectionPeople" data-i18n="recommended_people">People & Publications</div>
          <div class="search-avatar-scroll" id="modalAvatarScroll">
            <a href="post-detail.html?id=1" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Elena">
              <span class="search-avatar-label">Elena R.</span>
            </a>
            <a href="post-detail.html?id=2" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Li Ming">
              <span class="search-avatar-label">Li Ming</span>
            </a>
            <a href="post-detail.html?id=3" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Tuấn">
              <span class="search-avatar-label">Tuấn Hồ</span>
            </a>
            <a href="post-detail.html?id=4" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Sarah">
              <span class="search-avatar-label">Sarah C.</span>
            </a>
            <a href="post-detail.html?id=5" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Alex">
              <span class="search-avatar-label">Alex R.</span>
            </a>
            <a href="post-detail.html?id=6" class="search-avatar-item">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=80&h=80" class="search-avatar-img" alt="Maya">
              <span class="search-avatar-label">Maya Lin</span>
            </a>
          </div>
        </div>

        <!-- Trending Topics (Default View) -->
        <div id="modalTrendingContainer">
          <div class="search-section-title" id="modalSectionTrending" data-i18n="trending_topics">Trending topics</div>
          <div class="search-trending-list">
            <div class="search-trending-item" data-query="AI Agentic Coding"><i class="bi bi-graph-up-arrow"></i> <span>AI Agentic Coding in 2026</span></div>
            <div class="search-trending-item" data-query="Rust gRPC"><i class="bi bi-graph-up-arrow"></i> <span>Rust & gRPC Microservices</span></div>
            <div class="search-trending-item" data-query="Glassmorphism"><i class="bi bi-graph-up-arrow"></i> <span>Glassmorphism UI Principles</span></div>
            <div class="search-trending-item" data-query="Web Rendering"><i class="bi bi-graph-up-arrow"></i> <span>Modern Web Rendering Architectures</span></div>
            <div class="search-trending-item" data-query="Color Psychology"><i class="bi bi-graph-up-arrow"></i> <span>The Psychology of Color in Web Apps</span></div>
          </div>
        </div>

        <!-- Live Search Results (Hidden until typing) -->
        <div id="modalResultsContainer" style="display: none;">
          <div class="search-section-title" id="modalSectionResults">Search Results</div>
          <div class="search-results-list" id="modalResultsList"></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modalDiv);

  const searchInput = document.getElementById('modalSearchInput');
  const closeBtn = document.getElementById('modalSearchClose');
  const peopleContainer = document.getElementById('modalPeopleContainer');
  const trendingContainer = document.getElementById('modalTrendingContainer');
  const resultsContainer = document.getElementById('modalResultsContainer');
  const resultsList = document.getElementById('modalResultsList');

  // 2. Modal Open / Close Controllers
  function openSearchModal() {
    modalDiv.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    updateModalLanguage();
    setTimeout(() => {
      searchInput.focus();
      searchInput.select();
    }, 50);
  }

  function closeSearchModal() {
    modalDiv.classList.remove('show');
    document.body.style.overflow = '';
    searchInput.value = '';
    closeBtn.style.display = 'none';
    if (peopleContainer) peopleContainer.style.display = 'block';
    trendingContainer.style.display = 'block';
    resultsContainer.style.display = 'none';
  }

  // Close when clicking outside modal box
  modalDiv.addEventListener('click', (e) => {
    if (e.target === modalDiv) {
      closeSearchModal();
    }
  });

  // Click on 'X' button clears the typed text instead of closing the modal
  closeBtn.addEventListener('click', () => {
    searchInput.value = '';
    closeBtn.style.display = 'none';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  // 3. Global Keyboard Shortcuts (Ctrl + K / Cmd + K / ESC)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape' && modalDiv.classList.contains('show')) {
      closeSearchModal();
    }
  });

  // 4. Bind Trigger Events to Existing Search Boxes across all HTML pages
  function bindSearchTriggers() {
    const triggerSelectors = [
      '#feedSearchInput',
      '#sidebarSearchInput',
      '#mobileFeedSearchInput',
      '.right-search-box input'
    ];

    triggerSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(inputEl => {
        // Remove old inline attributes or behaviors
        inputEl.removeAttribute('onkeyup');
        inputEl.removeAttribute('oninput');
        inputEl.setAttribute('readonly', 'readonly');
        inputEl.style.cursor = 'pointer';

        // Bind click & focus to open our Substack modal
        inputEl.addEventListener('click', (e) => {
          e.preventDefault();
          openSearchModal();
          inputEl.blur();
        });
        inputEl.addEventListener('focus', (e) => {
          e.preventDefault();
          openSearchModal();
          inputEl.blur();
        });
      });
    });

    // Also allow clicking the search container box itself
    document.querySelectorAll('.right-search-box').forEach(boxEl => {
      boxEl.style.cursor = 'pointer';
      boxEl.addEventListener('click', () => {
        openSearchModal();
      });
    });
  }

  bindSearchTriggers();

  // 5. Live Instant Search Engine (Queries window.globalPostsData or postsData)
  searchInput.addEventListener('input', () => {
    const rawValue = searchInput.value;
    const query = rawValue.trim().toLowerCase();
    
    if (rawValue.length > 0) {
      closeBtn.style.display = 'flex';
    } else {
      closeBtn.style.display = 'none';
    }

    if (!query) {
      if (peopleContainer) peopleContainer.style.display = 'block';
      trendingContainer.style.display = 'block';
      resultsContainer.style.display = 'none';
      return;
    }

    if (peopleContainer) peopleContainer.style.display = 'none';
    trendingContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    resultsList.innerHTML = '';

    const dataObj = window.globalPostsData || (typeof postsData !== 'undefined' ? postsData : null);
    if (!dataObj) {
      resultsList.innerHTML = `<div class="text-muted p-3 text-center">No post data available.</div>`;
      return;
    }

    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const dict = (window.uiTranslations && window.uiTranslations[currentLang]) || (window.uiTranslations && window.uiTranslations.en) || {};
    const noResultsText = dict.no_results || "No matching results found.";

    let matchCount = 0;
    Object.keys(dataObj).forEach(id => {
      const post = dataObj[id];
      
      // 1. Chỉ tìm kiếm các bài viết hỗ trợ ngôn ngữ đang chọn trong Setting
      if (post.supported_langs && !post.supported_langs.split(',').includes(currentLang)) {
        return;
      }

      // 2. Chỉ lấy tiêu đề và nội dung đúng ngôn ngữ hiện tại (không fallback sang tiếng Anh)
      const title = post[`title_${currentLang}`] || "";
      const content = post[`content_${currentLang}`] || "";
      const author = post.author_name || "";
      const category = post.category || "";

      // Nếu bài viết không có tiêu đề và nội dung ở ngôn ngữ này thì bỏ qua
      if (!title && !content) return;

      // Check if query matches title, author, category, or content
      if (
        title.toLowerCase().includes(query) ||
        author.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query)
      ) {
        matchCount++;
        const itemEl = document.createElement('a');
        itemEl.href = `post-detail.html?id=${id}`;
        itemEl.className = 'search-result-item';
        itemEl.innerHTML = `
          <img src="${post.author_avatar}" class="search-result-avatar" alt="${author}">
          <div class="search-result-content">
            <div class="search-result-title">${title}</div>
            <div class="search-result-meta">
              <span><i class="bi bi-person-fill"></i> ${author}</span> &bull; 
              <span class="badge bg-secondary-subtle text-secondary border px-2 py-0">${category}</span> &bull; 
              <span>${post.timestamp}</span>
            </div>
            <div class="search-result-snippet">${content.substring(0, 130)}...</div>
          </div>
        `;
        itemEl.addEventListener('click', () => {
          closeSearchModal();
        });
        resultsList.appendChild(itemEl);
      }
    });

    if (matchCount === 0) {
      resultsList.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-search fs-2 d-block mb-2"></i>
          <span>${noResultsText}</span>
        </div>
      `;
    }
  });

  // 6. Click on Trending Items -> Fill input & search
  document.querySelectorAll('.search-trending-item').forEach(item => {
    item.addEventListener('click', () => {
      const q = item.getAttribute('data-query');
      if (q) {
        searchInput.value = q;
        searchInput.dispatchEvent(new Event('input'));
      }
    });
  });

  // 7. Language Translation helper for Modal
  function updateModalLanguage() {
    const currentLang = localStorage.getItem('preferredLanguage') || 'en';
    const dict = (window.uiTranslations && window.uiTranslations[currentLang]) || (window.uiTranslations && window.uiTranslations.en) || {};
    
    if (dict.search_placeholder_modal) {
      searchInput.setAttribute('placeholder', dict.search_placeholder_modal);
    }
    const peopleTitle = document.getElementById('modalSectionPeople');
    const trendingTitle = document.getElementById('modalSectionTrending');
    if (peopleTitle && dict.recommended_people) peopleTitle.textContent = dict.recommended_people;
    if (trendingTitle && dict.trending_topics) trendingTitle.textContent = dict.trending_topics;
  }
}
