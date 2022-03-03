import pytest, brownie
from brownie import MarketPlace, network
from scripts.helper_scripts import (
    fromWei,
    get_account,
    get_contract,
    deploy_mock,
    toWei,
    LOCAL_BLOCKCHAINS,
    ZERO_ADDRESS,
)

# Product information used for testing
PRODUCT_NAME = "test product"
PRODUCT_DESCRIPTION = "test description"
PRODUCT_IMAGE = "test product image"
PRODUCT_PRICE = toWei(100) # 100$

PRODUCT_STATUS = {"INSALE": 1, "PENDING": 2, "SENT": 3, "SOLD": 4}


def test_add_product():

    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    admin = get_account()

    price_feed = deploy_mock()

    market = MarketPlace.deploy(price_feed.address, {"from": admin})

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    product = market.getProductDetails(0)

    assert product[0] == 0 # id
    assert product[1] == seller # seller
    assert product[2] == PRODUCT_NAME
    assert product[3] == PRODUCT_DESCRIPTION
    assert product[4] == PRODUCT_IMAGE
    assert product[5] == PRODUCT_PRICE
    assert product[6] == 0
    assert product[7] == ZERO_ADDRESS # buyer
    assert product[8] == PRODUCT_STATUS["INSALE"]
    assert len(market.getAllProducts()) == 1

def test_convert_price_to_eth():

    admin, market = deploy_market()

    amount_in_usd = 1500

    # for testing we put 1 ETH = 3000$ 
    converted_amount = market.convertUSDToETH.call(toWei(amount_in_usd))

    # 1500$ = 0.5 ETH
    expected_eth_price = toWei(0.5)

    assert converted_amount == expected_eth_price

def test_purchase_product():
    admin, market = deploy_market()

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    buyer = get_account(2)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": buyer, "value": price_in_eth})
    purchase_tx.wait(1)

    product = market.getAllProducts()[product_id]

    assert product[6] == price_in_eth
    assert product[7] == buyer
    assert product[8] == PRODUCT_STATUS["PENDING"]

def test_cancel_purchase():
    admin, market = deploy_market()

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    buyer = get_account(2)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": buyer, "value": price_in_eth})
    purchase_tx.wait(1)

    cancel_tx = market.cancelPurchase(product_id, {"from": buyer})
    cancel_tx.wait(1)

    product = market.getAllProducts()[product_id]

    assert product[6] == 0
    assert product[7] == ZERO_ADDRESS # buyer == 0x0000
    assert product[8] == PRODUCT_STATUS["INSALE"]

def test_send_product():

    admin, market = deploy_market()

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    buyer = get_account(2)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": buyer, "value": price_in_eth})
    purchase_tx.wait(1)

    send_tx = market.sendProduct(product_id, {"from": seller})
    send_tx.wait(1)

    product = market.getAllProducts()[product_id]

    assert product[8] == PRODUCT_STATUS["SENT"]

def test_confirm_recieved():

    admin, market = deploy_market()

    seller = get_account(1)
    seller_before_sale_balance = seller.balance()

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    buyer = get_account(2)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": buyer, "value": price_in_eth})
    purchase_tx.wait(1)

    send_tx = market.sendProduct(product_id, {"from": seller})
    send_tx.wait(1)

    confirm_tx = market.confirmRecieved(product_id, {"from": buyer})
    confirm_tx.wait(1)

    seller_after_sale_balance = seller.balance()

    product = market.getAllProducts()[product_id]

    assert product[8] == PRODUCT_STATUS["SOLD"]

    assert float(fromWei(seller_after_sale_balance)) == float(fromWei(seller_before_sale_balance)) + float(fromWei(price_in_eth)) * 0.995

def test_remove_product():
    
    admin, market = deploy_market()

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    product_id = 0

    remove_tx = market.remove(product_id, {"from": seller})
    remove_tx.wait(1)

    product = market.getProductDetails(product_id)

    # seller is zero address
    assert product[1] == ZERO_ADDRESS

def test_withdraw_market_balance():
    admin, market = deploy_market()
    admin_initial_balance = admin.balance()

    seller = get_account(1)

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": seller}
    )
    add_tx.wait(1)

    buyer = get_account(2)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": buyer, "value": price_in_eth})
    purchase_tx.wait(1)

    send_tx = market.sendProduct(product_id, {"from": seller})
    send_tx.wait(1)

    confirm_tx = market.confirmRecieved(product_id, {"from": buyer})
    confirm_tx.wait(1)

    withdraw_tx = market.withdrawBalance({"from": admin})
    withdraw_tx.wait(1)

    admin_final_balance = admin.balance()

    assert float(fromWei(admin_final_balance)) == float(fromWei(admin_initial_balance)) + float(fromWei(price_in_eth)) * 0.005
    assert market.balance() == 0

def test_admin_modifier():
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    admin = get_account()

    price_feed = deploy_mock()

    market = MarketPlace.deploy(price_feed.address, {"from": admin})

    random_user = get_account(1)

    # check that only admin can change the fees
    with brownie.reverts("only admin can call this"):
        change_tx = market.withdrawBalance({"from": random_user})
        change_tx.wait(1)

def test_not_seller():
    admin, market = deploy_market()

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": admin}
    )
    add_tx.wait(1)

    product_id = 0
    
    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    # get seller to buy it's own product and make sure that the market contract doesn't allow it
    with brownie.reverts("the seller can't buy his own product"):
        purchase_tx = market.purchase(product_id, {"from": admin, "value": price_in_eth})
        purchase_tx.wait(1)

def test_status_modifier():

    admin, market = deploy_market()

    add_tx = market.addProduct(
        PRODUCT_NAME, PRODUCT_DESCRIPTION, PRODUCT_IMAGE, PRODUCT_PRICE, {"from": admin}
    )
    add_tx.wait(1)

    user = get_account(1)

    product_id = 0

    price_in_eth = market.convertUSDToETH.call(PRODUCT_PRICE)

    purchase_tx = market.purchase(product_id, {"from": user, "value": price_in_eth})
    purchase_tx.wait(1)

    # After buying a the product it's status become PENDING so it can't be removed by seller
    # the remove operation is not allow and it reverts
    with brownie.reverts("Wrong product status"):
        remove_tx = market.remove(product_id, {"from": admin})
        remove_tx.wait(1)
    

def deploy_market():
    if network.show_active() not in LOCAL_BLOCKCHAINS:
        pytest.skip()

    admin = get_account()

    price_feed = deploy_mock()

    market = MarketPlace.deploy(price_feed.address, {"from": admin})

    return admin, market       





