const token = localStorage.getItem('token');

if (!token) window.location.href = '../index.html';

const loadDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/api/analytics`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();

  // stat cards
  document.getElementById('total-candidates').textContent = data.total.count;
  document.getElementById('avg-score').textContent = parseFloat(
    data.avgScore.avg,
  ).toFixed(1);

  const hired = data.byStatus.find((s) => s.status === 'hired');
  const rejected = data.byStatus.find((s) => s.status === 'rejected');
  document.getElementById('hired-count').textContent = hired ? hired.count : 0;
  document.getElementById('rejected-count').textContent = rejected
    ? rejected.count
    : 0;

  // status chart
  const statusLabels = data.byStatus.map((s) => s.status);
  const statusCounts = data.byStatus.map((s) => parseInt(s.count));

  new Chart(document.getElementById('status-chart'), {
    type: 'bar',
    data: {
      labels: statusLabels,
      datasets: [
        {
          label: 'Candidates',
          data: statusCounts,
          backgroundColor: ['#6C63FF', '#FF6584', '#43E97B', '#FCD34D'],
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: '#A7A9BE' },
          grid: { color: 'rgba(108, 99, 255, 0.1)' },
        },
        y: {
          ticks: { color: '#A7A9BE' },
          grid: { color: 'rgba(108, 99, 255, 0.1)' },
          beginAtZero: true,
        },
      },
    },
  });

  // skills chart
  const skillLabels = data.topSkills.map((s) => s.skill);
  const skillCounts = data.topSkills.map((s) => parseInt(s.count));

  new Chart(document.getElementById('skills-chart'), {
    type: 'doughnut',
    data: {
      labels: skillLabels,
      datasets: [
        {
          data: skillCounts,
          backgroundColor: [
            '#6C63FF',
            '#FF6584',
            '#43E97B',
            '#FCD34D',
            '#60A5FA',
          ],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#A7A9BE', padding: 20, usePointStyle: true },
        },
      },
    },
  });
};

loadDashboard();
