from brownie import MarketPlace, network
from scripts.helper_scripts import get_account, LOCAL_BLOCKCHAINS, deploy_mock, toWei


def deploy():

    account = get_account()

    if network.show_active() in LOCAL_BLOCKCHAINS:
        feed = deploy_mock()

    market = MarketPlace.deploy(feed.address, {"from": account})

    print("market contract address: ", market.address)

    
def main():
    deploy()
