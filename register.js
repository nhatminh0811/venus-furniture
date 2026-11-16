(() => {
  const form = document.querySelector('#register-form');
  const password = document.querySelector('#register-password');
  const passwordConfirm = document.querySelector('#register-password-confirm');
  const status = document.querySelector('#register-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (password.value !== passwordConfirm.value) {
      passwordConfirm.setCustomValidity('Mật khẩu xác nhận chưa khớp.');
      passwordConfirm.reportValidity();
      return;
    }
    passwordConfirm.setCustomValidity('');
    status.textContent = 'Chưa thể tạo tài khoản .';
  });

  passwordConfirm.addEventListener('input', () => passwordConfirm.setCustomValidity(''));
})();
