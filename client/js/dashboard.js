const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

const loadDashboard = async () => {
  const response = await fetch('http://localhost:3000/api/analytics', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log(data);
  document.getElementById('total-candidates').textContent =
    `Total Candidates: ${data.total.count}`;
  document.getElementById('avg-score').textContent =
    `Average Score: ${parseFloat(data.avgScore.avg).toFixed(2)}`;

  const hired = data.byStatus.find((s) => s.status === 'hired');
  const rejected = data.byStatus.find((s) => s.status === 'rejected');
  document.getElementById('hired-count').textContent =
    `Hired: ${hired ? hired.count : 0}`;
  document.getElementById('rejected-count').textContent =
    `Rejected: ${rejected ? rejected.count : 0}`;
  // Status chart
  const statusLabels = data.byStatus.map((s) => s.status);
  const statusCounts = data.byStatus.map((s) => parseInt(s.count));

  new Chart(document.getElementById('status-chart'), {
    type: 'bar',
    data: {
      labels: statusLabels,
      datasets: [
        {
          label: 'Candidates by Status',
          data: statusCounts,
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
        },
      ],
    },
  });

  // Skills chart
  const skillLabels = data.topSkills.map((s) => s.skill);
  const skillCounts = data.topSkills.map((s) => parseInt(s.count));

  new Chart(document.getElementById('skills-chart'), {
    type: 'doughnut',
    data: {
      labels: skillLabels,
      datasets: [
        {
          label: 'Top Skills',
          data: skillCounts,
          backgroundColor: ['#9C27B0', '#00BCD4', '#FF5722'],
        },
      ],
    },
  });
};

loadDashboard();
