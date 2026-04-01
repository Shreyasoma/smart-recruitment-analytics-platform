document.getElementById('login-btn').onclick = async function () {
  // Step 1 — get email and password
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // Step 2 — send POST request to /api/auth/login
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  // Step 3 — if success, store token, redirect
  if (response.ok) {
    // store token and redirect
    localStorage.setItem('token', data.token);
    window.location.href = './html/dashboard.html';
  } else {
    // Step 4 — if error, show message
    document.getElementById('error-message').textContent = data.message;
  }
};
