import pandas as pd

def add_true_shooting_percentage():
    # File path
    file_path = '/Users/jordianojr/Desktop/IS215-NBA/is215-nba/backend/stats/nba_player_stats_2024-25_leaders.csv'
    
    # Read the CSV file
    df = pd.read_csv(file_path)
    
    # Calculate True Shooting Percentage (TS%)
    # Formula: TS% = (Total Points) / (2 * (Total Field Goal Attempts + 0.44 * Total Free Throw Attempts))
    df['TS%'] = df['PTS'] / (2 * (df['FGA'] + 0.44 * df['FTA']))
    
    # Round to 3 decimal places for better readability
    df['TS%'] = df['TS%'].round(3)
    
    # Save the updated dataframe back to CSV
    df.to_csv(file_path, index=False)
    
    print(f"TS% column added to {file_path}")

if __name__ == "__main__":
    add_true_shooting_percentage()
