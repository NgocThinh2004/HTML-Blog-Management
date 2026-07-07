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
      slug_ai: "ai",
      slug_backend: "backend",
      slug_design: "design",
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
      please_enter_comment: "Please enter your comment!",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      delete_confirm_root: "Are you sure you want to delete this comment? All child replies will also be deleted!",
      delete_confirm_reply: "Are you sure you want to delete this reply?",
      comment_edited: "(edited)",
      reset_demo: "Reset Demo Data",
      // Admin Panel
      admin_dashboard: "Admin Dashboard",
      manage_users: "Manage Users",
      manage_categories: "Manage Categories",
      manage_languages: "Manage Languages",
      total_users: "Total Users",
      total_articles: "Total Articles",
      ai_translated: "AI Translated",
      queue_status: "AI Translation Queue",
      user_management: "User Management",
      category_management: "Category Management",
      language_management: "Language Management",
      search_user_placeholder: "Search users by name or email...",
      search_cat_placeholder: "Search categories...",
      add_category: "Add Category",
      edit_category: "Edit Category",
      category_name: "Category Name",
      slug: "Slug",
      actions: "Actions",
      status: "Status",
      role: "Role",
      active: "Active",
      banned: "Banned",
      translation_coverage: "Translation Coverage",
      admin_desc: "Overview of users, categories, translation metrics, and automated AI queues.",
      col_article: "Article",
      col_author: "Author",
      col_source: "Source",
      col_target: "Target",
      col_status: "Status",
      col_actions: "Actions",
      status_translating: "Translating",
      status_completed: "Completed",
      status_failed: "Failed",
      status_hidden: "Hidden",
      user_desc: "View user directory, filter by roles, and manage account statuses.",
      col_user: "User",
      col_email: "Email",
      col_joined: "Joined",
      role_all: "All Roles",
      role_admin: "Admin",
      role_member: "Member",
      cat_desc: "Create, organize, and edit post categories for the home feed.",
      col_posts_count: "Total Posts",
      cat_name_placeholder: "Enter category name...",
      slug_auto_placeholder: "Slug automatically generated...",
      slug_help: "URLs will use this slug to route categories.",
      lang_desc_page: "Configure system languages and monitor AI automatic translation coverage.",
      add_language: "Add Language",
      col_code: "Code",
      col_lang_name: "Language Name",
      col_progress: "AI Translation Progress",
      primary_language: "Primary Language",
      system_default: "System Default",
      back_admin: "Back to Admin Dashboard",
      posts_suffix: "posts",
      select_language: "Select Language",
      choose_lang_placeholder: "Choose a language...",
      language_code: "Language Code",
      lang_code_placeholder: "Language code will be generated...",
      published_2h: "Published 2 hours ago",
      published_3d: "Published 3 days ago",
      published_1d: "Published 1 day ago",
      published_5h: "Published 5 hours ago"
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
      slug_ai: "tri-tue-nhan-tao",
      slug_backend: "ky-thuat-backend",
      slug_design: "thiet-ke-ui-ux",
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
      please_enter_comment: "Vui lòng nhập nội dung bình luận!",
      edit: "Sửa",
      delete: "Xóa",
      save: "Lưu",
      delete_confirm_root: "Bạn có chắc muốn xóa bình luận này? Toàn bộ các bình luận phản hồi bên trong cũng sẽ bị xóa theo!",
      delete_confirm_reply: "Bạn có chắc muốn xóa câu trả lời này?",
      comment_edited: "(đã chỉnh sửa)",
      reset_demo: "Khôi phục dữ liệu mẫu",
      // Admin Panel
      admin_dashboard: "Bảng điều khiển Admin",
      manage_users: "Quản lý thành viên",
      manage_categories: "Quản lý chuyên mục",
      manage_languages: "Quản lý ngôn ngữ",
      total_users: "Tổng số thành viên",
      total_articles: "Tổng số bài viết",
      ai_translated: "Đã dịch bằng AI",
      queue_status: "Hàng đợi biên dịch AI",
      user_management: "Quản lý thành viên",
      category_management: "Quản lý danh mục",
      language_management: "Quản lý ngôn ngữ",
      search_user_placeholder: "Tìm thành viên theo tên hoặc email...",
      search_cat_placeholder: "Tìm kiếm danh mục...",
      add_category: "Thêm danh mục",
      edit_category: "Sửa chuyên mục",
      category_name: "Tên danh mục",
      slug: "Slug (Đường dẫn)",
      actions: "Thao tác",
      status: "Trạng thái",
      role: "Vai trò",
      active: "Hoạt động",
      banned: "Bị khóa",
      save_changes: "Lưu thay đổi",
      translation_coverage: "Mức độ phủ dịch",
      admin_desc: "Tổng quan về thành viên, chuyên mục, hiệu suất dịch thuật và hàng đợi dịch AI tự động.",
      col_article: "Bài viết",
      col_author: "Tác giả",
      col_source: "Nguồn",
      col_target: "Đích",
      col_status: "Trạng thái",
      col_actions: "Thao tác",
      status_translating: "Đang dịch...",
      status_completed: "Hoàn thành",
      status_failed: "Thất bại",
      status_hidden: "Tạm ẩn",
      user_desc: "Xem danh sách thành viên, lọc theo vai trò và quản lý trạng thái tài khoản.",
      col_user: "Người dùng",
      col_email: "Email",
      col_joined: "Ngày tham gia",
      role_all: "Tất cả vai trò",
      role_admin: "Quản trị viên",
      role_member: "Thành viên",
      cat_desc: "Tạo, sắp xếp và chỉnh sửa các danh mục bài viết trên bảng tin.",
      col_posts_count: "Tổng số bài viết",
      cat_name_placeholder: "Nhập tên danh mục...",
      slug_auto_placeholder: "Đường dẫn tự động tạo...",
      slug_help: "Đường dẫn liên kết (Slug) sẽ dùng để định tuyến chuyên mục bài viết.",
      lang_desc_page: "Cấu hình ngôn ngữ hệ thống và theo dõi tiến độ dịch thuật tự động của AI.",
      add_language: "Thêm ngôn ngữ",
      col_code: "Mã",
      col_lang_name: "Tên ngôn ngữ",
      col_progress: "Tiến độ dịch thuật AI",
      primary_language: "Ngôn ngữ chính",
      system_default: "Mặc định hệ thống",
      back_admin: "Quay lại Bảng điều khiển Admin",
      posts_suffix: "bài viết",
      select_language: "Chọn ngôn ngữ",
      choose_lang_placeholder: "Chọn một ngôn ngữ...",
      language_code: "Mã ngôn ngữ",
      lang_code_placeholder: "Mã ngôn ngữ sẽ tự động sinh...",
      published_2h: "Đã đăng 2 giờ trước",
      published_3d: "Đã đăng 3 ngày trước",
      published_1d: "Đã đăng 1 ngày trước",
      published_5h: "Đã đăng 5 giờ trước"
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
      slug_ai: "ren-gong-zhi-neng",
      slug_backend: "hou-duan-gong-cheng",
      slug_design: "ui-ux-she-ji",
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
      please_enter_comment: "请输入评论内容！",
      edit: "编辑",
      delete: "删除",
      save: "保存",
      delete_confirm_root: "确定要删除此评论吗？所有子回复也将被一起删除！",
      delete_confirm_reply: "确定要删除此回复吗？",
      comment_edited: "(已编辑)",
      reset_demo: "恢复演示数据",
      // Admin Panel
      admin_dashboard: "管理后台",
      manage_users: "用户管理",
      manage_categories: "分类管理",
      manage_languages: "语言管理",
      total_users: "总用户数",
      total_articles: "总文章数",
      ai_translated: "AI 已翻译",
      queue_status: "AI 翻译队列",
      user_management: "用户管理",
      category_management: "分类管理",
      language_management: "语言管理",
      search_user_placeholder: "按姓名或邮箱搜索用户...",
      search_cat_placeholder: "搜索分类...",
      add_category: "添加分类",
      edit_category: "编辑分类",
      category_name: "分类名称",
      slug: "别名 (Slug)",
      actions: "操作",
      status: "状态",
      role: "角色",
      active: "活跃",
      banned: "已封禁",
      save_changes: "保存更改",
      translation_coverage: "翻译覆盖率",
      admin_desc: "用户、分类、翻译指标 and 自动 AI 队列的总体概述。",
      col_article: "文章",
      col_author: "作者",
      col_source: "源语言",
      col_target: "目标语言",
      col_status: "状态",
      col_actions: "操作",
      status_translating: "翻译中...",
      status_completed: "已完成",
      status_failed: "失败",
      status_hidden: "已隐藏",
      user_desc: "查看用户目录，按角色过滤，并管理帐户状态。",
      col_user: "用户",
      col_email: "邮箱",
      col_joined: "加入时间",
      role_all: "所有角色",
      role_admin: "管理员",
      role_member: "成员",
      cat_desc: "创建、组织和编辑首页动态的文章分类。",
      col_posts_count: "总文章数",
      cat_name_placeholder: "输入分类名称...",
      slug_auto_placeholder: "别名将自动生成...",
      slug_help: "URL 将使用此别名进行分类路由。",
      lang_desc_page: "配置系统语言并监控 AI 自动翻译覆盖率。",
      add_language: "添加语言",
      col_code: "代码",
      col_lang_name: "语言名称",
      col_progress: "AI 翻译进度",
      primary_language: "主要语言",
      system_default: "系统默认",
      back_admin: "返回管理后台",
      posts_suffix: "篇内容",
      select_language: "选择语言",
      choose_lang_placeholder: "选择语言...",
      language_code: "语言代码",
      lang_code_placeholder: "系统将自动生成语言代码...",
      published_2h: "发布于 2 小时前",
      published_3d: "发布于 3 天前",
      published_1d: "发布于 1 天前",
      published_5h: "发布于 5 小时前"
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

    // Translate dynamic titles in any list items (such as the admin queue)
    document.querySelectorAll('[data-translate-title-vi], [data-translate-title-zh]').forEach(el => {
      const originalText = el.getAttribute('data-original-title') || el.textContent.trim();
      if (!el.getAttribute('data-original-title')) {
        el.setAttribute('data-original-title', originalText);
      }
      const transText = el.getAttribute(`data-translate-title-${lang}`);
      if (transText) {
        el.textContent = transText;
      } else {
        el.textContent = el.getAttribute('data-original-title');
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
        id: 4,
        author: "Hồ Quốc Tuấn",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
        time: "30 mins ago",
        content: "Kiến trúc này thực sự giúp tối ưu hóa hiệu năng rất tốt. Mình đã thử nghiệm trên dự án thực tế và thấy tốc độ cải thiện đáng kể!",
        lang: "vi",
        translations: {
          en: "This architecture really helps optimize performance very well. I tested it on a real project and saw a significant improvement in speed!",
          zh: "这种架构的确实有助于很好地优化性能。我在真实项目中做了测试，发现速度有了显著提高！"
        },
        replies: [
          {
            id: 401,
            author: "Elena Rostova",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40",
            time: "15 mins ago",
            content: "That is awesome to hear, Tuấn! What database load did you test it with?",
            lang: "en",
            replyTo: "Hồ Quốc Tuấn",
            translations: {
              vi: "Thật tuyệt vời khi nghe điều đó, Tuấn! Bạn đã kiểm thử với tải cơ sở dữ liệu bao nhiêu?",
              zh: "太棒了，Tuấn！你使用的是多大的数据库负载进行测试的？"
            }
          },
          {
            id: 402,
            author: "Hồ Quốc Tuấn",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
            time: "5 mins ago",
            content: "Mình test với khoảng 1 triệu record trong database, tốc độ truy vấn vẫn dưới 10ms nhé!",
            lang: "vi",
            replyTo: "Elena Rostova",
            translations: {
              en: "I tested with about 1 million records in the database, query speed remained under 10ms!",
              zh: "我测试了大约100万条数据库记录，查询速度仍然保持在10毫秒以下！"
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
    ],
    3: [
      {
        id: 301,
        author: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=40&h=40",
        time: "2 hours ago",
        content: "Bài viết về Glassmorphism này quá đẹp và trực quan! Cảm ơn Tuấn đã chia sẻ.",
        lang: "vi",
        translations: {
          en: "This Glassmorphism article is so beautiful and intuitive! Thanks Tuấn for sharing.",
          zh: "这篇关于毛玻璃特效的文章太美观直观了！感谢Tuấn的分享。"
        },
        replies: [
          {
            id: 3011,
            author: "Minh Khang",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=40&h=40",
            time: "1 hour ago",
            content: "Đúng vậy, mình áp dụng nguyên tắc số 4 và thấy UI cải thiện rõ rệt.",
            lang: "vi",
            replyTo: "Elena Rostova",
            translations: {
              en: "Exactly, I applied principle #4 and saw clear UI improvement.",
              zh: "没错，我应用了原则#4，UI提升明显。"
            }
          },
          {
            id: 3012,
            author: "Hồ Quốc Tuấn",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
            time: "30 mins ago",
            content: "Cảm ơn hai bạn rất nhiều! Nếu cần hỗ trợ thêm về phần shadow thì cứ nhắn mình nhé.",
            lang: "vi",
            replyTo: "Minh Khang",
            translations: {
              en: "Thank you both so much! If you need help with shadows, let me know.",
              zh: "非常感谢你们！如果需要关于阴影的帮助请告诉我。"
            }
          }
        ]
      },
      {
        id: 302,
        author: "Sarah Connor",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=40&h=40",
        time: "3 hours ago",
        content: "Great explanation of multi-layered interfaces and background blur balancing!",
        lang: "en",
        translations: {
          vi: "Giải thích rất tuyệt vời về giao diện nhiều lớp và cân bằng độ mờ nền!",
          zh: "关于多层界面和背景模糊平衡的解释特别棒！"
        },
        replies: []
      },
      {
        id: 303,
        author: "Hồ Quốc Tuấn",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=40&h=40",
        time: "4 hours ago",
        content: "Hy vọng bài viết này sẽ giúp ích cho các dự án sắp tới của mọi người!",
        lang: "vi",
        translations: {
          en: "Hope this article helps with everyone's upcoming projects!",
          zh: "希望这篇文章对大家接下来的项目有所帮助！"
        },
        replies: []
      }
    ]
  };

  function getCommentsForPost(postId) {
    let db = JSON.parse(localStorage.getItem('mundi_comments_db'));
    if (!db || db._version !== 3) {
      db = JSON.parse(JSON.stringify(defaultCommentsDatabase));
      db._version = 3;
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

  function resetDemoComments() {
    const lang = localStorage.getItem('preferredLanguage') || 'vi';
    const confirmMsg = lang === 'en' ? "Do you want to reset all demo comments to initial state?" :
                       lang === 'zh' ? "确定要恢复所有初始演示评论数据吗？" :
                       "Bạn có muốn khôi phục lại toàn bộ dữ liệu bình luận mẫu ban đầu để demo không?";
    if (confirm(confirmMsg)) {
      localStorage.removeItem('mundi_comments_db');
      window.location.reload();
    }
  }

  // Expose functions globally
  window.resetDemoComments = resetDemoComments;
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
