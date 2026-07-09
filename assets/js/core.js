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
  applySavedBrandAccent();

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

  function hexToRgb(hex) {
    const normalized = String(hex || '').replace('#', '').trim();
    if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;

    return {
      r: parseInt(normalized.slice(0, 2), 16),
      g: parseInt(normalized.slice(2, 4), 16),
      b: parseInt(normalized.slice(4, 6), 16)
    };
  }

  function normalizeHex(value) {
    const rgb = hexToRgb(value);
    if (!rgb) return '';
    return `#${[rgb.r, rgb.g, rgb.b].map(part => part.toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  }

  function shiftColor(hex, amount) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const shift = channel => {
      const target = amount < 0 ? 0 : 255;
      return Math.round(channel + (target - channel) * Math.abs(amount));
    };

    return `#${[shift(rgb.r), shift(rgb.g), shift(rgb.b)].map(part => part.toString(16).padStart(2, '0')).join('')}`;
  }

  function getRelativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    return (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  }

  function colorToRgba(hex, alpha) {
    const rgb = hexToRgb(hex);
    if (!rgb) return `rgba(255, 90, 0, ${alpha})`;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  }

  function applyBrandAccent(accentColor) {
    const accent = normalizeHex(accentColor);
    if (!accent) return;

    const hover = shiftColor(accent, getRelativeLuminance(accent) > 0.58 ? -0.18 : 0.16);
    htmlElement.style.setProperty('--primary-color', accent);
    htmlElement.style.setProperty('--primary-hover', hover);
    htmlElement.style.setProperty('--accent-button-bg', colorToRgba(accent, 0.1));
    htmlElement.style.setProperty('--accent-button-text', accent);
    htmlElement.style.setProperty('--accent', accent);
    htmlElement.style.setProperty('--accent-strong', hover);
  }

  function applySavedBrandAccent() {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('mundiBlogProfile') || '{}');
      applyBrandAccent(savedProfile.accentColor);
    } catch (error) {
      // Ignore malformed local profile data and keep the default theme color.
    }
  }

  window.applyMundiBrandAccent = applyBrandAccent;

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
      change_password: "Change password",
      password_description_short: "Update the password for your MundiBlog account.",
      password_description_long: "Update the password for your MundiBlog account. Use a strong password that you do not use anywhere else.",
      back_to_profile: "Back to profile",
      current_password_label: "Current password",
      new_password_label: "New password",
      confirm_new_password_label: "Confirm new password",
      password_min_hint: "Use at least 8 characters.",
      update_password: "Update password",
      password_min_error: "New password must be at least 8 characters.",
      password_same_error: "New password must be different from current password.",
      password_mismatch_error: "New passwords do not match.",
      password_success: "Password updated successfully.",
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
      profile_see_subscribers: "See subscribers",
      profile_edit_profile: "Edit profile",
      profile_notice_title: "Notifications",
      profile_notice_empty: "You do not have any new notifications.",
      profile_edit_title: "Edit Profile",
      profile_done: "Done",
      profile_name_label: "Name",
      profile_handle_label: "Handle",
      profile_edit_handle: "Edit",
      profile_bio_label: "Bio",
      profile_branding: "Branding",
      profile_branding_desc: "Customize the look of your profile.",
      profile_header_image: "Header image",
      profile_header_drop: "Drop your header image here",
      profile_header_hint: "At least 1344x256px - 3:2 to 21:4 aspect ratio",
      profile_select_image: "Select image",
      profile_accent_color: "Accent color",
      profile_background_color: "Background color",
      profile_none: "None",
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
      my_posts_title: "My Articles",
      my_posts_desc: "Manage drafts, published posts, and the AI translation status matrix for EN, VI, and ZH.",
      new_post: "New post",
      all_posts: "All posts",
      drafts: "Drafts",
      published: "Published",
      total_posts: "Total posts",
      translation_ready: "Translations ready",
      translations_attention: "Need attention",
      search_posts: "Search your posts...",
      status_label: "Status",
      title_label: "Title",
      original_language: "Original language",
      ai_translation_matrix: "AI translation matrix",
      updated: "Updated",
      reads: "Reads",
      actions: "Actions",
      open: "Open",
      status_draft: "Draft",
      status_published: "Published",
      ai_status_ready: "Ready",
      ai_status_processing: "Processing",
      ai_status_missing: "Missing",
      ai_status_failed: "Failed",
      no_posts_found: "No posts match your filters.",
      all_posts_tab: "All",
      trash: "Trash",
      translated_language: "Translated language",
      all_languages: "All languages",
      english: "English",
      vietnamese: "Vietnamese",
      chinese: "Chinese",
      all_dates: "All dates",
      all_categories: "All categories",
      cat_ai_translation: "AI Translation",
      cat_profile_branding: "Profile Branding",
      cat_design_general: "Design",
      cat_analytics: "Analytics",
      cat_localization: "Localization"
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
      change_password: "Đổi mật khẩu",
      password_description_short: "Cập nhật mật khẩu cho tài khoản MundiBlog của bạn.",
      password_description_long: "Cập nhật mật khẩu cho tài khoản MundiBlog của bạn. Hãy dùng mật khẩu mạnh mà bạn không dùng ở nơi khác.",
      back_to_profile: "Quay lại hồ sơ",
      current_password_label: "Mật khẩu hiện tại",
      new_password_label: "Mật khẩu mới",
      confirm_new_password_label: "Xác nhận mật khẩu mới",
      password_min_hint: "Sử dụng ít nhất 8 ký tự.",
      update_password: "Cập nhật mật khẩu",
      password_min_error: "Mật khẩu mới phải có ít nhất 8 ký tự.",
      password_same_error: "Mật khẩu mới phải khác mật khẩu hiện tại.",
      password_mismatch_error: "Mật khẩu mới không khớp.",
      password_success: "Đã cập nhật mật khẩu thành công.",
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
      profile_see_subscribers: "Xem người đăng ký",
      profile_edit_profile: "Chỉnh sửa hồ sơ",
      profile_notice_title: "Thông báo",
      profile_notice_empty: "Bạn chưa có thông báo mới.",
      profile_edit_title: "Chỉnh sửa hồ sơ",
      profile_done: "Xong",
      profile_name_label: "Tên",
      profile_handle_label: "Tên người dùng",
      profile_edit_handle: "Sửa",
      profile_bio_label: "Tiểu sử",
      profile_branding: "Thương hiệu",
      profile_branding_desc: "Tùy chỉnh giao diện hồ sơ của bạn.",
      profile_header_image: "Ảnh bìa",
      profile_header_drop: "Thả ảnh bìa của bạn tại đây",
      profile_header_hint: "Tối thiểu 1344x256px - tỷ lệ 3:2 đến 21:4",
      profile_select_image: "Chọn ảnh",
      profile_accent_color: "Màu nhấn",
      profile_background_color: "Màu nền",
      profile_none: "Không có",
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
      my_posts_title: "Bài viết của tôi",
      my_posts_desc: "Quản lý bài nháp, bài đã đăng và ma trận trạng thái dịch thuật AI cho EN, VI, ZH.",
      new_post: "Bài viết mới",
      all_posts: "Tất cả bài viết",
      drafts: "Bài nháp",
      published: "Đã đăng",
      total_posts: "Tổng bài viết",
      translation_ready: "Bản dịch sẵn sàng",
      translations_attention: "Cần chú ý",
      search_posts: "Tìm bài viết của bạn...",
      status_label: "Trạng thái",
      title_label: "Tiêu đề",
      original_language: "Ngôn ngữ gốc",
      ai_translation_matrix: "Ma trận dịch thuật AI",
      updated: "Cập nhật",
      reads: "Lượt đọc",
      actions: "Thao tác",
      open: "Mở",
      status_draft: "Nháp",
      status_published: "Đã đăng",
      ai_status_ready: "Sẵn sàng",
      ai_status_processing: "Đang xử lý",
      ai_status_missing: "Thiếu",
      ai_status_failed: "Lỗi dịch",
      no_posts_found: "Không có bài viết nào phù hợp với bộ lọc của bạn.",
      all_posts_tab: "Tất cả",
      trash: "Thùng rác",
      translated_language: "Ngôn ngữ dịch",
      all_languages: "Tất cả ngôn ngữ",
      english: "Tiếng Anh",
      vietnamese: "Tiếng Việt",
      chinese: "Tiếng Trung",
      all_dates: "Tất cả ngày",
      all_categories: "Tất cả danh mục",
      cat_ai_translation: "Dịch thuật AI",
      cat_profile_branding: "Thương hiệu hồ sơ",
      cat_design_general: "Thiết kế",
      cat_analytics: "Phân tích",
      cat_localization: "Bản địa hóa"
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
      change_password: "修改密码",
      password_description_short: "更新你的 MundiBlog 账户密码。",
      password_description_long: "更新你的 MundiBlog 账户密码。请使用你没有在其他地方使用过的强密码。",
      back_to_profile: "返回个人资料",
      current_password_label: "当前密码",
      new_password_label: "新密码",
      confirm_new_password_label: "确认新密码",
      password_min_hint: "至少使用 8 个字符。",
      update_password: "更新密码",
      password_min_error: "新密码至少需要 8 个字符。",
      password_same_error: "新密码必须不同于当前密码。",
      password_mismatch_error: "两次输入的新密码不一致。",
      password_success: "密码已成功更新。",
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
      profile_see_subscribers: "查看订阅者",
      profile_edit_profile: "编辑个人资料",
      profile_notice_title: "通知",
      profile_notice_empty: "你还没有新通知。",
      profile_edit_title: "编辑个人资料",
      profile_done: "完成",
      profile_name_label: "姓名",
      profile_handle_label: "用户名",
      profile_edit_handle: "编辑",
      profile_bio_label: "简介",
      profile_branding: "品牌",
      profile_branding_desc: "自定义你的个人资料外观。",
      profile_header_image: "头图",
      profile_header_drop: "将头图拖放到这里",
      profile_header_hint: "至少 1344x256px - 宽高比 3:2 到 21:4",
      profile_select_image: "选择图片",
      profile_accent_color: "强调色",
      profile_background_color: "背景色",
      profile_none: "无",
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
      my_posts_title: "我的文章",
      my_posts_desc: "管理草稿、已发布文章，以及 EN、VI、ZH 的 AI 翻译状态矩阵。",
      new_post: "新文章",
      all_posts: "全部文章",
      drafts: "草稿",
      published: "已发布",
      total_posts: "文章总数",
      translation_ready: "翻译已就绪",
      translations_attention: "需要处理",
      search_posts: "搜索你的文章...",
      status_label: "状态",
      title_label: "标题",
      original_language: "原始语言",
      ai_translation_matrix: "AI 翻译矩阵",
      updated: "更新于",
      reads: "阅读量",
      actions: "操作",
      open: "打开",
      status_draft: "草稿",
      status_published: "已发布",
      ai_status_ready: "已完成",
      ai_status_processing: "处理中",
      ai_status_missing: "缺失",
      ai_status_failed: "失败",
      no_posts_found: "没有符合您筛选条件的文章。",
      all_posts_tab: "全部",
      trash: "回收站",
      translated_language: "翻译语言",
      all_languages: "所有语言",
      english: "英语",
      vietnamese: "越南语",
      chinese: "中文",
      all_dates: "所有日期",
      all_categories: "所有类别",
      cat_ai_translation: "AI翻译",
      cat_profile_branding: "个人资料品牌",
      cat_design_general: "设计",
      cat_analytics: "分析",
      cat_localization: "本地化"
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

});
