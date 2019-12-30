import requests
import json
from bs4 import BeautifulSoup
sess = requests.Session()


def info_of_product(product_id, quantity, url):
    sellers = get_sellers(url)
    for i in sellers:
        print(i['aboutSeller'])
        shopping_cart = add_to_basket(
            product_id, i['aboutPrice']['offerId'], quantity)
        print(shopping_cart)


def add_to_basket(product_id, offer_id, quantity):
    add_to_basket_session = requests.Session()
    home = add_to_basket_session.get(
        'https://www.bol.com/nl/p/calvin-klein-ckin2u-him-eau-de-toilette-spray/9200000005228214/')
    url = "https://www.bol.com/nl/order/basket/addItems.html?productId={}&offerId={}&quantity={}&redirect=/nl/ajax/ShoppingBasket.html".format(
        product_id, offer_id, quantity)
    payload = {}
    headers = {}
    response = add_to_basket_session.post(url, headers=headers, data=payload)
    shopping_cart = response.json()['shoppingCartItems']
    return shopping_cart


def get_sellers(url):
    page = requests.get(url)
    all_sellers = page.json()['content']['offers']['offers']
    return all_sellers


info_of_product('9200000098990892', 400,
                'https://www.bol.com/nl/p/benq-gl2460bh-tn-gaming-monitor-full-hd-1-ms/9200000098990892/prijsoverzicht/?filter=all&sort=price&sortOrder=asc',)

# get_sellers("https://www.bol.com/nl/p/benq-gl2460bh-tn-gaming-monitor-full-hd-1-ms/9200000098990892/prijsoverzicht/?filter=all&sort=price&sortOrder=asc")

# add_to_basket('9200000098990892', '1001033686918943', '500')
