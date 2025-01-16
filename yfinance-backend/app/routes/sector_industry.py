from flask import Blueprint, request, jsonify
import yfinance as yf
import json
import os

bp = Blueprint("sector_industry", __name__, url_prefix="/api")

# Load the JSON data from the file (for extracting nse-symbols)
def load_json_data(file_path):
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"The file '{file_path}' does not exist.")
        
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except FileNotFoundError as e:
        raise e
    except json.JSONDecodeError:
        raise ValueError(f"Error decoding JSON in the file: {file_path}")

# Extract nse-symbols from JSON data
def extract_symbols(data):
    if not isinstance(data, list):
        raise ValueError("JSON data is not in the expected list format.")
    return [company.get('nse-symbol') for company in data if 'nse-symbol' in company]

# Endpoint to get sector and industry for multiple tickers
@bp.route("/sector_industry", methods=["GET"])
def get_sector_and_industry():
    # Get query parameter for tickers (comma-separated string)
    tickers = request.args.get("tickers", "").split(",")

    try:
        result = {}
        for ticker in tickers:
            # Fetching data from Yahoo Finance for the given ticker symbol
            info = yf.Ticker(ticker).info
            
            # Get sector and industry information
            sector = info.get("sector", "N/A")
            industry = info.get("industry", "N/A")

            # Storing the sector and industry info for each ticker
            result[ticker] = {"sector": sector, "industry": industry}
        
        # Return the result as a JSON response
        return jsonify(result)
    
    except Exception as e:
        return jsonify({"error": str(e)})

# Endpoint to get all companies grouped by sector and industry
@bp.route("/sector_industry_grouping", methods=["GET"])
def get_all_companies_by_sector_industry():
    try:
        # Load symbols from the JSON file
        file_path = os.path.join(os.path.dirname(__file__), "nse-ticker-symbols.json")

        data = load_json_data(file_path)
        symbols = extract_symbols(data)
        result = {}

        for ticker in symbols:
            try:
                info = yf.Ticker(ticker).info
                sector = info.get("sector", "N/A")
                industry = info.get("industry", "N/A")

                # Initialize sector and industry groupings if not present
                if sector not in result:
                    result[sector] = {}
                if industry not in result[sector]:
                    result[sector][industry] = []

                # Append ticker to the industry list
                result[sector][industry].append(ticker)

            except Exception:
                # Skip ticker if any error occurs (e.g., invalid ticker symbol)
                continue
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)})