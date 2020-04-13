## REQUESTS ARCHITECTURE

GET /bol/offers
-- Canceled for now
GET /bol/products

POST /bol/products

POST /bol/commission
-- Error with Calculate Profit

GET /bol/offers/update
-- Canceled for now

SHOPIFY AUTHENTICATION WITH AI.INCREASE

- CHECK IF DELETEINACTIVEOFFERS IS NEEDED AS DELETEOLDOFFER ALREADY EXISTS

* Change ProductChecker to spare API requests by removing offers from the query if stock has been above 500 for a long time.
