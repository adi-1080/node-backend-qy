from datetime import datetime
import pandas as pd

def convert_timestamps_to_strings(data):
    if isinstance(data, dict):
        return {str(key): convert_timestamps_to_strings(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_timestamps_to_strings(item) for item in data]
    elif isinstance(data, (pd.Timestamp, datetime)):
        return str(data)
    return data
