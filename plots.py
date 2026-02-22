import pandas as pd
import plotly.graph_objects as go
#from rapidfireai.cli import RapidFireClient, RAGConfig
import os
from dotenv import load_dotenv
from google import genai

# --- 1. CONFIGURATION ---
load_dotenv()
# Replace these with your actual keys or set them in your environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
#RAPIDFIRE_API_KEY = os.getenv("RAPIDFIRE_API_KEY")

# Initialize Clients
#rf_client = RapidFireClient(api_key=RAPIDFIRE_API_KEY)
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# for model in gemini_client.models.list():
#     print(model.name)


# --- 2. DATA FILTERING ---
def prepare_local_data(state_name, crime_csv, tax_csv):
    crime_df = pd.read_csv(crime_csv)
    tax_df = pd.read_csv(tax_csv)
    
    # Simple state filter
    c_filtered = crime_df[crime_df['state_name'].str.lower() == state_name.lower()]
    t_filtered = tax_df[tax_df['state'].str.lower() == state_name.lower()]
    
    # Merge on year to create a "Local Context" string for the AI
    #merged = pd.merge(c_filtered, t_filtered, on='year').sort_values('year')
    return c_filtered, t_filtered

# --- 3. RAPIDFIRE HYPERPARALLEL PREDICTION ---
def get_parallel_predictions(state_name, bill_summary):
    crime_df, tax_df = prepare_local_data(state_name, "processed_crimes.csv", "formatted_tax_rates.csv")

    crime_str = crime_df.tail(5).to_csv(index=False)
    tax_str = tax_df.tail(5).to_csv(index=False)
    history_str = f"Crime Data:\n{crime_str}\nTax Data:\n{tax_str}"
    
    # We define different "Lenses" for RapidFire to run in parallel
    prediction_scenarios = [
        #{"name": "Optimistic", "prompt_bias": "Assume the bill's goals are 100% met with high efficiency."},
        #{"name": "Pessimistic", "prompt_bias": "Assume implementation delays and unintended social consequences."},
        {"name": "Balanced", "prompt_bias": "Provide a moderate, statistically likely outcome based on historical precedents."}
    ]
    
    # Launching Hyperparallel Experiments via RapidFire
    # This sends 3 parallel requests to Gemini with different context 'knobs'
    results = []
    
    for scenario in prediction_scenarios:
        full_prompt = f"""
        State: {state_name}
        Historical Data (Last 5 Years):
        {history_str}
        
        Proposed Bill Summary: {bill_summary}
        {scenario['prompt_bias']}
        
        Predict the next 2 years (2026, 2027) for:
        1. Property Crime Rate (numeric)
        2. Income Tax Rate (numeric)
        
        Return ONLY valid JSON: {{"2026": {{"crime": x, "tax": y}}, "2027": {{"crime": x, "tax": y}}}}
        """
        
        # In a real RapidFire workflow, you'd use rf_client.run_config()
        # Here we demonstrate the loop that RapidFire would optimize/parallelize
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=full_prompt
        )
        results.append({"scenario": scenario['name'], "data": response.text})
        
    return results, crime_df, tax_df

# --- 4. THE PLOTTER ---
# def plot_impact_dashboard(state_name, bill_summary):
#     predictions, history_df, tax_df = get_parallel_predictions(state_name, bill_summary)    

#     fig = go.Figure()

#     # Plot Historical Crime
#     fig.add_trace(go.Scatter(
#         x=history_df['year'], y=history_df['crime_rate'],
#         name="Historical Crime", line=dict(color='black', width=4)
#     ))

#     # Add Prediction Lines from AI
#     colors = {'Optimistic': 'green', 'Pessimistic': 'red', 'Balanced': 'blue'}
    
#     for pred in predictions:
#         # Parse the JSON from Gemini (simple cleanup usually needed)
#         # Note: In a real app, use pydantic for parsing
#         import json
#         try:
#             p_data = json.loads(pred['data'].strip('`json\n '))
#             p_years = [2025, 2026, 2027]
#             # Connect the last historical point to the new predictions
#             p_vals = [history_df['crime_rate'].iloc[-1], p_data['2026']['crime'], p_data['2027']['crime']]
            
#             fig.add_trace(go.Scatter(
#                 x=p_years, y=p_vals,
#                 name=f"Forecast ({pred['scenario']})",
#                 line=dict(dash='dot', color=colors[pred['scenario']])
#             ))
#         except:
#             continue

#     fig.update_layout(title="Property Crime", 
#                       xaxis_title="Year", 
#                       yaxis_title="Property Crime Rate (%)",
#                       yaxis=dict(
#                             range=[0,5],      # Set your fixed min/max here
#                             dtick=0.5,            # Tick every 0.5 units
#                             tick0=0,              # Start ticks at 0
#                         )
#                       )
#     return fig.to_json()


# def plot_impact_dashboard2(state_name, bill_summary):
#     predictions, crime_df, tax_df = get_parallel_predictions(state_name, bill_summary)

#     fig = go.Figure()

#     # Plot Historical Crime
#     fig.add_trace(go.Scatter(
#         x=tax_df['year'], y=tax_df['tax_rate'],
#         name="Historical Tax Rate", line=dict(color='black', width=4)
#     ))

#     # Add Prediction Lines from AI
#     colors = {'Optimistic': 'green', 'Pessimistic': 'red', 'Balanced': 'blue'}
    
#     for pred in predictions:
#         # Parse the JSON from Gemini (simple cleanup usually needed)
#         # Note: In a real app, use pydantic for parsing
#         import json
#         try:
#             p_data = json.loads(pred['data'].strip('`json\n '))
#             p_years = [2025, 2026, 2027]
#             # Connect the last historical point to the new predictions
#             p_vals = [tax_df['tax_rate'].iloc[-1], p_data['2026']['tax'], p_data['2027']['tax']]
            
#             fig.add_trace(go.Scatter(
#                 x=p_years, y=p_vals,
#                 name=f"Forecast ({pred['scenario']})",
#                 line=dict(dash='dot', color=colors[pred['scenario']])
#             ))
#         except:
#             continue

#     fig.update_layout(title="Income Tax", 
#                       xaxis_title="Year", 
#                       yaxis_title="Income Tax Rate (%)",
#                       yaxis=dict(
#                             range=[0,14],      # Set your fixed min/max here
#                             dtick=2,            # Tick every 2 units
#                             tick0=0,              # Start ticks at 0
#                         )
#                       )
#     return fig.to_json()


def plot_crime(predictions, crime_df):
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=crime_df['year'], y=crime_df['crime_rate'],
        name="Historical Crime", line=dict(color='black', width=4)
    ))
    colors = {'Optimistic': 'green', 'Pessimistic': 'red', 'Balanced': 'blue'}
    for pred in predictions:
        import json
        try:
            p_data = json.loads(pred['data'].strip('`json\n '))
            p_years = [2025, 2026, 2027]
            p_vals = [crime_df['crime_rate'].iloc[-1], p_data['2026']['crime'], p_data['2027']['crime']]
            fig.add_trace(go.Scatter(x=p_years, y=p_vals, name=f"Forecast ({pred['scenario']})",
                line=dict(dash='dot', color=colors[pred['scenario']])))
        except:
            continue
    fig.update_layout(title="Property Crime", xaxis_title="Year", yaxis_title="Property Crime Rate (%)",
        yaxis=dict(range=[0,5], dtick=0.5, tick0=0))
    return fig.to_json()


def plot_tax(predictions, tax_df):
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=tax_df['year'], y=tax_df['tax_rate'],
        name="Historical Tax Rate", line=dict(color='black', width=4)
    ))
    colors = {'Optimistic': 'green', 'Pessimistic': 'red', 'Balanced': 'blue'}
    for pred in predictions:
        import json
        try:
            p_data = json.loads(pred['data'].strip('`json\n '))
            p_years = [2025, 2026, 2027]
            p_vals = [tax_df['tax_rate'].iloc[-1], p_data['2026']['tax'], p_data['2027']['tax']]
            fig.add_trace(go.Scatter(x=p_years, y=p_vals, name=f"Forecast ({pred['scenario']})",
                line=dict(dash='dot', color=colors[pred['scenario']])))
        except:
            continue
    fig.update_layout(title="Income Tax", xaxis_title="Year", yaxis_title="Income Tax Rate (%)",
        yaxis=dict(range=[0,14], dtick=2, tick0=0))
    return fig.to_json()
