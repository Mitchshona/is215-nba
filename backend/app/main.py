from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
import numpy as np

app = Flask(__name__)

# Load the pre-trained model
model = load('../model/linear_regression_model.joblib')

@app.route('/predict', methods=['POST'])
def predict_salary():
    try:
        # Get the JSON data from the request
        data = request.json
        
        # Create a DataFrame with the required features
        features = pd.DataFrame({
            "Age": [data.get("Age")],
            "GP": [data.get("GP")],
            "TRB": [data.get("TRB")],
            "AST": [data.get("AST")],
            "PTS": [data.get("PTS")],
            "BLK": [data.get("BLK")],
            "TS%": [data.get("TS%")]
        })
        
        # Make prediction
        prediction = model.predict(features)
        
        # Return the prediction as JSON
        return jsonify({
            'predicted_salary': int(prediction[0]),
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)