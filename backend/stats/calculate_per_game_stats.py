import pandas as pd

# File paths
input_file = '/Users/jordianojr/Desktop/IS215-NBA/is215-nba/backend/stats/nba_stats_with_salaries.csv'
output_file = '/Users/jordianojr/Desktop/IS215-NBA/is215-nba/backend/stats/nba_stats_with_per_game.csv'

# Read the first line to check if it's a comment
with open(input_file, 'r') as f:
    first_line = f.readline()

# Read the CSV file
if first_line.startswith('//'):
    # Skip the comment line and read the data
    data = pd.read_csv(input_file, skiprows=1)
    comment_line = first_line
else:
    # No comment line, read the data normally
    data = pd.read_csv(input_file)
    comment_line = None

# Calculate per-game statistics
data['PTS'] = (data['PTS'] / data['GP']).round(1)
data['REB'] = (data['REB'] / data['GP']).round(1)
data['AST'] = (data['AST'] / data['GP']).round(1)
data['BLK'] = (data['BLK'] / data['GP']).round(1)

# Save the modified data to a new CSV file
if comment_line:
    with open(output_file, 'w') as f:
        f.write(comment_line)  # Write the comment line
        data.to_csv(f, index=False)
else:
    data.to_csv(output_file, index=False)

print(f"Per-game statistics have been calculated and saved to {output_file}")
