
import pandas as pd
import numpy as np

import matplotlib.cm as cm
import matplotlib.pyplot as plt

# featuretools for automated feature engineering
import featuretools as ft

# ignore warnings from pandas
import warnings
warnings.filterwarnings('ignore')

# Load the Excel file
file_path = '/Users/aman/Welzin/Dev/credzin/resources/credit_card_details.xlsx'
xls = pd.ExcelFile(file_path)

# Get all sheet names, excluding 'card_issuers'
sheet_names = [sheet for sheet in xls.sheet_names if sheet != 'card_issuers']

# Read and concatenate all sheets (assuming identical headers)
dfs = [xls.parse(sheet) for sheet in sheet_names]

# Concatenate into a single DataFrame
combined_df = pd.concat(dfs, ignore_index=True)

# Preview result
print(combined_df.head())
combined_df.shape

# Group data by bank name and count credit cards
bank_counts = combined_df.groupby('bank_name')['card_name'].count().reset_index()

# Create the bar graph
plt.figure(figsize=(10, 6))  # Adjust figure size as needed
colors = cm.viridis(np.linspace(0, 1, len(bank_counts)))  # Get colors from viridis colormap
bars = plt.bar(bank_counts['bank_name'], bank_counts['card_name'], color=colors)
plt.xlabel("Bank Name")
plt.ylabel("Number of Credit Cards")
plt.title("Credit Card Counts by Bank")
plt.xticks(rotation=45, ha='right')  # Rotate x-axis labels for readability
plt.tight_layout()  # Adjust layout to prevent labels from overlapping

for bar in bars:    # Add count labels to the bars
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval, int(yval), va='bottom', ha='center')
plt.show()

