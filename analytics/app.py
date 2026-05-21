from flask import Flask, request, jsonify
import psycopg2
import pandas as pd
from sklearn.linear_model import LogisticRegression
import numpy as np

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        database="smart_recruitment_db",
        user="postgres",
        password="Shreya@1410",
        port=5433
    )
    return conn

def train_model():
    conn = get_db_connection()
    query = """
        SELECT score, status 
        FROM candidates 
        WHERE status IN ('hired', 'rejected')
    """
    df = pd.read_sql(query, conn)
    conn.close()
    return df

@app.route('/health', methods=['GET'])
def health():
    try:
        conn = get_db_connection()
        conn.close()
        return {'status': 'analytics service running', 'db': 'connected'}, 200
    except Exception as e:
        return {'status': 'analytics service running', 'db': str(e)}, 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        score = data.get('score')

        if score is None:
            return jsonify({'error': 'score is required'}), 400

        # Force score to float
        score = float(score)

        df = train_model()

        if len(df) < 2:
            return jsonify({'error': 'Not enough data to make a prediction. Add more hired/rejected candidates first.'}), 400

        if df['status'].nunique() < 2:
            return jsonify({'error': 'Need both hired and rejected candidates in the data to train the model.'}), 400

        # Force score column to numeric, drop any bad rows
        df['score'] = pd.to_numeric(df['score'], errors='coerce')
        df = df.dropna(subset=['score'])

        X = df[['score']].values.astype(float)
        y = (df['status'] == 'hired').astype(int).values

        model = LogisticRegression()
        model.fit(X, y)

        score_input = np.array([[score]])
        probability = model.predict_proba(score_input)[0][1]
        prediction = model.predict(score_input)[0]

        return jsonify({
            'score': score,
            'hire_probability': round(float(probability) * 100, 2),
            'prediction': 'hired' if prediction == 1 else 'rejected'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)