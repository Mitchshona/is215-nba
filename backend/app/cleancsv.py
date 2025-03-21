import pandas as pd

nba_df = pd.read_csv('nba_stats_24-25.csv')
nba_df_new = nba_df[['PLAYER', 'TEAM', 'Age', 'GP', 'PTS', 'TRB', 'AST', 'BLK', 'Salary', 'TS%']]
nba_df_new
nba_df_new.to_csv('nba_stats_24-25_new.csv', index=False)
