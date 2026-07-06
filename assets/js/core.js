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
  // Dynamic Feed & UI Language Filtering / i18n
  // ========================================================
  const uiTranslations = {
    en: {
      home: "Home",
      inbox: "Inbox",
      liked_posts: "Liked Posts",
      my_articles: "My Articles",
      about: "About",
      profile: "Profile",
      create: "Create",
      more: "More",
      settings: "Settings",
      admin_panel: "Admin Panel",
      security: "Security",
      sign_out: "Sign Out",
      login: "Log in",
      what_on_mind: "What is on your mind?",
      for_you: "For you",
      cat_ai: "Artificial Intelligence",
      cat_backend: "Backend Engineering",
      cat_design: "Design",
      search_placeholder: "Search MundiBlog...",
      subscriptions: "Subscriptions",
      join_creators: "Join creators on MundiBlog",
      recommended: "Recommended for You",
      see_all: "See all",
      view_profile: "View Profile",
      subscribe: "Subscribe",
      // Settings page
      settings_title: "Settings & Preferences",
      settings_desc: "Manage your interface, display language, and reading preferences on MundiBlog.",
      appearance_title: "Appearance & Theme",
      appearance_desc: "Choose a light or dark theme to suit your environment and protect your eyes when reading posts.",
      theme_light: "Light (Sáng)",
      theme_light_sub: "Substack clean white paper",
      theme_dark: "Dark (Tối)",
      theme_dark_sub: "Comfortable in low-light environments",
      lang_title: "Feed & UI Language",
      lang_desc: "Choose your default language. The Home Feed and UI will automatically display in your selected language.",
      pref_title: "Reading Preferences",
      pref_desc: "Customize how posts and multimedia content appear on your feed.",
      compact_view: "Compact View",
      compact_desc: "Reduce image size and increase post density on the feed.",
      autoplay: "Auto-play Media",
      autoplay_desc: "Automatically play animated GIFs and short clips when scrolling.",
      back_feed: "Back to Feed",
      auto_saved: "Changes auto-saved",
      // Post Detail page
      comments: "Comments",
      comment_placeholder: "Write a comment in any language...",
      post_comment: "Post Comment",
      translate_comment: "Translate",
      show_original: "Show original content",
      related_posts: "Related Posts",
      related_posts_in: "Related Posts in",
      no_comments: "No comments yet. Be the first to comment!",
      reply: "Reply",
      cancel: "Cancel",
      submit_reply: "Submit Reply",
      replying_to: "Replying to @",
      replying_to_comment: "Replying to comment by ",
      login_required_comment: "Please log in first to reply or comment!",
      please_enter_reply: "Please enter your reply!",
      please_enter_comment: "Please enter your comment!"
    },
    vi: {
      home: "Trang chủ",
      inbox: "Hộp thư",
      liked_posts: "Bài đã thích",
      my_articles: "Bài viết của tôi",
      about: "Giới thiệu",
      profile: "Hồ sơ",
      create: "Viết bài",
      more: "Thêm",
      settings: "Cài đặt",
      admin_panel: "Quản trị viên",
      security: "Bảo mật",
      sign_out: "Đăng xuất",
      login: "Đăng nhập",
      what_on_mind: "Bạn đang nghĩ gì?",
      for_you: "Dành cho bạn",
      cat_ai: "Trí tuệ nhân tạo (AI)",
      cat_backend: "Kỹ thuật Backend",
      cat_design: "Thiết kế UI/UX",
      search_placeholder: "Tìm kiếm trên MundiBlog...",
      subscriptions: "Đăng ký theo dõi",
      join_creators: "Kết nối cùng tác giả",
      recommended: "Gợi ý cho bạn",
      see_all: "Xem tất cả",
      view_profile: "Xem hồ sơ",
      subscribe: "Đăng ký",
      // Settings page
      settings_title: "Cài đặt & Tùy chọn",
      settings_desc: "Quản lý giao diện, ngôn ngữ hiển thị và cấu hình trải nghiệm đọc bài viết trên MundiBlog.",
      appearance_title: "Chế độ Giao diện",
      appearance_desc: "Chọn chế độ màu sáng hoặc tối phù hợp với môi trường và bảo vệ thị lực của bạn khi đọc bài đăng.",
      theme_light: "Sáng (Light)",
      theme_light_sub: "Giao diện giấy trắng chuẩn Substack",
      theme_dark: "Tối (Dark)",
      theme_dark_sub: "Dễ chịu trong môi trường thiếu sáng",
      lang_title: "Ngôn ngữ Bảng tin & UI",
      lang_desc: "Chọn ngôn ngữ mặc định của bạn. Bảng tin (Home Feed) và giao diện sẽ hiển thị bằng ngôn ngữ được chọn.",
      pref_title: "Tùy chọn Đọc",
      pref_desc: "Tùy chỉnh cách các bài đăng và nội dung đa phương tiện hiển thị trên luồng bảng tin của bạn.",
      compact_view: "Chế độ đọc gọn gàng",
      compact_desc: "Thu nhỏ kích thước hình ảnh và tăng mật độ bài viết trên bảng tin.",
      autoplay: "Tự động phát Video & GIF",
      autoplay_desc: "Tự động phát hình ảnh động và clip ngắn khi cuộn qua bài viết.",
      back_feed: "Quay lại Bảng tin",
      auto_saved: "Tự động lưu thay đổi",
      // Post Detail page
      comments: "Bình luận",
      comment_placeholder: "Viết bình luận bằng bất kỳ ngôn ngữ nào...",
      post_comment: "Gửi bình luận",
      translate_comment: "Dịch",
      show_original: "Hiển thị nội dung gốc",
      related_posts: "Các bài viết liên quan",
      related_posts_in: "Bài viết liên quan trong chuyên mục",
      no_comments: "Chưa có bình luận nào. Hãy là người đầu tiên bình luận!",
      reply: "Trả lời",
      cancel: "Hủy",
      submit_reply: "Gửi trả lời",
      replying_to: "Trả lời @",
      replying_to_comment: "Trả lời bình luận của ",
      login_required_comment: "Vui lòng đăng nhập để bình luận hoặc trả lời!",
      please_enter_reply: "Vui lòng nhập nội dung trả lời!",
      please_enter_comment: "Vui lòng nhập nội dung bình luận!"
    },
    zh: {
      home: "首页",
      inbox: "收件箱",
      liked_posts: "喜欢的文章",
      my_articles: "我的文章",
      about: "关于我们",
      profile: "个人资料",
      create: "发布",
      more: "更多",
      settings: "设置",
      admin_panel: "管理后台",
      security: "安全设置",
      sign_out: "退出登录",
      login: "登录",
      what_on_mind: "你想分享什么？",
      for_you: "推荐",
      cat_ai: "人工智能 (AI)",
      cat_backend: "后端工程",
      cat_design: "设计 (Design)",
      search_placeholder: "搜索 MundiBlog...",
      subscriptions: "关注作者",
      join_creators: "在 MundiBlog 上连接创作者",
      recommended: "为你推荐",
      see_all: "查看全部",
      view_profile: "查看主页",
      subscribe: "关注",
      // Settings page
      settings_title: "设置与偏好",
      settings_desc: "管理您的界面、显示语言和 MundiBlog 上的阅读偏好。",
      appearance_title: "外观与主题",
      appearance_desc: "选择适合您环境的明亮或黑暗主题，在阅读文章时保护您的视力。",
      theme_light: "明亮 (Light)",
      theme_light_sub: "简洁整洁的白纸风格",
      theme_dark: "黑暗 (Dark)",
      theme_dark_sub: "在低光环境中舒适阅读",
      lang_title: "动态与界面语言",
      lang_desc: "选择您的默认语言。主页动态和界面将自动以您选择的语言显示。",
      pref_title: "阅读偏好",
      pref_desc: "自定义文章和多媒体内容在您的动态中的显示方式。",
      compact_view: "紧凑视图",
      compact_desc: "减小图片尺寸并增加动态中的文章密度。",
      autoplay: "自动播放媒体",
      autoplay_desc: "滚动时自动播放动图和短视频。",
      back_feed: "返回动态",
      auto_saved: "更改已自动保存",
      // Post Detail page
      comments: "评论",
      comment_placeholder: "用任何语言写下你的评论...",
      post_comment: "发表评论",
      translate_comment: "翻译",
      show_original: "显示原文",
      related_posts: "相关文章",
      related_posts_in: "相关分类文章：",
      no_comments: "暂无评论。来发表第一条评论吧！",
      reply: "回复",
      cancel: "取消",
      submit_reply: "提交回复",
      replying_to: "回复 @",
      replying_to_comment: "回复 ",
      login_required_comment: "请先登录后再发表评论或回复！",
      please_enter_reply: "请输入回复内容！",
      please_enter_comment: "请输入评论内容！"
    }
  };

  const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
  applyLanguageFilter(preferredLang);
  applyUiTranslations(preferredLang);

  function applyUiTranslations(lang = localStorage.getItem('preferredLanguage') || 'en') {
    const dict = uiTranslations[lang] || uiTranslations.en;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.setAttribute('placeholder', dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });

    const searchInput = document.getElementById('feedSearchInput') || document.querySelector('.right-search-box input');
    if (searchInput && dict.search_placeholder) {
      searchInput.setAttribute('placeholder', dict.search_placeholder);
    }

    if (typeof syncFeedCommentCounts === 'function') {
      syncFeedCommentCounts();
    }
  }

  window.currentSelectedCategory = 'all';

  function selectCategory(event, category, i18nKey) {
    if (event) event.preventDefault();
    window.currentSelectedCategory = category;
    
    const label = document.getElementById('currentCategoryLabel');
    if (label) {
      if (i18nKey) {
        label.setAttribute('data-i18n', i18nKey);
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const dict = uiTranslations[lang] || uiTranslations.en;
        if (dict[i18nKey]) label.textContent = dict[i18nKey];
      } else {
        label.removeAttribute('data-i18n');
        label.textContent = category;
      }
    }

    document.querySelectorAll('.feed-filter-row .dropdown-item').forEach(el => el.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    const lang = localStorage.getItem('preferredLanguage') || 'en';
    applyLanguageFilter(lang);
  }

  function applyLanguageFilter(lang = localStorage.getItem('preferredLanguage') || 'en') {
    const posts = document.querySelectorAll('.substack-post');
    if (!posts || posts.length === 0) return;

    if (typeof syncFeedCommentCounts === 'function') {
      syncFeedCommentCounts();
    }

    console.log(`Applying Feed Language Filter: ${lang.toUpperCase()}`);
    const selectedCategory = window.currentSelectedCategory || 'all';

    posts.forEach(post => {
      const supportedLangs = post.getAttribute('data-supported-langs') || '';
      const titleEl = post.querySelector('.post-title');
      const contentEl = post.querySelector('.post-content');

      const hasTranslation = supportedLangs.split(',').includes(lang) ||
                             post.hasAttribute(`data-translate-title-${lang}`) ||
                             (titleEl && titleEl.hasAttribute(`data-translate-title-${lang}`));

      const postCategory = post.getAttribute('data-category') || '';
      const matchesCategory = (selectedCategory === 'all') || (postCategory === selectedCategory);

      if (hasTranslation && matchesCategory) {
        // 1. Nếu bài viết hỗ trợ ngôn ngữ được chọn và khớp danh mục -> Hiển thị
        post.classList.remove('d-none');

        if (titleEl) {
          const transTitle = titleEl.getAttribute(`data-translate-title-${lang}`) || post.getAttribute(`data-translate-title-${lang}`);
          if (transTitle) titleEl.textContent = transTitle;
        }
        if (contentEl) {
          const transContent = contentEl.getAttribute(`data-translate-content-${lang}`) || post.getAttribute(`data-translate-content-${lang}`);
          if (transContent) contentEl.textContent = transContent;
        }
      } else {
        // 2. Nếu KHÔNG hỗ trợ hoặc không khớp danh mục -> Ẩn bài viết đi
        post.classList.add('d-none');
      }
    });
  }

  // ==========================================
  // MULTILINGUAL COMMENTS DATABASE & HELPERS
  // ==========================================
  const defaultCommentsDatabase = {
    1: [
      {
        id: 1,
        author: "Minh Khang",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40&h=40",
        time: "2 hours ago",
        content: "Great insights! This really changed how I approach full-stack architecture and engineering workflows. Highly recommended!",
        lang: "en",
        translations: {
          vi: "Góc nhìn rất tuyệt vời! Điều này thực sự đã thay đổi cách tôi tiếp cận kiến trúc full-stack và quy trình kỹ thuật. Rất đáng xem!",
          zh: "极好的见解！这确实改变了我处理全栈架构和工程工作流的方式。强烈推荐！"
        },
        replies: [
          {
            id: 101,
            author: "Hải Đăng",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
            time: "1 hour ago",
            content: "Mình hoàn toàn đồng ý! Kiến trúc này giúp giảm đáng kể thời gian xử lý và tải trang.",
            lang: "vi",
            replyTo: "",
            translations: {
              en: "I completely agree! This architecture significantly reduces processing and page load times.",
              zh: "我完全同意！这种架构极大地缩短了处理和页面加载时间。"
            }
          },
          {
            id: 102,
            author: "Li Wei (李伟)",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=40&h=40",
            time: "30 mins ago",
            content: "非常同意！我们在生产环境中也采用了这种处理模式，效果很好。",
            lang: "zh",
            replyTo: "Hải Đăng",
            translations: {
              en: "Strongly agree! We also adopted this processing model in our production environment, and the results are great.",
              vi: "Hoàn toàn đồng ý! Chúng tôi cũng đã áp dụng mô hình xử lý này trong môi trường thực tế, hiệu quả rất tốt."
            }
          }
        ]
      },
      {
        id: 2,
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40",
        time: "3 hours ago",
        content: "Cảm ơn tác giả đã chia sẻ bài viết rất hữu ích! Bạn có thể nói rõ hơn về phần tối ưu hóa hiệu năng khi scale lớn không?",
        lang: "vi",
        translations: {
          en: "Thank you author for sharing such a useful article! Could you elaborate on performance optimization when scaling up?",
          zh: "感谢作者分享如此有用的文章！您能详细阐述一下在大规模扩展时的性能优化吗？"
        },
        replies: []
      },
      {
        id: 3,
        author: "Chen Bo (陈博)",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=40&h=40",
        time: "5 hours ago",
        content: "这篇文章很有深度，特别喜欢关于微服务和数据库同步的解释。赞！",
        lang: "zh",
        translations: {
          en: "This article has great depth, especially loved the explanation about microservices and database synchronization. Kudos!",
          vi: "Bài viết này rất có chiều sâu, đặc biệt thích phần giải thích về microservices và đồng bộ hóa cơ sở dữ liệu. Tuyệt vời!"
        },
        replies: []
      }
    ]
  };

  function getCommentsForPost(postId) {
    let db = JSON.parse(localStorage.getItem('mundi_comments_db'));
    if (!db) {
      db = defaultCommentsDatabase;
      localStorage.setItem('mundi_comments_db', JSON.stringify(db));
    }
    if (!db[postId]) {
      db[postId] = [
        {
          id: Date.now() + 1,
          author: "Tuấn Hưng",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
          time: "1 hour ago",
          content: "Bài viết rất chất lượng và chi tiết! Cảm ơn tác giả.",
          lang: "vi",
          translations: {
            en: "Very high quality and detailed article! Thank you author.",
            zh: "非常高质量和详细的文章！感谢作者。"
          },
          replies: []
        },
        {
          id: Date.now() + 2,
          author: "Sarah Jenkins",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40&h=40",
          time: "2 hours ago",
          content: "Really clear explanation and awesome design aesthetics. Keep writing!",
          lang: "en",
          translations: {
            vi: "Giải thích rất rõ ràng và thẩm mỹ thiết kế tuyệt vời. Hãy tiếp tục viết nhé!",
            zh: "解释得很清楚，设计美学也很棒。继续写作吧！"
          },
          replies: []
        }
      ];
      localStorage.setItem('mundi_comments_db', JSON.stringify(db));
    }
    return db[postId];
  }

  function saveCommentsForPost(postId, comments) {
    let db = JSON.parse(localStorage.getItem('mundi_comments_db')) || defaultCommentsDatabase;
    db[postId] = comments;
    localStorage.setItem('mundi_comments_db', JSON.stringify(db));
  }

  function getCommentTranslation(comment, targetLang) {
    if (comment.translations && comment.translations[targetLang]) {
      return comment.translations[targetLang];
    }
    if (targetLang === 'vi') return "[Bản dịch Tiếng Việt]: " + comment.content;
    if (targetLang === 'zh') return "[中文翻译]: " + comment.content;
    return "[English Translation]: " + comment.content;
  }

  function syncFeedCommentCounts() {
    document.querySelectorAll('.substack-post').forEach(post => {
      const linkEl = post.querySelector('a[href*="post-detail.html?id="]');
      if (!linkEl) return;
      const href = linkEl.getAttribute('href');
      const match = href.match(/id=(\d+)/);
      if (match && match[1]) {
        const postId = match[1];
        const comments = getCommentsForPost(postId);
        let totalCount = 0;
        comments.forEach(c => {
          totalCount += 1 + (c.replies ? c.replies.length : 0);
        });
        const chatBtnSpan = post.querySelector('.footer-action-item i.bi-chat')?.nextElementSibling;
        if (chatBtnSpan) {
          chatBtnSpan.textContent = totalCount;
        }
      }
    });
  }

  // Expose functions globally
  window.uiTranslations = uiTranslations;
  window.applyUiTranslations = applyUiTranslations;
  window.applyLanguageFilter = applyLanguageFilter;
  window.selectCategory = selectCategory;
  window.getCommentsForPost = getCommentsForPost;
  window.saveCommentsForPost = saveCommentsForPost;
  window.getCommentTranslation = getCommentTranslation;
  window.syncFeedCommentCounts = syncFeedCommentCounts;

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
