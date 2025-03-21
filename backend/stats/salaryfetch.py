import pandas as pd
import os

def load_datasets(stats_path, salaries_path):
    """
    Load the NBA stats and salaries datasets
    """
    try:
        stats_df = pd.read_csv(stats_path)
        salaries_df = pd.read_csv(salaries_path)
        return stats_df, salaries_df
    except FileNotFoundError as e:
        print(f"Error: File not found - {e}")
        return None, None
    except Exception as e:
        print(f"Error loading datasets: {e}")
        return None, None

def get_player_salary(player_name, salaries_df, salary_col='2024/2025'):
    """
    Get the 2023/2024 salary for a given player
    """
    # Search for the player in the salaries dataframe
    player_row = salaries_df[salaries_df['PLAYER'].str.contains(player_name, case=False, na=False)]
    
    # if player_row.empty:
    #     # Try matching on last name if full name doesn't match
    #     last_name = player_name.split()[-1]
    #     player_row = salaries_df[salaries_df['PLAYER'].str.contains(last_name, case=False, na=False)]
        
    #     if player_row.empty:
    #         return None
    #     elif len(player_row) > 1:
    #         print(f"Multiple matches found for {player_name}. Using first match: {player_row.iloc[0]['PLAYER']}")
    
    # Return the 2023/2024 salary if available
    try:
        if salary_col in player_row.columns:
            salary = player_row[salary_col].values[0]
            salary = salary.replace('$', '').replace(',', '')
            return salary
        else:
            print(f"Salary column '{salary_col}' not found. Available columns: {player_row.columns.tolist()}")
            return None
    except Exception as e:
        print(f"Error retrieving salary: {e}")
        return None

def merge_stats_with_salaries(stats_df, salaries_df, salary_col='2024/2025', player_col='PLAYER'):
    """
    Add salary information to the stats dataframe
    """
    if stats_df is None or salaries_df is None:
        return None
    
    # Create a new column in the stats dataframe for salary
    stats_df['SALARY'] = stats_df[player_col].apply(
        lambda player: get_player_salary(player, salaries_df, salary_col)
    )
    return stats_df

def main():
    # File paths - adjust these based on your actual directory structure
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.join(current_dir)  # Navigate up to is215-nba directory
    
    stats_path = os.path.join(base_dir, 'nba_player_stats_2024-25_leaders.csv')
    salaries_path = os.path.join(base_dir, 'nba_salaries.csv')
    
    # Load datasets
    stats_df, salaries_df = load_datasets(stats_path, salaries_path)
    
    if stats_df is None or salaries_df is None:
        print("Error loading datasets. Exiting.")
        return
    
    # Check if the salary column exists
    salary_col = '2023/2024'
    if salary_col not in salaries_df.columns:
        print(f"Salary column '{salary_col}' not found. Available columns:")
        print(salaries_df.columns.tolist())
        return
    
    # Use the 'PLAYER' column as specified
    player_col = 'PLAYER'
    if player_col not in stats_df.columns:
        print(f"Column '{player_col}' not found in stats file. Available columns:")
        print(stats_df.columns.tolist())
        return
    
    # Example: Get salary for a specific player
    player_name = input("Enter a player name to search for (or press Enter to process all players): ")
    
    if player_name:
        salary = get_player_salary(player_name, salaries_df, salary_col)
        if salary is not None:
            print(f"{player_name}'s salary for 2023/2024: {salary}")
        else:
            print(f"No salary information found for {player_name}")
    else:
        # Merge stats with salaries
        merged_df = merge_stats_with_salaries(stats_df, salaries_df, salary_col, player_col)
        
        if merged_df is not None:
            # Save the merged dataframe
            output_path = os.path.join(base_dir, 'nba_stats_with_salaries.csv')
            merged_df.to_csv(output_path, index=False)
            print(f"Saved merged data to {output_path}")
            
            # Show example data
            print("\nExample data (first 5 rows):")
            print(merged_df.head())
            
            # Show stats on how many players have salary information
            salary_count = merged_df['SALARY'].notna().sum()
            total_players = len(merged_df)
            print(f"\nFound salary information for {salary_count} out of {total_players} players ({salary_count/total_players:.1%})")

if __name__ == "__main__":
    main()
