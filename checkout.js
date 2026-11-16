(() => {
  const cartItemsElement = document.querySelector('#cart-items');
  const emptyCart = document.querySelector('#empty-cart');
  const checkoutForm = document.querySelector('#checkout-form');
  const formSection = document.querySelector('.checkout-form-section');
  const countElement = document.querySelector('#cart-item-count');
  const subtotalElement = document.querySelector('#cart-subtotal');
  const status = document.querySelector('#checkout-status');
  const formatPrice = window.VENUS_CART.formatPrice;

  const renderCart = () => {
    const items = window.VENUS_CART.getItems();
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    cartItemsElement.replaceChildren();
    countElement.textContent = `${itemCount} sản phẩm`;
    subtotalElement.textContent = formatPrice(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
    emptyCart.hidden = items.length > 0;
    formSection.hidden = items.length === 0;
    items.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'cart-item';
      const image = document.createElement('img');
      image.src = item.image;
      image.alt = item.name;
      image.loading = 'lazy';
      const detail = document.createElement('div');
      detail.className = 'cart-item-detail';
      const name = document.createElement('h3');
      name.textContent = item.name;
      const category = document.createElement('p');
      category.textContent = item.category;
      const price = document.createElement('p');
      price.className = 'cart-item-price';
      price.textContent = `Giá tham khảo · ${formatPrice(item.price)}`;
      const controls = document.createElement('div');
      controls.className = 'cart-item-controls';
      const quantityLabel = document.createElement('label');
      quantityLabel.textContent = 'Số lượng';
      const quantity = document.createElement('input');
      quantity.type = 'number';
      quantity.min = '1';
      quantity.max = '99';
      quantity.value = String(item.quantity);
      quantity.dataset.cartQuantity = item.key;
      quantity.setAttribute('aria-label', `Số lượng ${item.name}`);
      quantityLabel.append(quantity);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'cart-remove-button';
      remove.dataset.cartRemove = item.key;
      remove.textContent = 'Xóa';
      controls.append(quantityLabel, remove);
      detail.append(name, category, price, controls);
      row.append(image, detail);
      cartItemsElement.append(row);
    });
  };

  cartItemsElement.addEventListener('change', (event) => {
    const input = event.target.closest('[data-cart-quantity]');
    if (!input) return;
    window.VENUS_CART.setQuantity(input.dataset.cartQuantity, Number(input.value));
    renderCart();
  });
  cartItemsElement.addEventListener('click', (event) => {
    const button = event.target.closest('[data-cart-remove]');
    if (!button) return;
    window.VENUS_CART.remove(button.dataset.cartRemove);
    renderCart();
  });
  window.addEventListener('venus-cart-updated', renderCart);
  window.addEventListener('storage', renderCart);

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const items = window.VENUS_CART.getItems();
    if (!items.length) {
      status.textContent = 'Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.';
      return;
    }
    if (!checkoutForm.reportValidity()) return;

    const fields = new FormData(checkoutForm);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lines = [
      'YÊU CẦU ĐẶT HÀNG VENUS',
      '',
      ...items.map((item) => `- ${item.name} (${item.category}) × ${item.quantity}: ${formatPrice(item.price * item.quantity)}`),
      '',
      `Tạm tính: ${formatPrice(total)}`,
      'Phí giao hàng: Chờ VENUS xác nhận',
      '',
      `Họ tên: ${fields.get('name')}`,
      `Điện thoại: ${fields.get('phone')}`,
      `Email: ${fields.get('email')}`,
      `Địa chỉ: ${fields.get('address')}`,
      `Thanh toán dự kiến: ${fields.get('payment')}`,
      `Ghi chú: ${fields.get('note') || 'Không có'}`,
      '',
      'Giá trên website là giá tham khảo. Vui lòng xác nhận giá bán chính thức.',
    ];
    const subject = encodeURIComponent('Yêu cầu đặt hàng từ website VENUS');
    const body = encodeURIComponent(lines.join('\n'));
    status.textContent = 'Đang mở ứng dụng email. Đơn hàng chỉ được gửi sau khi bạn kiểm tra và bấm Gửi trong email.';
    window.location.href = `mailto:hoaiminh@venus.vn?subject=${subject}&body=${body}`;
  });

  renderCart();
})();
