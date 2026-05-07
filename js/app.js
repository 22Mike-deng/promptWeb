const state = {
  articles: [],
  currentArticle: null,
  activeTag: null,
  searchQuery: '',
  cache: {}
};

async function init() {
  await loadArticles();
  renderTagCloud();
  renderArticles();
  updateStats();
  setupEventListeners();
}

async function loadArticles() {
  try {
    const response = await fetch('data/index.json');
    const data = await response.json();
    state.articles = data.articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('加载文章失败:', error);
  }
}

async function loadArticleDetail(id) {
  if (state.cache[id]) {
    return state.cache[id];
  }
  try {
    const response = await fetch(`data/articles/${id}.json`);
    const data = await response.json();
    state.cache[id] = data;
    return data;
  } catch (error) {
    console.error('加载文章详情失败:', error);
    return null;
  }
}

function getAllTags() {
  const tagCounts = {};
  state.articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
}

function getFilteredArticles() {
  let articles = state.articles;

  if (state.activeTag) {
    articles = articles.filter(article => article.tags.includes(state.activeTag));
  }

  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    articles = articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.summary.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return articles;
}

function renderTagCloud() {
  const container = document.getElementById('tagCloud');
  const tags = getAllTags();

  const allBtn = document.createElement('button');
  allBtn.className = `tag-cloud-item ${!state.activeTag ? 'active' : ''}`;
  allBtn.innerHTML = `<span class="tag-name">全部</span><span class="tag-count">${state.articles.length}</span>`;
  allBtn.addEventListener('click', () => filterByTag(null));
  container.appendChild(allBtn);

  tags.forEach(([tag, count]) => {
    const btn = document.createElement('button');
    btn.className = `tag-cloud-item ${state.activeTag === tag ? 'active' : ''}`;
    btn.innerHTML = `<span class="tag-name">${tag}</span><span class="tag-count">${count}</span>`;
    btn.addEventListener('click', () => filterByTag(tag));
    container.appendChild(btn);
  });
}

function filterByTag(tag) {
  state.activeTag = tag;

  document.querySelectorAll('.tag-cloud-item').forEach(btn => {
    const tagName = btn.querySelector('.tag-name').textContent;
    btn.classList.toggle('active', tagName === (tag || '全部'));
  });

  const titleEl = document.getElementById('contentTitle');
  titleEl.textContent = tag ? `标签：${tag}` : '全部文章';

  renderArticles();
}

function searchArticles(query) {
  state.searchQuery = query;

  const titleEl = document.getElementById('contentTitle');
  if (query) {
    titleEl.textContent = `搜索：${query}`;
  } else {
    titleEl.textContent = state.activeTag ? `标签：${state.activeTag}` : '全部文章';
  }

  renderArticles();
}

function renderArticles() {
  const container = document.getElementById('articlesList');
  const articles = getFilteredArticles();
  const countEl = document.getElementById('contentCount');

  countEl.textContent = `${articles.length} 篇`;
  container.innerHTML = '';

  if (articles.length === 0) {
    container.innerHTML = `
      <div class="no-articles">
        <p>没有找到相关文章</p>
        <button class="reset-btn" onclick="resetFilters()">重置筛选</button>
      </div>
    `;
    return;
  }

  articles.forEach((article, index) => {
    const card = document.createElement('article');
    card.className = 'article-item';
    card.style.animationDelay = `${index * 0.05}s`;

    card.innerHTML = `
      <div class="article-item-header">
        <time class="article-item-date">${article.date}</time>
        <div class="article-item-tags">
          ${article.tags.map(tag => `<span class="article-item-tag">${tag}</span>`).join('')}
        </div>
      </div>
      <h3 class="article-item-title">${article.title}</h3>
      <p class="article-item-summary">${article.summary}</p>
      <div class="article-item-footer">
        <span class="read-more">阅读全文 →</span>
      </div>
    `;

    card.addEventListener('click', () => openArticle(article.id));
    container.appendChild(card);
  });
}

function updateStats() {
  document.getElementById('articleCount').textContent = state.articles.length;
  document.getElementById('tagCount').textContent = getAllTags().length;
}

function resetFilters() {
  state.activeTag = null;
  state.searchQuery = '';
  document.getElementById('searchInput').value = '';

  document.querySelectorAll('.tag-cloud-item').forEach(btn => {
    const tagName = btn.querySelector('.tag-name').textContent;
    btn.classList.toggle('active', tagName === '全部');
  });

  document.getElementById('contentTitle').textContent = '全部文章';
  renderArticles();
}

async function openArticle(id) {
  const article = await loadArticleDetail(id);
  if (!article) return;

  state.currentArticle = article;
  const detail = document.getElementById('articleDetail');
  const body = document.getElementById('detailBody');

  body.innerHTML = `
    <div class="detail-header">
      <h1 class="detail-title">${article.title}</h1>
      <div class="detail-meta">
        <time>${article.date}</time>
        <div class="article-tags">
          ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
    ${article.content}
  `;

  detail.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeArticle() {
  const detail = document.getElementById('articleDetail');
  detail.classList.remove('active');
  document.body.style.overflow = '';
  state.currentArticle = null;
}

function setupEventListeners() {
  document.getElementById('closeDetail').addEventListener('click', closeArticle);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticle();
    }
  });

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  searchInput.addEventListener('input', (e) => {
    searchArticles(e.target.value);
  });

  searchBtn.addEventListener('click', () => {
    searchArticles(searchInput.value);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchArticles(searchInput.value);
    }
  });

  // 文章详情内的筛选按钮事件委托
  document.getElementById('detailBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      const category = e.target.dataset.category;
      filterArticleCards(category);
    }
  });
}

// 文章详情内的分类筛选功能
function filterArticleCards(category) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === category) {
      btn.classList.add('active');
    }
  });
  
  // Show/hide categories
  document.querySelectorAll('.category-section').forEach(section => {
    if (category === 'all' || section.dataset.category === category) {
      section.style.display = 'block';
    } else {
      section.style.display = 'none';
    }
  });
}

// 角色资料弹窗功能
function openProfileModal() {
  const modal = document.getElementById('profileModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
  const modal = document.getElementById('profileModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// 在 init 函数后添加头像点击事件
function initProfileModal() {
  const avatarContainer = document.getElementById('avatarContainer');
  const profileCloseBtn = document.getElementById('profileCloseBtn');
  const profileModal = document.getElementById('profileModal');
  
  if (avatarContainer) {
    avatarContainer.addEventListener('click', openProfileModal);
  }
  
  if (profileCloseBtn) {
    profileCloseBtn.addEventListener('click', closeProfileModal);
  }
  
  // 点击弹窗外部关闭
  if (profileModal) {
    profileModal.addEventListener('click', (e) => {
      if (e.target === profileModal) {
        closeProfileModal();
      }
    });
  }
  
  // ESC 键关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProfileModal();
    }
  });
}

// 修改 init 函数，添加头像点击事件
const originalInit = init;
init = function() {
  originalInit();
  initProfileModal();
};

document.addEventListener('DOMContentLoaded', init);
