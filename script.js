(() => {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNavigation = document.querySelector('.mobile-navigation');
  const productGrid = document.querySelector('.product-grid');
  const catalogPrompt = document.querySelector('.catalog-prompt');
  const collectionMore = document.querySelector('.collection-more');
  const productDetail = document.querySelector('.product-detail');
  const productDetailImage = document.querySelector('#product-detail-image');
  const productDetailCategory = document.querySelector('#product-detail-category');
  const productDetailTitle = document.querySelector('#product-detail-title');
  const productDetailDescription = document.querySelector('#product-detail-description');
  const productDetailPrice = document.querySelector('#product-detail-price');
  const productDetailSpecs = document.querySelector('#product-detail-specs');
  const productDetailContact = document.querySelector('#product-detail-contact');
  const productDetailCartAction = document.querySelector('#product-detail-cart-action');
  const filterButtons = [...document.querySelectorAll('.filter-button')];

  const catalog = window.VENUS_CATALOG;
  const productCards = [];
  catalog.forEach(({ category, folder, description, files }) => {
    files.forEach((product) => {
      const filename = typeof product === 'string' ? product : product.filename;
      const name = typeof product === 'string' ? filename.replace(/\.[^.]+$/, '').trim() : product.name;
      const productDetails = typeof product === 'string' ? null : product.details;
      const imagePath = `images/optimized/${folder}/${filename}`;
      const image = document.createElement('img');
      image.dataset.src = imagePath;
      image.alt = name;
      image.loading = 'lazy';
      image.decoding = 'async';
      const imageLink = document.createElement('button');
      imageLink.className = 'product-image';
      imageLink.type = 'button';
      imageLink.setAttribute('aria-label', `Xem chi tiết ${name}`);
      imageLink.dataset.productName = name;
      imageLink.dataset.productCategory = category;
      imageLink.dataset.productImage = imagePath;
      imageLink.dataset.productDescription = productDetails.description;
      imageLink.dataset.productSpecs = JSON.stringify(productDetails.specs);
      imageLink.dataset.productPrice = String(productDetails.price);
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
      const price = document.createElement('span');
      price.className = 'product-price';
      price.textContent = `Giá tham khảo · ${new Intl.NumberFormat('vi-VN').format(productDetails.price)} ₫`;
      descriptionBlock.append(title, subtitle, price);

      const categoryLabel = document.createElement('span');
      categoryLabel.className = 'product-category';
      categoryLabel.textContent = category;
      details.append(descriptionBlock, categoryLabel);

      const card = document.createElement('article');
      card.className = 'product-card';
      card.dataset.category = category;
      card.append(imageLink, details, window.VENUS_CART.createButton({
        name,
        category,
        price: productDetails.price,
        image: imagePath,
      }));
      productGrid.append(card);
      productCards.push(card);
    });
  });

  const shuffledProducts = [...productCards];
  for (let index = shuffledProducts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledProducts[index], shuffledProducts[randomIndex]] = [shuffledProducts[randomIndex], shuffledProducts[index]];
  }
  const featuredProducts = new Set(shuffledProducts.slice(0, 6));

  productGrid.addEventListener('click', (event) => {
    const productButton = event.target.closest('.product-image');
    if (!productButton) return;

    const { productName, productCategory, productImage, productDescription, productSpecs, productPrice } = productButton.dataset;
    productDetailImage.src = productImage;
    productDetailImage.alt = productName;
    productDetailCategory.textContent = productCategory;
    productDetailTitle.textContent = productName;
    productDetailDescription.textContent = productDescription;
    productDetailPrice.textContent = `Giá tham khảo · ${new Intl.NumberFormat('vi-VN').format(Number(productPrice))} ₫`;
    const specifications = JSON.parse(productSpecs);
    productDetailSpecs.replaceChildren(...specifications.flatMap(([label, value]) => {
      const term = document.createElement('dt');
      term.textContent = label;
      const detail = document.createElement('dd');
      detail.textContent = value;
      return [term, detail];
    }));
    productDetailCartAction.replaceChildren(window.VENUS_CART.createButton({
      name: productName,
      category: productCategory,
      price: Number(productPrice),
      image: productImage,
    }));
    productDetailContact.href = `mailto:hoaiminh@venus.vn?subject=${encodeURIComponent(`Tư vấn sản phẩm ${productName}`)}`;
    document.querySelector('#product-detail-full').href = `product.html?${new URLSearchParams({ category: productCategory, name: productName })}`;
    productDetail.showModal();
  });

  productDetail.querySelector('.product-detail-close').addEventListener('click', () => productDetail.close());
  productDetail.addEventListener('click', (event) => {
    if (event.target === productDetail) productDetail.close();
  });
  productDetail.addEventListener('close', () => {
    productDetailImage.removeAttribute('src');
    productDetailCartAction.replaceChildren();
  });

  const closeMenus = () => {
    header.classList.remove('mobile-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNavigation.setAttribute('aria-hidden', 'true');
  };
  mobileToggle.addEventListener('click', () => {
    const willOpen = !header.classList.contains('mobile-active');
    header.classList.toggle('mobile-active', willOpen);
    mobileToggle.setAttribute('aria-expanded', String(willOpen));
    mobileNavigation.setAttribute('aria-hidden', String(!willOpen));
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) closeMenus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      mobileToggle.focus();
    }
  });
  mobileNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenus);
  });

  const setFilter = (category) => {
    const hasSelection = Boolean(category);
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    productCards.forEach((card, index) => {
      const isVisible = category === 'featured'
        ? featuredProducts.has(card)
        : card.dataset.category === category;
      card.classList.toggle('is-hidden', !isVisible);
      const image = card.querySelector('img');
      if (isVisible && image.dataset.src) {
        image.src = image.dataset.src;
        delete image.dataset.src;
      }
      if (isVisible) card.style.animationDelay = `${Math.min(index % 4, 3) * 45}ms`;
    });
    catalogPrompt.hidden = hasSelection;
    collectionMore.hidden = !hasSelection;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => setFilter(button.dataset.filter));
  });
  setFilter('featured');

  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

})();
