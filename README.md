# Node Backend Documentation

### Stocks

- GET balance sheet for WIPRO
http://localhost:3000/stock/get_balance_sheet/WIPRO.NS/

- GET stock statistics for WIPRO
http://localhost:3000/stock/get_stock_stats/WIPRO.NS/7/

- GET cash flow for WIPRO
http://localhost:3000/stock/get_cash_flow/WIPRO.NS/

- GET historical data for WIPRO
http://localhost:3000/stock/get_historical_data/WIPRO.NS/?period=1mo&interval=1d

- GET sector and industry for WIPRO
http://localhost:3000/stock/get_sector_and_industry/WIPRO.NS/

- GET calendar data for WIPRO
http://localhost:3000/stock/get_calendar/WIPRO.NS/

- GET analysis data for WIPRO
http://localhost:3000/stock/get_analysis/WIPRO.NS/

- GET news for WIPRO
http://localhost:3000/stock/get_news/WIPRO.NS/

- GET profile for WIPRO
http://localhost:3000/stock/get_profile/WIPRO.NS/

### User Contact

- Mir Dabhi contacts us
http://localhost:3000/usercontact/contact-us <br>
![image](https://github.com/user-attachments/assets/fb906584-4366-4c77-90f4-57c3cf3c82ec)


### Users

- Register Aditya Gupta
http://localhost:3000/user/register <br>
![image](https://github.com/user-attachments/assets/6c69638b-a6a0-4b88-9fc5-ca1dbd1ab143)


- Login Aditya Gupta
http://localhost:3000/user/login <br>
![image](https://github.com/user-attachments/assets/7720c419-dead-4ad9-960b-9c6594c62943)

### Google Login

- GET http://localhost:3000/auth/google
After clicking on 'Sign in with google' users goes to the login page of google
After signing in they are redirected to the callback url http://localhost:3000/auth/google/callback. This url redirects user to their profile i.e. http://localhost:3000/profile

- GET http://localhost:3000/google-logout
This url logs out the user and redirects to home page i.e. http://localhost:3000/