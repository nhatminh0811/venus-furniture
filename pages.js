(() => {
  const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price)} ₫`;
  const products = window.VENUS_CATALOG.flatMap(({ category, folder, description, files }) =>
    files.map((item) => {
      const filename = typeof item === 'string' ? item : item.filename;
      const name = typeof item === 'string' ? filename.replace(/\.[^.]+$/, '').trim() : item.name;
      return {
        category,
        description,
        name,
        details: typeof item === 'string' ? null : item.details,
        price: typeof item === 'string' ? null : item.details.price,
        image: `images/optimized/${folder}/${filename}`,
      };
    }),
  );
  const productUrl = (product) =>
    `product.html?${new URLSearchParams({ category: product.category, name: product.name })}`;
  const createProductCard = (product) => {
    const card = document.createElement('article');
    card.className = 'page-product-card';
    const link = document.createElement('a');
    link.href = productUrl(product);
    link.setAttribute('aria-label', `Xem ${product.name}`);
    const image = document.createElement('img');
    image.src = product.image;
    image.alt = product.name;
    image.loading = 'lazy';
    image.decoding = 'async';
    const name = document.createElement('h2');
    name.textContent = product.name;
    const category = document.createElement('span');
    category.textContent = product.category;
    const price = document.createElement('p');
    price.className = 'page-product-price';
    price.textContent = `Giá tham khảo · ${formatPrice(product.price)}`;
    link.append(image, name, category, price);
    card.append(link);
    return card;
  };

  const catalogGrid = document.querySelector('#catalog-grid');
  if (catalogGrid) {
    const search = document.querySelector('#product-search');
    const category = document.querySelector('#product-category');
    const sort = document.querySelector('#product-sort');
    const count = document.querySelector('#results-count');
    const empty = document.querySelector('#empty-state');
    [...new Set(products.map((product) => product.category))].forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      category.append(option);
    });
    const initialCategory = new URLSearchParams(location.search).get('category');
    if ([...category.options].some((option) => option.value === initialCategory)) category.value = initialCategory;
    const renderCatalog = () => {
      const query = search.value.trim().toLocaleLowerCase('vi');
      const matching = products.filter((product) =>
        (!category.value || product.category === category.value)
        && (!query || `${product.name} ${product.category}`.toLocaleLowerCase('vi').includes(query)),
      );
      if (sort.value === 'name') matching.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      if (sort.value === 'category') matching.sort((a, b) => a.category.localeCompare(b.category, 'vi') || a.name.localeCompare(b.name, 'vi'));
      catalogGrid.replaceChildren(...matching.map(createProductCard));
      count.textContent = `${matching.length} sản phẩm`;
      empty.hidden = matching.length > 0;
    };
    [search, category, sort].forEach((control) => control.addEventListener('input', renderCatalog));
    renderCatalog();
  }

  const roomGrid = document.querySelector('#room-grid');
  if (roomGrid) {
    const rooms = {
      living: {
        title: 'Phòng khách',
        subtitle: 'Không gian kết nối và thư giãn, với những món đồ tạo nên dấu ấn riêng.',
        image: 'images/optimized/room-living.jpg',
        categories: ['Sofas', 'Ghế', 'Thảm', 'Bàn', 'Tủ kệ', 'Đèn', 'Decor'],
      },
      dining: {
        title: 'Phòng ăn',
        subtitle: 'Gợi ý bàn ghế và điểm nhấn cho những khoảnh khắc quây quần.',
        image: 'images/optimized/room-dining.jpg',
        categories: ['Bàn', 'Ghế', 'Đèn', 'Decor', 'Tủ kệ'],
      },
      bedroom: {
        title: 'Phòng ngủ',
        subtitle: 'Tạo nên không gian nghỉ ngơi nhẹ nhàng từ những chi tiết được tuyển chọn.',
        image: 'images/optimized/room-bedroom.jpg',
        categories: ['Giường', 'Thảm', 'Đèn', 'Decor', 'Tủ kệ'],
      },
    };
    const room = rooms[new URLSearchParams(location.search).get('room')] || rooms.living;
    document.title = `${room.title} — VENUS`;
    const intro = document.querySelector('#room-content');
    const image = document.createElement('img');
    image.className = 'room-hero-image';
    image.src = room.image;
    image.alt = `Gợi ý không gian ${room.title.toLocaleLowerCase('vi')}`;
    const eyebrow = document.createElement('p');
    eyebrow.className = 'page-eyebrow';
    eyebrow.textContent = 'SHOP BY ROOM';
    const title = document.createElement('h1');
    title.textContent = room.title;
    const description = document.createElement('p');
    description.className = 'page-lead';
    description.textContent = room.subtitle;
    intro.append(image, eyebrow, title, description);
    const roomProducts = products.filter((product) => room.categories.includes(product.category));
    roomGrid.replaceChildren(...roomProducts.map(createProductCard));
  }

  const productContent = document.querySelector('#product-content');
  if (productContent) {
    const params = new URLSearchParams(location.search);
    const product = products.find((item) => item.category === params.get('category') && item.name === params.get('name'));
    if (!product) {
      document.querySelector('#product-not-found').hidden = false;
      productContent.hidden = true;
    } else {
      document.title = `${product.name} — VENUS`;
      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.name;
      const visual = document.createElement('div');
      visual.className = 'product-detail-visual';
      visual.append(image);
      const copy = document.createElement('div');
      copy.className = 'product-detail-copy-page';
      const eyebrow = document.createElement('p');
      eyebrow.className = 'page-eyebrow';
      eyebrow.textContent = product.category;
      const title = document.createElement('h1');
      title.textContent = product.name;
      const price = document.createElement('p');
      price.className = 'product-price-detail';
      price.textContent = `Giá tham khảo · ${formatPrice(product.price)}`;
      const description = document.createElement('p');
      description.textContent = product.details.description;
      const specs = document.createElement('dl');
      specs.className = 'product-spec-list';
      product.details.specs.forEach(([label, value]) => {
        const term = document.createElement('dt');
        term.textContent = label;
        const detail = document.createElement('dd');
        detail.textContent = value;
        specs.append(term, detail);
      });
      const contact = document.createElement('a');
      contact.className = 'page-button';
      contact.href = `mailto:hoaiminh@venus.vn?subject=${encodeURIComponent(`Tư vấn sản phẩm ${product.name}`)}`;
      contact.textContent = 'Liên hệ nhận tư vấn & báo giá ↗';
      const note = document.createElement('p');
      note.className = 'product-data-note';
      note.textContent = 'Giá, mô tả và thông số chỉ mang tính tham khảo. Vui lòng liên hệ để xác nhận giá bán chính thức.';
      copy.append(eyebrow, title, price, description, specs, contact, note);
      productContent.append(visual, copy);
    }
  }
})();
