const db = require('../config/db');
const axios = require('axios');

const createCandidate = async (req, res) => {
  try {
    // Step 1 — get data from req.body
    const { name, email, score, status, skills } = req.body;
    const recruiter_id = req.user.id;
    if (!name || !email || !score || !status || !skills) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (score < 0 || score > 100) {
      return res
        .status(400)
        .json({ message: 'Score must be between 0 and 100' });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res
        .status(400)
        .json({ message: 'At least one skill is required' });
    }
    // Step 2 — insert into candidates table
    const newCandidate = await db.query(
      'INSERT INTO candidates (name, email, score, status, recruiter_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, score, status, recruiter_id],
    );
    // Step 3 — insert skills into candidate_skills
    for (const skill of skills) {
      await db.query(
        'INSERT INTO candidate_skills (candidate_id, skill) VALUES ($1, $2)',
        [newCandidate.rows[0].id, skill],
      );
    }
    // Step 4 — send back response
    return res.status(201).json({
      message: 'Candidate added successfully',
      candidate: newCandidate.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const role = req.user.role;
    const id = req.user.id;
    let getCandidate;

    if (role === 'recruiter') {
      getCandidate = await db.query(
        'SELECT * FROM candidates WHERE recruiter_id = $1',
        [id],
      );
    } else {
      getCandidate = await db.query('SELECT * FROM candidates');
    }
    return res.status(200).json({
      candidate: getCandidate.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params;
    const getCandidate = await db.query(
      'SELECT * FROM candidates WHERE id = $1',
      [id],
    );
    if (getCandidate.rows.length === 0)
      return res.status(404).json({ message: 'Candidate not found' });
    return res.status(200).json({
      candidate: getCandidate.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, score, status } = req.body;
    const putCandidate = await db.query(
      'UPDATE candidates SET name=$1, email=$2, score=$3, status=$4 WHERE id=$5 RETURNING *',
      [name, email, score, status, id],
    );
    if (putCandidate.rows.length === 0)
      return res.status(404).json({ message: 'Candidate not found' });
    return res.status(200).json({
      candidate: putCandidate.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const delCandidate = await db.query(
      'DELETE FROM candidates WHERE id=$1 RETURNING *',
      [id],
    );
    if (delCandidate.rows.length === 0)
      return res.status(404).json({ message: 'Candidate not found' });
    return res.status(200).json({
      message: 'Candidate deleted successfully',
      candidate: delCandidate.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const predictCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    // Get candidate's score from DB
    const result = await db.query(
      'SELECT score FROM candidates WHERE id = $1',
      [id],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: 'Candidate not found' });

    const score = result.rows[0].score;
    console.log('FLASK_URL:', process.env.FLASK_URL);
    // Call Flask analytics service
    const flaskResponse = await axios.post(`${process.env.FLASK_URL}/predict`, {
      score: score,
    });

    return res.status(200).json({
      candidate_id: id,
      score: score,
      hire_probability: flaskResponse.data.hire_probability,
      prediction: flaskResponse.data.prediction,
    });
  } catch (error) {
    console.log('Predict error:', error.message);
    if (error.response) {
      console.log('Flask error response:', error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      return res
        .status(503)
        .json({ message: 'Analytics service is unavailable' });
    }
    return res
      .status(500)
      .json({ message: error.response?.data?.error || error.message });
  }
};

module.exports = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  predictCandidate,
};
