const state = {
  articles: [],
  currentArticle: null,
  activeTag: null,
  cache: {}
};

async function init() {
  await loadArticles();
  renderTagFilter();
  renderArticles();
  setupEventListeners();
}

async function loadArticles() {
  try {
    const response = await fetch('data/index.json');
    const data = await response.json();
    state.articles = data.articles;
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
  const tags = new Set();
  state.articles.forEach(article => {
    article.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

function getFilteredArticles() {
  if (!state.activeTag) {
    return state.articles;
  }
  return state.articles.filter(article => article.tags.includes(state.activeTag));
}

function renderTagFilter() {
  const container = document.getElementById('tagFilter');
  const tags = getAllTags();

  const allBtn = document.createElement('button');
  allBtn.className = `tag-btn ${!state.activeTag ? 'active' : ''}`;
  allBtn.textContent = '全部';
  allBtn.addEventListener('click', () => filterByTag(null));
  container.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = `tag-btn ${state.activeTag === tag ? 'active' : ''}`;
    btn.textContent = tag;
    btn.addEventListener('click', () => filterByTag(tag));
    container.appendChild(btn);
  });
}

function filterByTag(tag) {
  state.activeTag = tag;
  const buttons = document.querySelectorAll('.tag-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.textContent === (tag || '全部'));
  });
  renderArticles();
}

function renderArticles() {
  const container = document.getElementById('articlesGrid');
  const articles = getFilteredArticles();
  container.innerHTML = '';

  if (articles.length === 0) {
    container.innerHTML = '<p class="no-articles">暂无文章</p>';
    return;
  }

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.innerHTML = `
      <div class="article-date">${article.date}</div>
      <h2 class="article-title">${article.title}</h2>
      <p class="article-summary">${article.summary}</p>
      <div class="article-tags">
        ${article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => openArticle(article.id));
    container.appendChild(card);
  });
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
        <span>${article.date}</span>
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
}

document.addEventListener('DOMContentLoaded', init);
