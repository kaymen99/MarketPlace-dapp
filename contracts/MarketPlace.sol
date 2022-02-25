// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract MarketPlace {
    //--------------------------------------------------------------------
    // VARIABLES

    address payable public admin;
    address public ethUsdPriceFeed;
    uint256 public sellFee = 5;

    Product[] public products;

    enum Status {
        REMOVED,
        INSALE,
        PENDING,
        SENT,
        SOLD
    }

    struct Product {
        uint256 id;
        address payable seller;
        string name;
        string description;
        string image;
        uint256 price;
        address payable buyer;
        Status status;
    }

    //--------------------------------------------------------------------
    // EVENTS

    event StoreCreated(address storeAddress, address owner, uint256 timestamp);
    event ProductAdded(uint256 id, address seller, uint256 timestamp);

    //--------------------------------------------------------------------
    // MODIFIERS

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin can call this");
        _;
    }

    modifier onlyBuyer(uint256 _id) {
        require(msg.sender == products[_id].buyer, "only buyer can call this");
        _;
    }

    modifier onlySeller(uint256 _id) {
        require(msg.sender == products[_id].seller, "only buyer can call this");
        _;
    }

    modifier notSeller(uint256 _id) {
        require(
            msg.sender != products[_id].seller,
            "the seller can't buy his own product"
        );
        _;
    }

    modifier inStatus(uint256 _id, Status _status) {
        require(products[_id].status == _status, "Wrong product status");
        _;
    }

    //--------------------------------------------------------------------
    // CONSTRUCTOR

    constructor(address priceFeedAddress) {
        admin = payable(msg.sender);
        ethUsdPriceFeed = priceFeedAddress;
    }

    //--------------------------------------------------------------------
    // FUNCTIONS

    function addProduct(
        string memory _name,
        string memory _description,
        string memory _image,
        uint256 _price
    ) public {
        uint256 productId = products.length;
        products.push(
            Product(
                productId,
                payable(msg.sender),
                _name,
                _description,
                _image,
                _price,
                payable(address(0)),
                Status.INSALE
            )
        );

        emit ProductAdded(productId, msg.sender, block.timestamp);
    }

    function purchase(uint256 _id)
        public
        payable
        notSeller(_id)
        inStatus(_id, Status.INSALE)
    {
        Product memory product = products[_id];
        require(
            msg.value == convertUSDToETH(product.price),
            "insuffisant amount"
        );
        products[_id].buyer = payable(msg.sender);
        products[_id].status = Status.PENDING;
    }

    function sendProduct(uint256 _id)
        public
        onlySeller(_id)
        inStatus(_id, Status.PENDING)
    {
        Product memory product = products[_id];

        products[_id].status = Status.SENT;
    }

    function confirmRecieved(uint256 _id)
        public
        onlyBuyer(_id)
        inStatus(_id, Status.SENT)
    {
        Product storage product = products[_id];
        product.status = Status.SOLD;

        uint256 priceMinusFee = (convertUSDToETH(product.price) *
            (1000 - sellFee)) / 1000;

        product.seller.transfer(priceMinusFee);
        products[_id] = product;
    }

    function cancelPurchase(uint256 _id)
        public
        onlyBuyer(_id)
        inStatus(_id, Status.PENDING)
    {
        Product storage product = products[_id];
        product.buyer.transfer(convertUSDToETH(product.price));

        product.status = Status.INSALE;
        product.buyer = payable(address(0));

        products[_id] = product;
    }

    function remove(uint256 _id)
        public
        onlySeller(_id)
        inStatus(_id, Status.INSALE)
    {
        delete products[_id];
    }

    function changePrice(uint256 _id, uint256 _newPrice)
        public
        onlySeller(_id)
        inStatus(_id, Status.INSALE)
    {
        products[_id].price = _newPrice;
    }

    function getProductDetails(uint256 _productId)
        public
        view
        returns (Product memory)
    {
        return products[_productId];
    }

    function getAllProducts() public view returns (Product[] memory) {
        return products;
    }

    /**
     * @dev Get current ETH/USD price using ChainLink price feed
     * @return the ETH/USD price , the number of decimals used for this price
     */

    function getPrice() public returns (uint256, uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            ethUsdPriceFeed
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = priceFeed.decimals();
        return (uint256(price), decimals);
    }

    function convertUSDToETH(uint256 amountInUSD) public returns (uint256) {
        (uint256 price, uint256 decimals) = getPrice();
        uint256 convertedPrice = (amountInUSD * 10**decimals) / price;
        return convertedPrice;
    }

    //--------------------------------------------------------------------
    // ADMIN FUNCTIONS

    function changeFee(uint256 _newFee) public onlyAdmin {
        sellFee = _newFee;
    }

    function withdrawBalance() public onlyAdmin {
        admin.transfer(address(this).balance);
    }
}
