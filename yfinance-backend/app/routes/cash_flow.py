from flask import Blueprint, request, jsonify
from app.utils.data_converter import convert_data_to_json
import yfinance as yf
import json

bp = Blueprint("cash_flow", __name__, url_prefix="/api")

@bp.route("/cash_flow/<ticker_symbol>", methods=["GET"])
def get_cash_flow(ticker_symbol):
    try:
        my_data = yf.Ticker(ticker_symbol)
        my_cash_flow = my_data.cashflow
        cash_flow_json = convert_data_to_json(my_cash_flow)
        return jsonify(json.loads(cash_flow_json))
    except Exception as e:
        return jsonify({"error": str(e)})
