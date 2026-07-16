



    function escapePostText(value) {
      if (!value) return "";
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
    }

    // For storing HTML content safely in data-* attributes:
    // Only & and " need escaping inside double-quoted HTML attributes (HTML spec compliant)
    function encodeHtmlAttr(html) {
      if (!html) return "";
      return String(html)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
    }

    function renderPostDetail() {
      const urlParams = new URLSearchParams(window.location.search);
      const submittedId = urlParams.get('submitted');
      let postId = urlParams.get('id') || "1";
      let post = null;

      if (submittedId) {
        try {
          const storedPosts = JSON.parse(localStorage.getItem('mundiBlogSubmittedPosts') || '[]');
          const submittedPost = Array.isArray(storedPosts)
            ? storedPosts.find(item => String(item.id) === String(submittedId))
            : null;
          if (submittedPost) {
            let currentUser = null;
            try {
              currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            } catch (error) {
              currentUser = null;
            }
            const supportedLanguages = [
              submittedPost.originalLanguage,
              ...(Array.isArray(submittedPost.allowedTranslations) ? submittedPost.allowedTranslations : [])
            ].filter(Boolean);
            const title = submittedPost.title || 'Untitled post';
            const body = submittedPost.body || '<p>No content yet.</p>';
            postId = submittedId;
            post = {
              category: submittedPost.category || submittedPost.categoryLabel || 'Technology',
              originalLanguage: submittedPost.originalLanguage || 'en',
              supported_langs: [...new Set(supportedLanguages)].join(','),
              title_en: title,
              title_vi: title,
              title_zh: title,
              content_en: body,
              content_vi: body,
              content_zh: body,
              author_name: (() => {
                if (currentUser && typeof currentUser === 'object') {
                  return currentUser.name || currentUser.username || submittedPost.authors?.[0] || 'Lingora Author';
                }
                if (typeof currentUser === 'string') return currentUser;
                return submittedPost.authors?.[0] || 'Lingora Author';
              })(),
              author_avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80',
              author_id: currentUser?.id || 1,
              timestamp: 'Just now',
              likes: 0,
              comments: 0,
              views: submittedPost.reads || 0,
              image: ''
            };
          }
        } catch (error) {
          post = null;
        }
      }

      const publicPosts = window.getLingoraPostsData ? window.getLingoraPostsData() : window.globalPostsData;
      post = post || (publicPosts && publicPosts[postId]);
      if (!post) {
        const container = document.getElementById('postDetailContainer');
        if (container) container.innerHTML = '<div class="empty-state py-5 text-center"><i class="bi bi-file-earmark-x fs-1"></i><p class="mt-3 text-muted">This post is no longer available.</p></div>';
        return;
      }

      // Sync post.comments with actual comments database count
      const comments = window.getCommentsForPost ? window.getCommentsForPost(postId) : [];
      let initCount = 0;
      comments.forEach(c => {
        initCount += 1 + (c.replies ? c.replies.length : 0);
      });
      post.comments = initCount;

      const container = document.getElementById('postDetailContainer');
      if (!container) return;
      const likeCount = Number(post.like_count ?? post.likes ?? 0);
      const viewCount = Number(post.view_count ?? post.views ?? 0);

      let imageHtml = "";
      if (post.image) {
        imageHtml = `
          <div class="post-image-embed mb-4">
            <img src="${post.image}" alt="Cover Image" class="w-100 rounded-4 shadow-sm" style="max-height: 420px; object-fit: cover;">
          </div>
        `;
      }

      const safeContentEn = window.sanitizePostHtml(post.content_en || '');
      const safeContentVi = window.sanitizePostHtml(post.content_vi || post.content_en || '');
      const safeContentZh = window.sanitizePostHtml(post.content_zh || post.content_en || '');
      const authorProfileHref = post.profile_href
        || (typeof window.getAuthorProfileHref === 'function' ? window.getAuthorProfileHref(post.author_name) : '')
        || `profile.html?id=${encodeURIComponent(post.author_id || '')}`;

      container.innerHTML = `
        <article class="substack-post border-0 py-0" data-supported-langs="${escapePostText(post.supported_langs || 'en,vi,zh')}" data-category="${escapePostText(post.category)}">
          <div class="mb-3">
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-pill fw-medium category-label" data-original-cat="${post.category}">${typeof window.translateCategory === 'function' ? window.translateCategory(post.category) : post.category}</span>
          </div>
          
          <h1 class="post-title fw-bold mb-4 text-main"
              style="font-size: 1.75rem; letter-spacing: -0.025em; line-height: 1.25;">
            ${escapePostText(post.title_en)}
          </h1>

          <div class="substack-post-header mb-4 pb-3 border-bottom d-flex align-items-center justify-content-between">
            <div class="author-badge-group d-flex align-items-center position-relative author-tooltip-container" style="z-index: 2;">
              <img src="${escapePostText(post.author_avatar)}" alt="${escapePostText(post.author_name)}" class="author-avatar me-3 rounded-circle border" style="width:48px;height:48px;object-fit:cover;">
              <div class="author-meta-info">
                <div class="d-flex align-items-center flex-wrap">
                  <a href="${escapePostText(authorProfileHref)}" class="author-name me-1 text-decoration-none fw-bold text-main">${escapePostText(post.author_name)}</a>
                  <span class="post-timestamp text-muted small ms-2">${typeof window.formatTimestampI18n === 'function' ? window.formatTimestampI18n(post.timestamp) : post.timestamp}</span>
                </div>
                <div class="text-muted small">@${escapePostText(post.author_name.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, ''))}</div>
              </div>
              ${typeof window.getAuthorTooltipHtml === 'function' ? window.getAuthorTooltipHtml(post.author_name, post.author_avatar) : ''}
            </div>
            ${(typeof window.isSelfAuthor === 'function' && window.isSelfAuthor(post.author_name)) ? '' : `
              <button class="btn-subscribe ms-auto" data-unfollow-label="${typeof window.uiTranslations !== 'undefined' ? ((window.uiTranslations[localStorage.getItem('preferredLanguage') || 'en'] || {}).btn_unfollow || 'Unfollow') : 'Unfollow'}" onclick="if(typeof toggleSubscribe==='function') toggleSubscribe(this, event);"><span class="btn-subscribe-label">${typeof window.uiTranslations !== 'undefined' ? ((window.uiTranslations[localStorage.getItem('preferredLanguage') || 'en'] || {}).btn_follow || 'Follow') : 'Follow'}</span></button>
            `}
          </div>

          ${imageHtml}

          <div class="substack-post-content post-content mt-4 text-main" style="line-height: 1.8;" id="postBodyContent">
            ${safeContentEn}
          </div>

          <div class="substack-post-footer mt-5 pt-3 border-top d-flex align-items-center gap-4">
            <button class="footer-action-item btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-1 p-0" onclick="if(typeof toggleLike === 'function') toggleLike(this, ${likeCount}, event);"><i class="bi bi-heart"></i> <span class="like-count">${likeCount}</span></button>
            <button class="footer-action-item btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-1 p-0" onclick="document.getElementById('newCommentInput')?.focus()"><i class="bi bi-chat"></i> <span id="footerCommentCount">${post.comments}</span></button>
            <span class="footer-action-item text-muted d-flex align-items-center gap-1"><i class="bi bi-eye"></i> <span>${viewCount}</span></span>
          </div>
        </article>
      `;

      // Render comments and related posts from core.js
      if (typeof window.renderComments === 'function') {
        window.renderComments(postId);
      }
      renderRelatedPosts(postId, post.category);

      // JS-based language switcher for post body (avoids HTML-in-attribute parsing issues)
      const postBodyEl = document.getElementById('postBodyContent');
      const postTitleEl = container.querySelector('.post-title');
      const postContentMap = { en: safeContentEn, vi: safeContentVi, zh: safeContentZh };
      const postTitleMap = {
        en: post.title_en || '',
        vi: post.title_vi || post.title_en || '',
        zh: post.title_zh || post.title_en || ''
      };

      const postTranslationCache = {};
      let lastRequestedLang = localStorage.getItem('preferredLanguage') || 'en';

      async function translateText(text, targetLang) {
        if (!text || !text.trim()) return text;
        const endpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang === 'zh' ? 'zh-CN' : targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
        try {
          const res = await fetch(endpoint);
          if (!res.ok) return text;
          const data = await res.json();
          return Array.isArray(data?.[0])
            ? data[0].map(part => Array.isArray(part) ? part[0] || '' : '').join('')
            : text;
        } catch (err) {
          console.error('Translation error:', err);
          return text;
        }
      }

      async function translateHtml(html, targetLang) {
        if (!html || !html.trim()) return html;
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        
        const walker = document.createTreeWalker(tempContainer, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest('pre, code, script, style')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        
        await Promise.all(nodes.map(async (node) => {
          node.nodeValue = await translateText(node.nodeValue, targetLang);
        }));
        
        return tempContainer.innerHTML;
      }

      async function applyPostDetailLang(lang) {
        lastRequestedLang = lang;
        const translationCacheKey = `${postId}:${lang}`;
        const originalLang = post.originalLanguage || 'en';
        
        // 1. If it's the original language, use the original content directly
        if (lang === originalLang) {
          if (postBodyEl) {
            postBodyEl.innerHTML = typeof window.sanitizePostHtml === 'function'
              ? window.sanitizePostHtml(postContentMap[originalLang])
              : postContentMap[originalLang];
          }
          if (postTitleEl) {
            postTitleEl.textContent = postTitleMap[originalLang];
          }
          return;
        }
        
        // 2. Check if we already have it in the cache
        if (postTranslationCache[translationCacheKey]) {
          const cached = postTranslationCache[translationCacheKey];
          if (postBodyEl) postBodyEl.innerHTML = cached.body;
          if (postTitleEl) postTitleEl.textContent = cached.title;
          return;
        }
        
        // 3. If the translation map has pre-translated different content, use it!
        if (postContentMap[lang] && postContentMap[lang] !== postContentMap[originalLang]) {
          if (postBodyEl) {
            postBodyEl.innerHTML = typeof window.sanitizePostHtml === 'function'
              ? window.sanitizePostHtml(postContentMap[lang])
              : postContentMap[lang];
          }
          if (postTitleEl) {
            postTitleEl.textContent = postTitleMap[lang];
          }
          return;
        }
        
        // 4. Otherwise, perform dynamic translation using Google Translate
        if (postTitleEl) {
          postTitleEl.textContent = "...";
        }
        
        try {
          const originalTitle = postTitleMap[originalLang];
          const originalBody = postContentMap[originalLang];
          
          const [translatedTitle, translatedBody] = await Promise.all([
            translateText(originalTitle, lang),
            translateHtml(originalBody, lang)
          ]);
          
          postTranslationCache[translationCacheKey] = {
            title: translatedTitle,
            body: typeof window.sanitizePostHtml === 'function'
              ? window.sanitizePostHtml(translatedBody)
              : translatedBody
          };
          
          if (lastRequestedLang === lang) {
            if (postBodyEl) postBodyEl.innerHTML = postTranslationCache[translationCacheKey].body;
            if (postTitleEl) postTitleEl.textContent = postTranslationCache[translationCacheKey].title;
          }
        } catch (err) {
          console.error('Failed to translate post detail:', err);
          if (lastRequestedLang === lang) {
            if (postBodyEl) {
              postBodyEl.innerHTML = typeof window.sanitizePostHtml === 'function'
                ? window.sanitizePostHtml(postContentMap[originalLang])
                : postContentMap[originalLang];
            }
            if (postTitleEl) {
              postTitleEl.textContent = postTitleMap[originalLang];
            }
          }
        }
      }

      // Apply on initial load
      const currentLang = localStorage.getItem('preferredLanguage') || 'en';
      applyPostDetailLang(currentLang);

      // Listen for language switch via custom event dispatched by core.js
      document.addEventListener('lingoraLangChange', function(e) {
        applyPostDetailLang(e.detail && e.detail.lang ? e.detail.lang : (localStorage.getItem('preferredLanguage') || 'en'));
      });

      // Apply language filter
      if (typeof window.applyLanguageFilter === 'function') {
        window.applyLanguageFilter(currentLang);
      }
      if (typeof window.applyUiTranslations === 'function') {
        window.applyUiTranslations(currentLang);
      }
    }

    function renderRelatedPosts(currentPostId, category) {
      const container = document.getElementById('relatedPostsContainer');
      const publicPosts = window.getLingoraPostsData ? window.getLingoraPostsData() : window.globalPostsData;
      if (!container || !publicPosts) return;

      // Find posts with matching category (excluding current post)
      const relatedIds = Object.keys(publicPosts).filter(id => id !== String(currentPostId) && publicPosts[id].category === category);

      // If no other post in same category, fallback to showing top posts
      const idsToRender = relatedIds.length > 0 ? relatedIds : Object.keys(publicPosts).filter(id => id !== String(currentPostId)).slice(0, 2);

      let html = "";
      idsToRender.forEach(id => {
        const p = publicPosts[id];
        if (!p) return;
        const relComments = window.getCommentsForPost ? window.getCommentsForPost(id) : [];
        let relCount = 0;
        relComments.forEach(c => {
          relCount += 1 + (c.replies ? c.replies.length : 0);
        });
        p.comments = relCount;

        html += `
          <a href="post-detail.html?id=${id}" class="related-post-card text-reset text-decoration-none p-3 rounded-4 border border-light-subtle d-block transition-all hover-shadow" data-supported-langs="${p.supported_langs || 'en,vi,zh'}" data-category="${p.category}">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-0.5 rounded-pill small category-label" data-original-cat="${p.category}">${typeof window.translateCategory === 'function' ? window.translateCategory(p.category) : p.category}</span>
              <span class="text-muted small post-timestamp">${typeof window.formatTimestampI18n === 'function' ? window.formatTimestampI18n(p.timestamp) : p.timestamp}</span>
            </div>
            <h5 class="fw-bold mb-2 text-main"
                data-translate-title-en="${p.title_en}"
                data-translate-title-vi="${p.title_vi || p.title_en}"
                data-translate-title-zh="${p.title_zh || p.title_en}">
              ${p.title_en}
            </h5>
            <div class="d-flex align-items-center gap-2 text-muted small mt-3">
              <img src="${p.author_avatar}" class="rounded-circle" width="24" height="24" style="object-fit:cover;" alt="${p.author_name}">
              <span class="fw-medium text-main">${p.author_name}</span>
              <span class="ms-auto"><i class="bi bi-heart me-1"></i>${p.likes}</span>
              <span class="ms-2"><i class="bi bi-chat me-1"></i>${p.comments}</span>
            </div>
          </a>
        `;
      });

      container.innerHTML = html;
    }

    function getDetailCommentPostId() {
      const params = new URLSearchParams(window.location.search);
      return params.get('id') || params.get('submitted') || '1';
    }

    function readDetailComments(postId) {
      try {
        if (typeof window.getCommentsForPost === 'function') {
          const comments = window.getCommentsForPost(postId);
          if (Array.isArray(comments)) return comments;
        }
      } catch (error) {
        console.warn('Falling back to the local comment store.', error);
      }

      let database = {};
      try {
        database = JSON.parse(localStorage.getItem('mundi_comments_db') || '{}') || {};
      } catch (error) {
        database = {};
      }
      if (!Array.isArray(database[postId])) database[postId] = [];
      database._version = 3;
      localStorage.setItem('mundi_comments_db', JSON.stringify(database));
      return database[postId];
    }

    function saveDetailComments(postId, comments) {
      try {
        if (typeof window.saveCommentsForPost === 'function') {
          window.saveCommentsForPost(postId, comments);
          return;
        }
      } catch (error) {
        console.warn('Saving comments with the local fallback.', error);
      }

      let database = {};
      try {
        database = JSON.parse(localStorage.getItem('mundi_comments_db') || '{}') || {};
      } catch (error) {
        database = {};
      }
      database._version = 3;
      database[postId] = comments;
      localStorage.setItem('mundi_comments_db', JSON.stringify(database));
    }

    function getDetailCommentUser() {
      if (typeof window.getLingoraCurrentUser === 'function') {
        const current = window.getLingoraCurrentUser();
        if (current?.name) return current;
      }

      let profile = {};
      try {
        profile = JSON.parse(localStorage.getItem('mundiBlogProfile') || '{}') || {};
      } catch (error) {}
      return {
        name: profile.displayName || 'Alone',
        avatar: profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80'
      };
    }

    function refreshDetailComments(postId) {
      if (typeof window.renderComments === 'function') window.renderComments(postId);
    }

    function submitDetailComment() {
      const input = document.getElementById('newCommentInput');
      const content = input?.value.trim();
      if (!content) {
        input?.focus();
        return;
      }

      const postId = getDetailCommentPostId();
      const comments = readDetailComments(postId);
      const user = getDetailCommentUser();
      comments.unshift({
        id: Date.now(), author: user.name, avatar: user.avatar, time: 'Just now',
        content, lang: localStorage.getItem('preferredLanguage') || 'vi',
        translations: {}, likes: 0, isLiked: false, replies: []
      });
      saveDetailComments(postId, comments);
      input.value = '';
      refreshDetailComments(postId);
    }

    function openDetailReply(rootId, author) {
      document.querySelectorAll('[id^="reply-box-"]').forEach(element => { element.innerHTML = ''; });
      const box = document.getElementById(`reply-box-root-${rootId}`);
      if (!box) return;
      box.innerHTML = `
        <div class="mt-2 pt-2 border-top">
          <textarea class="form-control form-control-sm mb-2" rows="2" data-detail-reply-input></textarea>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" type="button" data-detail-cancel-reply>Cancel</button>
            <button class="btn btn-sm btn-primary rounded-pill px-3 fw-medium" type="button" data-detail-submit-reply data-root-id="${rootId}" onclick="event.preventDefault(); event.stopPropagation(); window.submitDetailReply(this.dataset.rootId, this);">Reply</button>
          </div>
        </div>`;
      const input = box.querySelector('[data-detail-reply-input]');
      input.placeholder = `Replying to ${author || 'comment'}...`;
      input.focus();
    }

    function submitDetailReply(rootId, button) {
      const box = button.closest('[id^="reply-box-root-"]');
      const input = box?.querySelector('[data-detail-reply-input]')
        || document.getElementById(`input-reply-${rootId}`);
      const content = input?.value.trim();
      if (!content) {
        input?.focus();
        return;
      }

      const postId = getDetailCommentPostId();
      const comments = readDetailComments(postId);
      const root = comments.find(comment => String(comment.id) === String(rootId));
      if (!root) return;
      const user = getDetailCommentUser();
      if (!Array.isArray(root.replies)) root.replies = [];
      root.replies.push({
        id: Date.now(), author: user.name, avatar: user.avatar, time: 'Just now',
        content, lang: localStorage.getItem('preferredLanguage') || 'vi',
        replyTo: '', translations: {}, likes: 0, isLiked: false
      });
      saveDetailComments(postId, comments);
      refreshDetailComments(postId);
    }

    window.openDetailReply = openDetailReply;
    window.submitDetailReply = submitDetailReply;

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('postCommentButton')?.addEventListener('click', () => {
        submitDetailComment();
      });
      document.addEventListener('click', event => {
        if (!(event.target instanceof Element)) return;
        const commentArea = event.target.closest('#commentsListContainer');
        if (!commentArea) return;

        const openButton = event.target.closest('[data-open-comment-reply]');
        if (openButton) {
          event.preventDefault();
          event.stopImmediatePropagation();
          openDetailReply(openButton.dataset.rootId, decodeURIComponent(openButton.dataset.author || ''));
          return;
        }
        const cancelButton = event.target.closest('[data-detail-cancel-reply]');
        if (cancelButton) {
          event.preventDefault();
          cancelButton.closest('[id^="reply-box-root-"]').innerHTML = '';
          return;
        }
        const submitButton = event.target.closest('[data-detail-submit-reply], [data-submit-comment-reply]');
        if (submitButton) {
          event.preventDefault();
          event.stopImmediatePropagation();
          submitDetailReply(submitButton.dataset.rootId, submitButton);
        }
      }, true);
      renderPostDetail();
    });
  