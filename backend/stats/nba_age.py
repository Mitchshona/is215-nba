import pandas as pd
import time
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.library.http import NBAStatsHTTP

# Load the CSV file that contains player stats
csv_file = 'nba_player_stats_2024-25_leaders.csv'
leaders_df = pd.read_csv(csv_file)

from nba_api.stats.endpoints import commonplayerinfo
import datetime

# Check the columns to identify player ID column
print("DataFrame columns:", leaders_df.columns.tolist())

# Extract player IDs from the dataframe
# Assuming the column is named 'PLAYER_ID' - adjust if needed
player_id_column = 'PLAYER_ID'
if player_id_column not in leaders_df.columns:
    print(f"Column '{player_id_column}' not found. Available columns:", leaders_df.columns.tolist())
else:
    # Start from row 303 (index 302 since Python is 0-indexed)
    start_row = 301
    print(f"Starting from row {start_row+1} (index {start_row})")
    
    # Create a list of player IDs starting from row 303
    player_ids = leaders_df[player_id_column].iloc[start_row:].tolist()
    
    # Create a list to store player ages
    player_ages = []
    processed_indices = []
    
    # Iterate through player IDs to get their ages
    for i, player_id in enumerate(player_ids):
        current_row = start_row + i
        try:
            # Add delay to avoid rate limits
            time.sleep(0.6)
            
            # Call playercareerstats as requested
            career = playercareerstats.PlayerCareerStats(player_id=player_id)
            
            # Get age information using commonplayerinfo
            player_info = commonplayerinfo.CommonPlayerInfo(player_id=player_id)
            data = player_info.get_normalized_dict()
            
            # Extract birth date and calculate age
            birth_date_str = data['CommonPlayerInfo'][0]['BIRTHDATE']
            birth_date = datetime.datetime.strptime(birth_date_str, '%Y-%m-%dT%H:%M:%S')
            today = datetime.datetime.now()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            
            player_ages.append(age)
            processed_indices.append(current_row)
            print(f"Row {current_row+1}: Retrieved age {age} for player ID {player_id}")
        except Exception as e:
            print(f"Row {current_row+1}: Error retrieving data for player ID {player_id}: {e}")
            player_ages.append(None)  # Append None for failed requests
            processed_indices.append(current_row)
    
    # Update only the processed rows with their ages
    for idx, age in zip(processed_indices, player_ages):
        if 'Age' not in leaders_df.columns:
            leaders_df['Age'] = None
        leaders_df.at[idx, 'Age'] = age
    
    # Save the updated dataframe back to CSV
    leaders_df.to_csv(csv_file, index=False)
    print(f"Updated Age column for rows starting from {start_row+1} and saved to {csv_file}")

