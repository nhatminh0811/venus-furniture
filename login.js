(() => {
  const form = document.querySelector('#login-form');
  const toggle = document.querySelector('#toggle-password');
  const password = document.querySelector('#login-password');
  const status = document.querySelector('#login-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = 'Đăng nhập chưa khả dụng vì website chưa có tài khoản.';
  });

  toggle.addEventListener('click', () => {
    const showPassword = password.type === 'password';
    password.type = showPassword ? 'text' : 'password';
    toggle.textContent = showPassword ? 'Ẩn' : 'Hiện';
    toggle.setAttribute('aria-label', showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
    toggle.setAttribute('aria-pressed', String(showPassword));
  });
})();
