// ===== TOGGLE BETWEEN LOGIN AND REGISTER =====

document.getElementById('go-to-register').onclick = function () {
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('form-title').textContent = 'Create account';
  document.getElementById('form-subtitle').textContent =
    'Join your recruitment platform';
  document.getElementById('error-message').textContent = '';
};

document.getElementById('go-to-login').onclick = function () {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('form-title').textContent = 'Welcome back';
  document.getElementById('form-subtitle').textContent =
    'Sign in to your recruitment dashboard';
  document.getElementById('error-message').textContent = '';
};

// ===== LOGIN =====

document.getElementById('login-btn').onclick = async function () {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showError('Email and password are required');
    return;
  }

  const response = await fetch('${API_BASE_URL}/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = './html/dashboard.html';
  } else {
    showError(data.message);
  }
};

// ===== REGISTER =====

document.getElementById('register-btn').onclick = async function () {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (!name || !email || !password) {
    showError('All fields are required');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters');
    return;
  }

  const response = await fetch('${API_BASE_URL}/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('token', data.token);
    window.location.href = './html/dashboard.html';
  } else {
    showError(data.message);
  }
};

// ===== HELPER =====

function showError(message) {
  const el = document.getElementById('error-message');
  el.textContent = message;
}
