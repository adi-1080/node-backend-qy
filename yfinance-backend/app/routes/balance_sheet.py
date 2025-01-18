from flask import Blueprint, request, jsonify
from app.utils.data_converter import convert_data_to_json
import yfinance as yf
import json

bp = Blueprint("balance_sheet", __name__, url_prefix="/api")

@bp.route("/balance_sheet/<ticker_symbol>", methods=["GET"])
def get_balance_sheet(ticker_symbol):
    try:
        my_data = yf.Ticker(ticker_symbol)
        my_balance_sheet = my_data.balance_sheet
        balance_sheet_json = convert_data_to_json(my_balance_sheet)
        return jsonify(json.loads(balance_sheet_json))
    except Exception as e:
        return jsonify({"error": str(e)})
