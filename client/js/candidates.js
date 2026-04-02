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
        <td>${candidate.status}</td>
        <td>${candidate.id}</td>
        <td><button onclick="deleteCandidate(${candidate.id})">Delete</button></td>
      </tr>`;
  });
};

document.getElementById('add-candidate').onclick = async function () {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const score = document.getElementById('score').value;
  const status = document.getElementById('status').value;
  const skills = document.getElementById('skills').value;
  const skillsArray = skills.split(',').map((s) => s.trim());
  await fetch('http://localhost:3000/api/candidates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, score, status, skills: skillsArray }),
  });
  loadCandidates();
};

const deleteCandidate = async (id) => {
  await fetch(`http://localhost:3000/api/candidates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  loadCandidates();
};

loadCandidates();
