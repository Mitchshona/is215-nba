import requests
import json

# URL of your Flask API
url = 'http://localhost:8080/predict'

# Example player data
player_data = {
    "Age": 28,
    "GP": 82,
    "TRB": 7.5,
    "AST": 6.2,
    "PTS": 25.3,
    "BLK": 1.2,
    "TS%": 0.58
}

# Send POST request
response = requests.post(url, json=player_data)

# Print the response
print(response.status_code)
print(response.json())