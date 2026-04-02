const db = require('../config/db');

const getStats = async (req, res) => {
  try {
    // Query 1 — total candidates
    const total = await db.query('SELECT COUNT(*) FROM candidates');

    // Query 2 — candidates by status
    const byStatus = await db.query(
      'SELECT status, COUNT(*) FROM candidates GROUP BY status',
    );

    // Query 3 — average score
    const avgScore = await db.query('SELECT AVG(score) FROM candidates');

    // Query 4 — top skills
    const topSkills = await db.query(
      'SELECT skill, COUNT(*) FROM candidate_skills GROUP BY skill ORDER BY COUNT(*) DESC',
    );

    // send back all stats
    return res.status(200).json({
      total: total.rows[0],
      byStatus: byStatus.rows,
      avgScore: avgScore.rows[0],
      topSkills: topSkills.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getStats };
