import express from 'express'
const router = express.Router()

import stockController from '../controllers/stock-controller.js'

router.get('/get_balance_sheet/:tickerSymbol', stockController.getBalanceSheet)
router.get('/get_cash_flow/:tickerSymbol', stockController.getCashFlow);
router.get('/get_historical_data/:tickerSymbol', stockController.getHistoricalData);
router.get('/get_sector_and_industry/:tickerSymbol', stockController.getSectorAndIndustry);
router.get('/get_calendar/:tickerSymbol', stockController.getCalendar);
router.get('/get_news/:tickerSymbol', stockController.getNews);
router.get('/get_profile/:tickerSymbol', stockController.getProfile);
router.get('/get_analysis_data/:tickerSymbol', stockController.getAnalysisData);

export default router