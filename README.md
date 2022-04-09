<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## Decentralized Marketplace App

![Capture d’écran 2022-03-03 à 22 56 04](https://user-images.githubusercontent.com/83681204/156659942-75f846d0-eb92-44d9-9bf0-c8d80082e3dd.png)

This is a decentralized marketplace built for EVM compatible blockchains, it enables sellers and buyers from all around the world to buy and sell their products in secure and trustless manner, and even thought products are listed in $ (to avoid the volatility of the crypto market) all the payment are done using cryptocurrencies (ETH, MATIC,...) and all the purchase steps are controled by the MarketPlace smart contract logic.

### Built With

* [Solidity](https://docs.soliditylang.org/)
* [Brownie](https://eth-brownie.readthedocs.io)
* [React.js](https://reactjs.org/)
* [ethers.js](https://docs.ethers.io/v5/)
* [web3modal](https://github.com/Web3Modal/web3modal)
* [material ui](https://mui.com/getting-started/installation/)


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#how-it-works">How it Works</a></li>
    <li>
      <a href="#usage">How to Use</a>
      <ul>
        <li><a href="#contracts">Contracts</a></li>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#front-end">Front End</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>


<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Please install or have installed the following:
* [nodejs and npm](https://nodejs.org/en/download/) 
* [python](https://www.python.org/downloads/)
* [MetaMask](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) Chrome extension installed in your browser

### Installation

1. Installing Brownie: Brownie is a python framework for smart contracts development,testing and deployments. It's quit like [HardHat](https://hardhat.org) but it uses python for writing test and deployements scripts instead of javascript.
   Here is a simple way to install brownie.
   ```
    pip install --user pipx
    pipx ensurepath
    # restart your terminal
    pipx install eth-brownie
   ```
   Or if you can't get pipx to work, via pip (it's recommended to use pipx)
    ```
    pip install eth-brownie
    ```
   
3. Clone the repo:
   ```sh
   git clone https://github.com/Aymen1001/MarketPlace-dapp.git
   cd MarketPlace-dapp
   ```
3. Install Ganache:
   Ganache is a local blockchain that run on your machine, it's used during development stages because it allows quick smart contract testing and avoids all real         Testnets problems. 
   You can install ganache from this link : https://trufflesuite.com/ganache/
   
   Next, you need to setup the ganache network with brownie :
   ```sh
   brownie networks add Ethereum ganache-local host=http://127.0.0.1:7545 chainid=5777
   ```
4. Set your environment variables
   To be able to deploy to real testnets you need to add your PRIVATE_KEY (You can find your PRIVATE_KEY from your ethereum wallet like metamask) to the .env file:
   ```
   PRIVATE_KEY=<PRIVATE_KEY>
   ```
   You can choose to use ethereum testnets like rinkeby, Kovan or any other evm compatible testnet.
   
   To setup the ethereum  Testnet with brownie you'll need an Alchemy account (it's free) and just create a new app on the ethereum  network
   
   ![Capture d’écran 2022-01-25 à 00 14 44](https://user-images.githubusercontent.com/83681204/150881084-9b60349e-def0-44d2-bbb2-8ca7e27157c7.png)
  
   After creating the app copy the URL from -view key- and run this: 
   ```sh
   brownie networks add Ethereum <network name> cmd=ganache-cli host=<Copied URL> accounts=10 mnemonic=brownie port=8545 chainid=<network chainId>
   ```
   
   You'll also need some eth in the testnet. You can get it into your wallet by using a public faucet. 


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Working EXAMPLES -->
## How it Works

Decentralized marketplaces are one of the best use cases of blockchains technologies. They allow people to interact and transact on a global, permission-less, and self-executing platform. Houses, hot sauce, and t-shirts can all be bought and sold without needing to trust a middleman and with smaller fees.

The application allow any user to add a product by providing the product name, description, price in $ and image.

![Capture d’écran 2022-03-03 à 22 36 53](https://user-images.githubusercontent.com/83681204/156660595-9432f950-941d-465f-ad69-bb0edaad32b7.png)

The platform ensures a good interaction between the seller and the buyer by deviding the purchase process (product state) into 4 steps:
  <ul>
    <li><b>In Sale:</b> The first step when a seller list it's product on the market </li>
    <li><b>Pending:</b> When a product is bought the amount paid is locked in the smart contract and buyer waits for seller to sent the product </li>
    <li><b>Sent:</b> The seller sends the product and waits for the buyer confirmation</li>
    <li><b>Sold:</b> The buyer confirms the recieval and the funds are transfered to the seller </li> 
  </ul>
 
All this steps can be performed on the product page: 

<b>Seller point of view: </b>

![Capture d’écran 2022-03-03 à 22 37 35](https://user-images.githubusercontent.com/83681204/156660145-aacb1ff4-2ba3-44d5-8bb9-87c927571b6b.png)

<b>Buyer point of view: </b>

![Capture d’écran 2022-03-03 à 22 50 59](https://user-images.githubusercontent.com/83681204/156660202-5bbb40db-ccf6-4a9f-88eb-3b407eca0211.png)


The user can find the list of products he is selling and that he is buying on the My product page:

![Capture d’écran 2022-03-03 à 22 59 21](https://user-images.githubusercontent.com/83681204/156660090-ba1333a3-17c5-4c18-91d2-f579478739ff.png)


<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## How to Use

### Contracts

   The app is based on a single global contract called MarketPlace, it contains the following functions :

  <ul>
    <li><b>Admin functions:</b> Allow admin to change the fee charged for selling a product</li>
    <li><b>Seller functions:</b> Allow a seller to add it's product, change it's price and sent it to the buyer </li>
    <li><b>Buyers functions:</b> Allow buyer to purchase and confirm the recieval of any product </li>
    <li><b>Chainlink Price Feed:</b> the contract uses the price feed provided by chainlink oracle for converting the products prices from $ to ETH </li>   
  </ul>

<p align="right">(<a href="#top">back to top</a>)</p>
    
### Scripts

   In the MarketPlace-dapp folder you'll find a directory scripts, it contain all the python code for deploying your contracts and also some useful functions

   The reset.py file is used to remove all previous contracts deployments from build directory:
   ```sh
   brownie run scripts/reset.py
   ```
   The deploy.py file allow the deployment to the testnet/local-network:
   ```sh
   brownie run scripts/deploy.py --network=ganache-local
   ```
   The update_front_end.py is used to transfer all the smart contracts data (abi,...) and addresses to the front end in the artifacts directory:
   ```sh
   brownie run scripts/update_front_end.py
   ```
   
   After running this 3 cammands, the MarketPlace contract is now deployed and is integrated with the front end
   
 <p align="right">(<a href="#top">back to top</a>)</p>
  
 ### Testing

   In the MarketPlace-dapp folder you'll find a directory tests, it contain all the python code used for testing the smart contract functionalities
   
   You can run all the tests by :
   ```sh
   brownie test
   ```
   Or you can test each function individualy:
   ```sh
   brownie test -k <function name>
   ```
   
<p align="right">(<a href="#top">back to top</a>)</p>
   
### Front-end
   
   The user interface of this application is build using React JS, it can be started by running: 
   ```sh
   cd front-end
   yarn
   yarn start
   ```
   It uses the following libraries:
      <ul>
        <li><b>Ethers.js:</b> used as interface between the UI and the deployed smart contract</li>
        <li><b>Web3modal:</b> for conecting to Metamask</li>
        <li><b>ipfs-http-client:</b> for connecting  and uploading files to IPFS </li>
        <li><b>@reduxjs/toolkit & redux-persist:</b> for managing the app states (account, balance, blockchain) </li>
        <li><b>Material UI:</b> used for react components and styles </li>    
      </ul>
      
   The files are structured as follows:
    <ul>
      <li><b>pages:</b> Contains all the app views (MarketPage, ProductPage,...)</li>
      <li><b>Components:</b> Contains all the app component(main, navbar, Account,...) </li>
      <li><b>features:</b> contains the redux toolkit reducer and actions </li>
      <li><b>artifacts:</b> contains all the smart contract data and addresses transfered earlier </li>
      <li><b>NetworksMap:</b> a json file for some known blockchains names & chain id </li> 
    </ul>
   
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- Contact -->
## Contact

If you have any question or problem running this project just contact me: aymenMir1001@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

