(function () {
  'use strict';

  const STORAGE_KEY = 'mundi_comments_db';
  let database = readDatabase();
  const initialSnapshots = {};
  const sessionComments = {};

  function readDatabase() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      return {};
    }
  }

  function saveDatabase() {
    try {
      database._version = 3;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
    } catch (error) {
      // The on-screen demo remains usable even when storage is unavailable.
    }
  }

  function currentPostKey() {
    const params = new URLSearchParams(window.location.search);
    const submitted = params.get('submitted');
    return submitted || params.get('id') || '1';
  }

  function createId() {
    return (Date.now() * 1000) + Math.floor(Math.random() * 1000);
  }

  function seedComments() {
    return [
      {
        id: createId(),
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80&h=80',
        time: '2 giờ trước',
        content: 'Bài viết rất thú vị và trực quan. Cảm ơn tác giả đã chia sẻ.',
        replies: []
      },
      {
        id: createId(),
        author: 'Tuấn Hưng',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80&h=80',
        time: '1 giờ trước',
        content: 'Bài viết rất chất lượng và chi tiết! Cảm ơn tác giả.',
        replies: []
      }
    ];
  }

  function normalizeComments(value) {
    if (!Array.isArray(value)) return null;
    return value
      .filter(comment => comment && typeof comment === 'object' && !Array.isArray(comment))
      .map(comment => ({
        ...comment,
        id: comment.id || createId(),
        replies: Array.isArray(comment.replies)
          ? comment.replies.filter(reply => reply && typeof reply === 'object' && !Array.isArray(reply))
          : []
      }));
  }

  function commentsForCurrentPost() {
    const key = currentPostKey();
    if (Array.isArray(sessionComments[key])) return sessionComments[key];
    if (typeof window.getCommentsForPost === 'function') {
      const comments = normalizeComments(window.getCommentsForPost(key)) || [];
      if (!initialSnapshots[key]) initialSnapshots[key] = JSON.parse(JSON.stringify(comments));
      sessionComments[key] = comments;
      return comments;
    }
    database = readDatabase();
    const normalized = normalizeComments(database[key]);
    if (normalized) {
      database[key] = normalized;
      sessionComments[key] = normalized;
      return normalized;
    }
    database[key] = seedComments();
    saveDatabase();
    sessionComments[key] = database[key];
    return database[key];
  }

  function saveCurrentComments(comments) {
    const key = currentPostKey();
    sessionComments[key] = comments;
    try {
      if (typeof window.saveCommentsForPost === 'function') {
        window.saveCommentsForPost(key, comments);
      } else {
        database = readDatabase();
        database[key] = comments;
        saveDatabase();
      }
    } catch (error) {
      console.warn('Comments remain available for this demo session because local storage could not be updated.', error);
    }
    try {
      if (typeof window.syncFeedCommentCounts === 'function') window.syncFeedCommentCounts();
    } catch (error) {}
  }

  function getDemoUser() {
    let session = {};
    let profile = {};
    try {
      const parsed = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (parsed && typeof parsed === 'object') session = parsed;
      else if (typeof parsed === 'string') session = { name: parsed };
    } catch (error) {}
    try {
      profile = JSON.parse(localStorage.getItem('mundiBlogProfile') || '{}') || {};
    } catch (error) {}
    return {
      name: session.name || session.displayName || profile.displayName || session.username || 'System Admin',
      avatar: profile.avatar || session.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80&h=80'
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function authorIdentityHtml(author, avatar, size, nameClass) {
    const profileHref = typeof window.getAuthorProfileHref === 'function'
      ? window.getAuthorProfileHref(author, avatar)
      : `profile.html?author=${encodeURIComponent(author || '')}&avatar=${encodeURIComponent(avatar || '')}`;
    const tooltip = typeof window.getAuthorTooltipHtml === 'function'
      ? window.getAuthorTooltipHtml(author, avatar)
      : '';
    const safeSize = Number(size) || 42;
    return `
      <div class="author-tooltip-container position-relative d-inline-flex align-items-center gap-2">
        <a href="${escapeHtml(profileHref)}" class="d-inline-flex align-items-center gap-2 text-decoration-none text-main">
          <img src="${escapeHtml(avatar)}" class="rounded-circle" width="${safeSize}" height="${safeSize}" style="width:${safeSize}px;height:${safeSize}px;min-width:${safeSize}px;flex:0 0 ${safeSize}px;aspect-ratio:1/1;object-fit:cover;border-radius:50%" alt="${escapeHtml(author)}">
          <span class="${nameClass}">${escapeHtml(author)}</span>
        </a>
        ${tooltip}
      </div>`;
  }

  function translationButtonHtml(comment, currentLanguage) {
    if (!comment.lang || comment.lang === currentLanguage) return '';
    const translated = typeof window.getCommentTranslation === 'function'
      ? window.getCommentTranslation(comment, currentLanguage)
      : ((comment.translations && comment.translations[currentLanguage]) || comment.content);
    return `<button class="btn-reply" type="button" data-demo-translate
      data-original="${encodeURIComponent(comment.content || '')}"
      data-translated="${encodeURIComponent(translated || '')}"
      title="Dịch bình luận" aria-label="Dịch bình luận"><i class="bi bi-translate"></i></button>`;
  }

  function renderComments() {
    const container = document.getElementById('commentsListContainer');
    if (!container) return;
    const comments = commentsForCurrentPost();
    const total = comments.reduce((count, comment) => count + 1 + comment.replies.length, 0);
    const currentLanguage = localStorage.getItem('preferredLanguage') || 'vi';
    const count = document.getElementById('commentCountText');
    const footerCount = document.getElementById('footerCommentCount');
    if (count) count.textContent = total;
    if (footerCount) footerCount.textContent = total;
    const postKey = currentPostKey();
    if (window.globalPostsData && window.globalPostsData[postKey]) window.globalPostsData[postKey].comments = total;

    container.dataset.staticCommentsReady = 'true';
    container.innerHTML = comments.map(comment => {
      const replies = comment.replies.map(reply => `
        <div class="comment-reply-card py-3 border-bottom border-light-subtle" data-demo-reply-id="${reply.id}">
          <div class="d-flex align-items-center gap-2 mb-2">
            ${authorIdentityHtml(reply.author, reply.avatar, 30, 'fw-bold text-main author-name')}
            <span class="text-muted small ms-auto">${escapeHtml(reply.time || 'Vừa xong')}</span>
          </div>
          <p class="mb-2 text-secondary" data-demo-comment-content>${escapeHtml(reply.content)}</p>
          <div class="d-flex align-items-center gap-2">
            <button class="btn-reply" type="button" data-demo-like><i class="bi bi-heart"></i> <span>${Number(reply.likes) || 0}</span></button>
            ${translationButtonHtml(reply, currentLanguage)}
          </div>
        </div>`).join('');

      return `
        <div class="comment-card py-3 border-bottom border-light-subtle" data-demo-root-id="${comment.id}">
          <div class="d-flex align-items-center gap-2 mb-2">
            ${authorIdentityHtml(comment.author, comment.avatar, 42, 'fw-bold fs-6 text-main author-name')}
            <span class="text-muted small ms-auto">${escapeHtml(comment.time || 'Vừa xong')}</span>
          </div>
          <p class="mb-2 text-secondary" data-demo-comment-content>${escapeHtml(comment.content)}</p>
          <div class="d-flex align-items-center gap-3">
            <button class="btn-reply" type="button" data-demo-like><i class="bi bi-heart"></i> <span>${Number(comment.likes) || 0}</span></button>
            <button class="btn-reply" type="button" data-demo-open-reply="${comment.id}" aria-label="Reply"><i class="bi bi-chat"></i></button>
            ${translationButtonHtml(comment, currentLanguage)}
            ${comment.isDemoUser ? `<button class="btn-reply text-danger" type="button" data-demo-delete="${comment.id}" aria-label="Delete"><i class="bi bi-trash"></i></button>` : ''}
          </div>
          <div data-demo-reply-box="${comment.id}"></div>
          ${replies ? `<div class="comment-reply-list mt-3 ps-3 border-start border-2">${replies}</div>` : ''}
        </div>`;
    }).join('');
  }

  function addComment() {
    const input = document.getElementById('newCommentInput');
    const content = input ? input.value.trim() : '';
    if (!content) {
      input?.focus();
      return;
    }
    const user = getDemoUser();
    const comments = commentsForCurrentPost();
    comments.unshift({
      id: createId(), author: user.name, avatar: user.avatar, time: 'Vừa xong',
      content, lang: localStorage.getItem('preferredLanguage') || 'vi', translations: {}, replies: [], isDemoUser: true
    });
    input.value = '';
    saveCurrentComments(comments);
    renderComments();
    input.focus();
  }

  function openReply(rootId) {
    document.querySelectorAll('[data-demo-reply-box]').forEach(box => { box.innerHTML = ''; });
    const box = document.querySelector(`[data-demo-reply-box="${CSS.escape(String(rootId))}"]`);
    if (!box) return;
    box.innerHTML = `
      <div class="mt-3 pt-3 border-top">
        <textarea class="form-control mb-2" rows="2" data-demo-reply-input placeholder="Nhập phản hồi..."></textarea>
        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" type="button" data-demo-cancel>Hủy</button>
          <button class="btn btn-sm btn-primary rounded-pill px-3 fw-medium" type="button" data-demo-submit-reply="${rootId}">Trả lời</button>
        </div>
      </div>`;
    box.querySelector('[data-demo-reply-input]').focus();
  }

  function addReply(rootId, button) {
    const box = button.closest('[data-demo-reply-box]');
    const input = box?.querySelector('[data-demo-reply-input]');
    const content = input ? input.value.trim() : '';
    if (!content) {
      input?.focus();
      return;
    }
    const comments = commentsForCurrentPost();
    const root = comments.find(comment => String(comment.id) === String(rootId));
    if (!root) return;
    const user = getDemoUser();
    root.replies.push({
      id: createId(), author: user.name, avatar: user.avatar, time: 'Vừa xong', content,
      lang: localStorage.getItem('preferredLanguage') || 'vi', translations: {}, isDemoUser: true
    });
    saveCurrentComments(comments);
    renderComments();
  }

  function resetCurrentPost() {
    const key = currentPostKey();
    const initial = initialSnapshots[key] || seedComments();
    saveCurrentComments(JSON.parse(JSON.stringify(initial)));
    const input = document.getElementById('newCommentInput');
    if (input) input.value = '';
    renderComments();
  }

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const postButton = event.target.closest('#postCommentButton');
    const resetButton = event.target.closest('#resetCommentsDemoButton');
    const commentsArea = event.target.closest('#commentsListContainer');
    if (!postButton && !resetButton && !commentsArea) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (postButton) return addComment();
    if (resetButton) return resetCurrentPost();

    const open = event.target.closest('[data-demo-open-reply]');
    if (open) return openReply(open.dataset.demoOpenReply);
    const submit = event.target.closest('[data-demo-submit-reply]');
    if (submit) return addReply(submit.dataset.demoSubmitReply, submit);
    const cancel = event.target.closest('[data-demo-cancel]');
    if (cancel) {
      const box = cancel.closest('[data-demo-reply-box]');
      if (box) box.innerHTML = '';
      return;
    }
    const remove = event.target.closest('[data-demo-delete]');
    if (remove) {
      saveCurrentComments(commentsForCurrentPost().filter(comment => String(comment.id) !== String(remove.dataset.demoDelete)));
      renderComments();
      return;
    }
    const translate = event.target.closest('[data-demo-translate]');
    if (translate) {
      const card = translate.closest('[data-demo-reply-id], [data-demo-root-id]');
      const content = card?.querySelector('[data-demo-comment-content]');
      if (!content) return;
      const showingTranslation = translate.dataset.showingTranslation === 'true';
      const encoded = showingTranslation ? translate.dataset.original : translate.dataset.translated;
      try { content.textContent = decodeURIComponent(encoded || ''); } catch (error) { content.textContent = encoded || ''; }
      translate.dataset.showingTranslation = String(!showingTranslation);
      translate.classList.toggle('text-primary', !showingTranslation);
      return;
    }
    const like = event.target.closest('[data-demo-like]');
    if (like) {
      const icon = like.querySelector('i');
      const value = like.querySelector('span');
      const liked = like.classList.toggle('text-danger');
      if (icon) icon.className = liked ? 'bi bi-heart-fill' : 'bi bi-heart';
      if (value) value.textContent = liked ? '1' : '0';
    }
  }, true);

  window.resetStaticDemoComments = resetCurrentPost;
  window.submitStaticDemoComment = function(event) {
    if (event) event.preventDefault();
    addComment();
    return false;
  };
  window.addEventListener('DOMContentLoaded', () => setTimeout(renderComments, 0));
  window.addEventListener('lingora:languagechange', () => setTimeout(renderComments, 0));
})();
