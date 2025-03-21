from nba_api.stats.endpoints import leagueleaders
import pandas as pd

# Define the season you want to fetch (e.g., '2023-24')
season = '2024-25'

# Instantiate the LeagueLeaders class to fetch stats for the specified season
leaders = leagueleaders.LeagueLeaders(season=season, season_type_all_star='Regular Season')

# Extract the data into a DataFrame
leaders_df = leaders.league_leaders.get_data_frame()

# Display the top 10 NBA scorers
top_10_scorers = leaders_df[['PLAYER', 'TEAM', 'PTS']].sort_values(by='PTS', ascending=False).head(10)
print("Top 10 NBA Scorers:")
print(top_10_scorers)

# Save the data to a CSV file
leaders_df.to_csv(f'nba_player_stats_{season}_leaders.csv', index=False)
print(f"\nData saved to nba_player_stats_{season}_leaders.csv")
