document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.nav-search-btn'); // 搜索图标按钮
  const searchContainer = document.getElementById('search-container'); // 整个搜索弹窗容器
  const searchCloseBtn = document.querySelector('.search-close'); // 关闭按钮
  const searchInput = document.getElementById('search-input'); // 搜索输入框
  const searchResult = document.getElementById('search-result'); // 搜索结果列表
  let searchDB = null; // 存储搜索数据

  // 获取搜索数据
  async function fetchSearchData() {
    try {
      const response = await fetch('/search.xml'); // 从 public/search.xml 获取数据
      const str = await response.text();
      const parser = new window.DOMParser();
      const data = parser.parseFromString(str, 'text/xml');
      
      const entries = data.querySelectorAll('entry');
      return Array.from(entries).map(entry => ({
        title: entry.querySelector('title')?.textContent || '',
        url: entry.querySelector('url')?.textContent || '',
        content: entry.querySelector('content')?.textContent || ''
      }));
    } catch (error) {
      console.error('Error fetching search data:', error);
      return []; // 返回空数组以防止后续错误
    }
  }

  // 打开搜索弹窗
  function openSearchModal() {
    searchContainer.classList.add('show'); // 添加 show 类来显示弹窗
    searchInput.focus(); // 自动聚焦到输入框
    if (!searchDB) { // 如果搜索数据还没加载，则加载
      fetchSearchData().then(data => {
        searchDB = data;
      });
    }
  }

  // 关闭搜索弹窗
  function closeSearchModal() {
    searchContainer.classList.remove('show'); // 移除 show 类来隐藏弹窗
    searchInput.value = ''; // 清空输入框
    searchResult.innerHTML = ''; // 清空搜索结果
  }

  // 执行搜索
  function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length === 0) {
      searchResult.innerHTML = ''; // 查询为空时清空结果
      return;
    }

    if (!searchDB) {
      // 如果数据还没加载完成，稍后重试（在实际使用中，数据加载速度快，通常不会触发）
      searchResult.innerHTML = '<li>加载搜索数据中，请稍候...</li>';
      setTimeout(performSearch, 300);
      return;
    }

    const keywords = query.split(/\s+/).filter(k => k.length > 0); // 分割关键词并过滤空字符串
    const results = searchDB.filter(post => {
      // 搜索标题和内容
      const combinedContent = (post.title + ' ' + post.content).toLowerCase();
      // 所有关键词都必须匹配
      return keywords.every(keyword => combinedContent.includes(keyword));
    });

    displayResults(results);
  }

  // 显示搜索结果
  function displayResults(results) {
    let html = '';
    if (results.length === 0) {
      html = '<li>没有找到相关结果。</li>';
    } else {
      results.forEach(post => {
        // 简单截取内容作为摘要
        const excerpt = post.content.substring(0, 120); 
        html += `
          <li>
            <a href="${post.url}">${post.title}</a>
            <div class="search-excerpt">${excerpt}...</div>
          </li>
        `;
      });
    }
    searchResult.innerHTML = html;
  }

  // 事件监听
  searchBtn.addEventListener('click', openSearchModal);
  searchCloseBtn.addEventListener('click', closeSearchModal);
  searchInput.addEventListener('input', performSearch); // 输入时实时搜索

  // 点击外部关闭弹窗
  searchContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('search-modal')) { // 只有点击到半透明背景才关闭
      closeSearchModal();
    }
  });

  // 按 ESC 键关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchContainer.classList.contains('show')) {
      closeSearchModal();
    }
  });
});