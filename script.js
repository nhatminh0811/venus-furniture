(() => {
  const header = document.querySelector('.site-header');
  const productsTrigger = document.querySelector('.products-trigger');
  const megaMenu = document.querySelector('.mega-menu');
  const scrim = document.querySelector('.menu-scrim');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavigation = document.querySelector('.mobile-navigation');
  const productGrid = document.querySelector('.product-grid');
  const filterButtons = [...document.querySelectorAll('.filter-button')];

  // Keep these filenames in sync with the files in each images/<category>/ folder.
  const catalog = [
    {
      category: 'Sofas', folder: 'sofas', description: 'Sofa thiết kế VENUS', fallback: 'photo-1555041469-a586c61ea9bc',
      files: [
        'Sofa Bạch Dương.jpg', 'Sofa Hỏa Tước.jpg', 'Sofa Khối Tĩnh.jpg',
        'Sofa Mây Xám.jpg', 'Sofa Oliva.jpg', 'Sofa Rêu Phong.jpg', 'Sofa Twilight.jpg',
      ],
    },
    {
      category: 'Thảm', folder: 'thảm', description: 'Thảm trang trí VENUS', fallback: 'photo-1600166898405-da9535204843',
      files: [
        'Thảm Ba Tư .jpg', 'Thảm Bohemian.jpg', 'Thảm Bắc Âu.jpg', 'Thảm Champagne Silk.jpg',
        'Thảm Dạ Cổ.jpg', 'Thảm Shiraz.jpg', 'Thảm Snow Flake.jpg', 'Thảm Vòng Trăng.jpg',
      ],
    },
    {
      category: 'Giường', folder: 'giường', description: 'Giường ngủ VENUS', fallback: 'photo-1505693416388-ac5ce068fe85',
      files: [
        'Giường Cloud.jpg', 'Giường Dạ Khúc.jpg', 'Giường Elysian.jpg', 'Giường Heritage.jpg',
        'Giường Minimal.jpg', 'Giường Monochic.jpg', 'Giường Nocturne.jpg',
        'Giường Rattan Mộc.jpg', 'Giường Seaside.jpg',
      ],
    },
    {
      category: 'Bàn', folder: 'bàn', description: 'Bàn thiết kế VENUS', fallback: 'photo-1499933374294-4584851497cc',
      files: [
        'Bàn Horizon.jpg', 'Bàn Sole.jpg', 'Bàn Solstice.jpg', 'Bàn trà Glass Box.jpg',
        'Bàn trà Oval Sồi.jpg', 'Bàn trà Terra.jpg', 'Bàn ăn Tròn Aurelia.jpg', 'Grand Circle.jpg',
      ],
    },
    {
      category: 'Ghế', folder: 'ghế', description: 'Ghế thiết kế VENUS', fallback: 'photo-1503602642458-232111445657',
      files: [
        'Ghế Bubble .jpg', 'Ghế bành Mid-Century Green.jpg', 'Ghế Bạch Tuyết.jpg',
        'Ghế Celeste .jpg', 'Ghế Harmony.jpg', 'ghế Hygge Loung.jpg', 'Ghế Indigo.jpg',
        'Ghế Ivory Royal.jpg', 'Ghế Mây.jpg', 'Ghế Serein Lounge.jpg', 'Ghế Solitude.jpg',
        'Ghế Urban Grey.jpg', 'Ghế Velvet Heritage.jpg',
      ],
    },
    {
      category: 'Tủ kệ', folder: 'tủ kệ', description: 'Tủ kệ thiết kế VENUS', fallback: 'photo-1595428774223-ef52624120d2',
      files: [
        'Hệ tủ Veneto.jpg', 'Kệ Atelier.jpg', 'Kệ treo tường Loft.jpg', 'Kệ Tĩnh Lặng.jpg',
        'Tủ console Arch Luxury.jpg', 'Tủ Mộc Lan.jpg', 'Tủ tivi An Nhiên.jpg',
        'Tủ trang trí Louver.jpg',
      ],
    },
    {
      category: 'Đèn', folder: 'đèn', description: 'Đèn trang trí VENUS', fallback: 'photo-1507473885765-e6ed057f782c',
      files: [
        'Bộ đèn thả đồng nguyên khối.jpg', 'Đèn bàn nón đồng.jpg',
        'Đèn chùm cổ điển Regent.jpg', 'Đèn chùm pha lê Versailles.jpg',
        'Đèn cây Regent Floor.jpg', 'Đèn Minimal.jpg', 'Đèn sóng lượn Pleat.jpg',
        'Đèn thả mây đan.jpg', 'Đèn thả trần Eclipse.jpg',
        'Đèn thả trần điêu khắc Organica.jpg', 'Đèn thả trụ đen tối giản.jpg',
      ],
    },
    {
      category: 'Decor', folder: 'decor', description: 'Đồ trang trí VENUS', fallback: 'photo-1578500494198-246f612d3b3d',
      files: [
        'Chăn phủ Bắc Âu Monochic.jpg', 'Chăn phủ ca-rô hồng trầ.jpg',
        'Chăn phủ thú cao cấp.jpg', 'Gối dệt ngôi sao.jpg', 'Gối Fur Gold.jpg',
        'Gối Stripe Luxury.jpg', 'Gối Thổ Cẩm Nomad.jpg',
      ],
    },
  ];

  const productCards = [];
  catalog.forEach(({ category, folder, description, fallback, files }) => {
    files.forEach((filename) => {
      const name = filename.replace(/\.[^.]+$/, '').trim();
      const image = document.createElement('img');
      image.src = `images/${folder}/${filename}`;
      image.alt = name;
      image.loading = 'lazy';
      image.addEventListener('error', () => {
        image.src = `https://images.unsplash.com/${fallback}?auto=format&fit=crop&w=1000&q=85`;
      }, { once: true });

      const imageLink = document.createElement('a');
      imageLink.className = 'product-image';
      imageLink.href = '#contact';
      imageLink.append(image);

      const action = document.createElement('span');
      action.className = 'product-action';
      action.append(document.createTextNode('Xem chi tiết '));
      const actionArrow = document.createElement('b');
      actionArrow.textContent = '↗';
      action.append(actionArrow);
      imageLink.append(action);

      const details = document.createElement('div');
      details.className = 'product-meta';
      const descriptionBlock = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = name;
      const subtitle = document.createElement('span');
      subtitle.textContent = description;
      descriptionBlock.append(title, subtitle);

      const categoryLabel = document.createElement('span');
      categoryLabel.className = 'product-category';
      categoryLabel.textContent = category;
      details.append(descriptionBlock, categoryLabel);

      const card = document.createElement('article');
      card.className = 'product-card';
      card.dataset.category = category;
      card.append(imageLink, details);
      productGrid.append(card);
      productCards.push(card);
    });
  });

  const closeMenus = () => {
    header.classList.remove('menu-active', 'mobile-active');
    productsTrigger.setAttribute('aria-expanded', 'false');
    megaMenu.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNavigation.setAttribute('aria-hidden', 'true');
  };

  const toggleProductsMenu = () => {
    const willOpen = !header.classList.contains('menu-active');
    header.classList.toggle('menu-active', willOpen);
    productsTrigger.setAttribute('aria-expanded', String(willOpen));
    megaMenu.setAttribute('aria-hidden', String(!willOpen));
    header.classList.remove('mobile-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNavigation.setAttribute('aria-hidden', 'true');
  };

  productsTrigger.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleProductsMenu();
  });

  mobileToggle.addEventListener('click', () => {
    const willOpen = !header.classList.contains('mobile-active');
    header.classList.toggle('mobile-active', willOpen);
    mobileToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavigation.setAttribute('aria-hidden', String(!willOpen));
    header.classList.remove('menu-active');
    productsTrigger.setAttribute('aria-expanded', 'false');
    megaMenu.setAttribute('aria-hidden', 'true');
  });

  scrim.addEventListener('click', closeMenus);
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      productsTrigger.focus();
    }
  });
  [...megaMenu.querySelectorAll('a'), ...mobileNavigation.querySelectorAll('a')].forEach((link) => {
    link.addEventListener('click', closeMenus);
  });

  const setFilter = (category) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    productCards.forEach((card, index) => {
      const isVisible = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !isVisible);
      if (isVisible) card.style.animationDelay = `${Math.min(index % 4, 3) * 45}ms`;
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
  document.querySelectorAll('[data-filter-link]').forEach((link) => {
    link.addEventListener('click', () => setFilter(link.dataset.filterLink));
  });

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const newsletterForm = document.querySelector('.newsletter-form');
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = newsletterForm.querySelector('input').value.trim();
    if (!email) return;
    document.querySelector('.newsletter-status').textContent = 'Cảm ơn bạn — VENUS sẽ sớm gửi lời chào.';
    newsletterForm.reset();
  });
})();
