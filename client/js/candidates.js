const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

const loadCandidates = async () => {
  const response = await fetch('http://localhost:3000/api/candidates', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  const tbody = document.getElementById('candidates-table');
  tbody.innerHTML = '';
  data.candidate.forEach((candidate) => {
    tbody.innerHTML += `
      <tr>
        <td>${candidate.name}</td>
        <td>${candidate.email}</td>
        <td>${candidate.score}</td>
        <td><span class="badge badge-${candidate.status}">${candidate.status}</span></td>
        <td>
          <button class="btn btn-danger" onclick="deleteCandidate(${candidate.id})">Delete</button>
        </td>
      </tr>`;
  });
};

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

  await fetch('http://localhost:3000/api/candidates', {
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

const deleteCandidate = async (id) => {
  if (!confirm('Are you sure you want to delete this candidate?')) return;
  await fetch(`http://localhost:3000/api/candidates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  loadCandidates();
};

loadCandidates();
