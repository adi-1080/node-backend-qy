from flask import Blueprint, jsonify
from app.utils.data_converter import convert_timestamps_to_strings
import yfinance as yf
import json

bp = Blueprint("calendar", __name__, url_prefix="/api")

@bp.route("/calendar/<ticker_symbol>", methods=["GET"])
def get_calendar(ticker_symbol):
    try:
        # Fetch calendar data from yfinance
        my_data = yf.Ticker(ticker_symbol)
        my_calendar = my_data.calendar

        # Handle different types of data returned by yfinance
        if hasattr(my_calendar, "to_dict"):  # If it's a DataFrame
            calendar_dict = my_calendar.to_dict()
        else:  # If it's already a dictionary
            calendar_dict = my_calendar

        # Convert timestamps in the dictionary to strings
        calendar_dict = convert_timestamps_to_strings(calendar_dict)

        # Return the JSON response
        return jsonify(calendar_dict)
    except Exception as e:
        # Handle errors and return a JSON response with the error message
        return jsonify({"error": str(e)})
