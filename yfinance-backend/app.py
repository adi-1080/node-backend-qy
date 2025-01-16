from flask import Flask
from app.routes import balance_sheet, cash_flow, sector_industry, calendar

app = Flask(__name__)

#Register Blueprints
app.register_blueprint(balance_sheet.bp)
app.register_blueprint(cash_flow.bp)
# app.register_blueprint(historical_data.bp)
app.register_blueprint(sector_industry.bp)
app.register_blueprint(calendar.bp)

if __name__ == "__main__":
    app.run(debug=True)
