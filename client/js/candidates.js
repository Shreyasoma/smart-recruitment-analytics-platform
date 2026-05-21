const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

// ===== LOAD ALL CANDIDATES =====

const loadCandidates = async () => {
  const response = await fetch(`${API_BASE_URL}/api/candidates`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  const tbody = document.getElementById('candidates-table');
  tbody.innerHTML = '';
  data.candidate.forEach((candidate) => {
    tbody.innerHTML += `
      <tr id="row-${candidate.id}">
        <td>${candidate.name}</td>
        <td>${candidate.email}</td>
        <td>${candidate.score}</td>
        <td><span class="badge badge-${candidate.status}">${candidate.status}</span></td>
        <td id="predict-cell-${candidate.id}">—</td>
        <td style="display: flex; gap: 8px;">
          <button class="btn-edit" onclick="openEditModal(${candidate.id}, '${candidate.name}', '${candidate.email}', '${candidate.score}', '${candidate.status}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteCandidate(${candidate.id})">Delete</button>
          <button class="btn-predict" onclick="predictCandidate(${candidate.id})">Predict</button>
        </td>
      </tr>`;
  });
};

// ===== PREDICT =====

const predictCandidate = async (id) => {
  const cell = document.getElementById(`predict-cell-${id}`);
  cell.textContent = 'Loading...';

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/candidates/${id}/predict`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json();

    if (response.ok) {
      const prob = data.hire_probability;
      const color = prob >= 70 ? '#a78bfa' : prob >= 40 ? '#f59e0b' : '#f87171';
      cell.innerHTML = `<span style="color: ${color}; font-weight: 600;">${prob}%</span>`;
    } else {
      cell.textContent = data.message || 'Error';
    }
  } catch (error) {
    cell.textContent = 'Service unavailable';
  }
};

// ===== ADD CANDIDATE =====

document.getElementById('add-candidate').onclick = async function () {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const score = document.getElementById('score').value;
  const status = document.getElementById('status').value;
  const skills = document.getElementById('skills').value;

  if (!name || !email || !score || !status || !skills) {
    alert('All fields are required');
    return;
  }

  if (score < 0 || score > 100) {
    alert('Score must be between 0 and 100');
    return;
  }

  const skillsArray = skills.split(',').map((s) => s.trim());

  await fetch(`${API_BASE_URL}/api/candidates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, score, status, skills: skillsArray }),
  });

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('score').value = '';
  document.getElementById('skills').value = '';

  loadCandidates();
};

// ===== DELETE CANDIDATE =====

const deleteCandidate = async (id) => {
  if (!confirm('Are you sure you want to delete this candidate?')) return;
  await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  loadCandidates();
};

// ===== EDIT MODAL =====

const openEditModal = (id, name, email, score, status) => {
  document.getElementById('edit-id').value = id;
  document.getElementById('edit-name').value = name;
  document.getElementById('edit-email').value = email;
  document.getElementById('edit-score').value = score;
  document.getElementById('edit-status').value = status;
  document.getElementById('edit-modal').style.display = 'flex';
};

document.getElementById('close-modal').onclick = () => {
  document.getElementById('edit-modal').style.display = 'none';
};

document.getElementById('cancel-modal').onclick = () => {
  document.getElementById('edit-modal').style.display = 'none';
};

document.getElementById('edit-modal').onclick = function (e) {
  if (e.target === this) this.style.display = 'none';
};

// ===== SAVE EDIT =====

document.getElementById('save-edit').onclick = async function () {
  const id = document.getElementById('edit-id').value;
  const name = document.getElementById('edit-name').value;
  const email = document.getElementById('edit-email').value;
  const score = document.getElementById('edit-score').value;
  const status = document.getElementById('edit-status').value;

  if (!name || !email || !score || !status) {
    alert('All fields are required');
    return;
  }

  if (score < 0 || score > 100) {
    alert('Score must be between 0 and 100');
    return;
  }

  await fetch(`${API_BASE_URL}/api/candidates/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, score, status }),
  });

  document.getElementById('edit-modal').style.display = 'none';
  loadCandidates();
};

// ===== INIT =====
// ===== INIT =====
// Wake up analytics service on page load
fetch('https://smart-recruitment-analytics.onrender.com/health').catch(
  () => {},
);

loadCandidates();
