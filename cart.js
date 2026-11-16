(() => {
  const storageKey = 'venus-shopping-cart';
  const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price)} ₫`;
  const status = document.createElement('p');
  status.className = 'cart-live-message';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  document.body.append(status);

  const announce = (message) => {
    status.textContent = message;
    status.classList.add('is-visible');
    window.clearTimeout(announce.timeout);
    announce.timeout = window.setTimeout(() => status.classList.remove('is-visible'), 4000);
  };

  const readItems = () => {
    let stored;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {
      announce('Không thể truy cập giỏ hàng trên trình duyệt này.');
      return [];
    }
    if (!stored) return [];

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch {
      announce('Dữ liệu giỏ hàng không đọc được. Vui lòng xóa dữ liệu trang và thêm lại sản phẩm.');
      return [];
    }
    if (!Array.isArray(parsed)) {
      announce('Dữ liệu giỏ hàng không hợp lệ.');
      return [];
    }
    return parsed.filter((item) =>
      item
      && typeof item.key === 'string'
      && typeof item.name === 'string'
      && typeof item.category === 'string'
      && typeof item.image === 'string'
      && Number.isFinite(item.price)
      && Number.isInteger(item.quantity)
      && item.quantity > 0,
    );
  };

  const saveItems = (items) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      announce('Không thể lưu giỏ hàng. Hãy kiểm tra cài đặt lưu trữ của trình duyệt.');
      return false;
    }
    window.dispatchEvent(new CustomEvent('venus-cart-updated'));
    return true;
  };

  const updateCount = () => {
    const count = api.getItems().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('[data-cart-count]').forEach((element) => {
      element.textContent = String(count);
    });
    document.querySelectorAll('.cart-header-link').forEach((link) => {
      link.setAttribute('aria-label', `Giỏ hàng, ${count} sản phẩm`);
    });
  };

  const api = {
    formatPrice,
    getItems: readItems,
    createButton(product) {
      const button = document.createElement('button');
      button.className = 'cart-add-button';
      button.type = 'button';
      button.dataset.cartProduct = JSON.stringify({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
      });
      button.textContent = 'Thêm vào giỏ';
      button.setAttribute('aria-label', `Thêm ${product.name} vào giỏ hàng`);
      return button;
    },
    add(product) {
      if (!product || !product.name || !product.category || !product.image
        || !Number.isFinite(product.price) || product.price <= 0) {
        announce('Không thể thêm sản phẩm này vào giỏ hàng.');
        return false;
      }
      const items = readItems();
      const key = `${product.category}::${product.name}`;
      const existing = items.find((item) => item.key === key);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, 99);
      } else {
        items.push({
          key,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }
      if (!saveItems(items)) return false;
      announce(`Đã thêm ${product.name} vào giỏ hàng.`);
      return true;
    },
    setQuantity(key, quantity) {
      const items = readItems();
      const item = items.find((entry) => entry.key === key);
      if (!item) return;
      if (!Number.isInteger(quantity) || quantity < 1) {
        api.remove(key);
        return;
      }
      item.quantity = Math.min(quantity, 99);
      saveItems(items);
    },
    remove(key) {
      saveItems(readItems().filter((item) => item.key !== key));
    },
    clear() {
      saveItems([]);
    },
  };
  window.VENUS_CART = api;

  const desktopNav = document.querySelector('.nav-right, .page-header nav, .design-header, .about-header nav');
  if (desktopNav) {
    const link = document.createElement('a');
    link.className = 'cart-header-link';
    link.href = 'cart.html';
    link.setAttribute('aria-label', 'Giỏ hàng');
    link.append(document.createTextNode('Giỏ hàng ('));
    const count = document.createElement('span');
    count.dataset.cartCount = '';
    count.textContent = '0';
    link.append(count, document.createTextNode(')'));
    desktopNav.append(link);
  }
  const mobileNav = document.querySelector('.mobile-navigation');
  if (mobileNav) {
    const link = document.createElement('a');
    link.className = 'cart-header-link';
    link.href = 'cart.html';
    link.append(document.createTextNode('Giỏ hàng ('));
    const count = document.createElement('span');
    count.dataset.cartCount = '';
    count.textContent = '0';
    link.append(count, document.createTextNode(')'));
    mobileNav.append(link);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.cart-add-button');
    if (!button) return;
    let product;
    try {
      product = JSON.parse(button.dataset.cartProduct);
    } catch {
      announce('Không thể đọc thông tin sản phẩm để thêm vào giỏ.');
      return;
    }
    api.add(product);
  });
  window.addEventListener('venus-cart-updated', updateCount);
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey) updateCount();
  });
  updateCount();
})();
