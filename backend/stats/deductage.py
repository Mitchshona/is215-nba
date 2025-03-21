import pandas as pd
import os

# Determine the location of the CSV file
# Assuming it's in a data directory at the project root
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
csv_path = os.path.join(base_dir, "backend/stats/nba_player_stats_2023-24_leaders.csv")

# Read the CSV file
df = pd.read_csv(csv_path)

# Verify Age column exists
if 'Age' not in df.columns:
    print("Error: 'Age' column not found in the CSV file.")
    exit(1)

# Deduct 1 from each row's age
df['Age'] = df['Age'] - 1

# Save the modified data back to CSV
df.to_csv(csv_path, index=False)

print(f"Successfully deducted 1 year from each player's age in {csv_path}")
