<div id="top"></div>

<!-- ABOUT THE PROJECT -->
## Decentralized Marketplace

![Capture d’écran 2022-02-25 à 22 13 11](https://user-images.githubusercontent.com/83681204/155805283-d061346c-f93a-4165-a2c9-89c912db7ca3.png)

This is a decentralized marketplace built for EVM blockchain, it enables sellers and buyers from all around the world the buy and sell their products in secure and trustless manner using cryptocurrency

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
    <li><a href="#usage">How it works</a></li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#contracts">Contracts</a></li>
        <li><a href="#scripts">Scripts</a></li>
        <li><a href="#testing">Testing</a></li>
        <li><a href="#front-end">Front End</a></li>
      </ul>
    </li>
    <li><a href="#resources">Resources</a></li>
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
   git clone https://github.com/Aymen1001/ipfs-storage-dapp.git
   cd ipfs-storage-dapp
   ```
3. Install Ganache:
   Ganache is a local blockchain that run on your machine, it's used during development stages because it allows quick smart contract testing and avoids all real         Testnets problems. 
   You can install ganache from this link : https://trufflesuite.com/ganache/
   
   Next, you need to setup the ganache network with brownie :
   ```sh
   cd ipfs-storage-dapp
   brownie networks add development ganache-local cmd=ganache-cli host=http://127.0.0.1 accounts=10 mnemonic=brownie port=8545
   ```
4. Set your environment variables
   To be able to deploy to real Polygon testnets you need to add your PRIVATE_KEY (You can find your PRIVATE_KEY from your ethereum wallet like metamask) to the .env file:
   ```
   PRIVATE_KEY=<PRIVATE_KEY>
   ```
   In this project i used the Polygon Testnet but you can choose to use ethereum testnets like rinkeby, Kovan.
   
   To setup the Polygon Testnet with brownie you'll need an Alchemy account (it's free) and just create a new app on the polygon network
   
   ![Capture d’écran 2022-01-25 à 00 14 44](https://user-images.githubusercontent.com/83681204/150881084-9b60349e-def0-44d2-bbb2-8ca7e27157c7.png)
   
   
   After creating the app copy the URL from -view key- and run this: 
   ```sh
   cd ipfs-storage-dapp
   brownie networks add Polygon polygon-mumbai host=<Copied URL> chainid=80001 name="Mumbai Testnet (Alchemy)"
   ```
   
   You'll also need testnet MATIC. You can get MATIC into your wallet by using the Polygon testnet faucets located [here](https://faucet.polygon.technology). 


<p align="right">(<a href="#top">back to top</a>)</p>

<!-- Working EXAMPLES -->
## How it works


<p align="right">(<a href="#top">back to top</a>)</p>



<!-- Contact -->
## Contact

If you have any question or problem running this project just contact me: AymenMir1001@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

