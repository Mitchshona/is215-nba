from flask import Flask, request, jsonify
import pandas as pd
from joblib import load
import numpy as np
import os

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

@app.route('/analyze-players', methods=['GET'])
def analyze_players():
    try:
        # Read the CSV file
        csv_path = 'nba_stats_24-25_new.csv'
        
        # Check if file exists
        if not os.path.exists(csv_path):
            return jsonify({
                'error': f'CSV file not found at {csv_path}',
                'status': 'error'
            }), 404
            
        df = pd.read_csv(csv_path)
        
        # Check for required columns
        required_features = ["Age", "GP", "TRB", "AST", "PTS", "BLK", "TS%"]
        missing_columns = [col for col in required_features + ["Salary"] if col not in df.columns]
        
        if missing_columns:
            return jsonify({
                'error': f'Missing required columns: {", ".join(missing_columns)}',
                'status': 'error'
            }), 400
            
        # Convert columns to numeric
        for col in required_features + ["Salary"]:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
        # Drop rows with missing values
        original_count = len(df)
        df = df.dropna(subset=required_features + ["Salary"])
        dropped_count = original_count - len(df)
        
        # Extract features for prediction
        features = df[required_features]
        
        # Make predictions for all players
        predictions = model.predict(features)
        
        # Add predictions to the DataFrame
        df['Predicted_Salary'] = predictions.astype(int)
        
        # Determine if players are undervalued, overvalued, or fairly valued
        # Apply the updated valuation logic
        def get_valuation(row):
            diff = abs(row['Predicted_Salary'] - row['Salary'])
            if diff <= 5000000:  # Within $5M range
                return 'Fair'
            elif row['Predicted_Salary'] > row['Salary']:
                return 'Undervalued'
            else:
                return 'Overvalued'
        
        # Apply the function to create the Valuation column
        df['Valuation'] = df.apply(get_valuation, axis=1)
        
        # Save the updated DataFrame back to CSV
        df.to_csv(csv_path, index=False)
        
        return jsonify({
            'status': 'success',
            'message': 'Analysis complete and CSV updated'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/allplayers', methods=['GET'])
def get_all_players():
    try:
        # Read the CSV file
        csv_path = 'nba_stats_24-25_new.csv'
        
        # Check if file exists
        if not os.path.exists(csv_path):
            return jsonify({
                'error': f'CSV file not found at {csv_path}',
                'status': 'error'
            }), 404
            
        df = pd.read_csv(csv_path)
        
        # Convert DataFrame to list of dictionaries for JSON response
        players_data = df.to_dict(orient='records')
        
        return jsonify({
            'status': 'success',
            'data': players_data,
            'count': len(players_data)
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400
    
def run_analysis():
    """Function to run analysis outside of Flask context"""
    try:
        # Similar code as analyze_players but doesn't use jsonify
        csv_path = 'nba_stats_24-25_new.csv'
        
        if not os.path.exists(csv_path):
            print(f"Error: CSV file not found at {csv_path}")
            return False
            
        df = pd.read_csv(csv_path)
        
        required_features = ["Age", "GP", "TRB", "AST", "PTS", "BLK", "TS%"]
        missing_columns = [col for col in required_features + ["Salary"] if col not in df.columns]
        
        if missing_columns:
            print(f"Error: Missing required columns: {', '.join(missing_columns)}")
            return False
            
        for col in required_features + ["Salary"]:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
        original_count = len(df)
        df = df.dropna(subset=required_features + ["Salary"])
        dropped_count = original_count - len(df)
        
        features = df[required_features]
        predictions = model.predict(features)
        df['Predicted_Salary'] = predictions.astype(int)
        
        # Apply the updated valuation logic
        def get_valuation_data(row):
            diff = abs(row['Predicted_Salary'] - row['Salary'])
            
            if diff <= 5000000:  # Within $5M range
                valuation = 'Fair'
            elif row['Predicted_Salary'] > row['Salary']:
                valuation = 'Undervalued'
            else:
                valuation = 'Overvalued'
            
            # Return as a pandas Series with named fields
            return pd.Series({'Diff': diff, 'Valuation': valuation})

        # Apply the function to create both columns at once
        df[['Diff', 'Valuation']] = df.apply(get_valuation_data, axis=1)
        
        df.to_csv(csv_path, index=False)
        
        print("Analysis complete and CSV updated")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == '__main__':
    # You can either run the analysis directly or start the Flask app
    # Uncomment the desired option
    
    # Option 1: Run analysis directly
    # run_analysis()
    
    # Option 2: Run the Flask app
    port = int(os.environ.get("PORT", 8080))  # Default to 8080 if PORT not set
    app.run(host="0.0.0.0", port=port)