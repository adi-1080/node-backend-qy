import json
import pandas as pd
from app.utils.timestamp_converter import convert_timestamps_to_strings

def convert_data_to_json(data):
    if data is not None:
        data_dict = data.to_dict()
        data_dict = convert_timestamps_to_strings(data_dict)
        return json.dumps(data_dict, indent=4)
    return json.dumps({"error": "No data available"}, indent=4)

def convert_to_json(data):
    if isinstance(data, pd.DataFrame):
        data = data.reset_index()
        data = data.to_dict(orient="records")
    return json.dumps(data, indent=4)
