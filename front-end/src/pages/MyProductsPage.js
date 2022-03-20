import React, { useEffect, useState } from 'react';
import { ethers, utils } from "ethers"
import { makeStyles, Tab } from "@material-ui/core"
import { Card, Container, Row, Col } from "react-bootstrap"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { useSelector } from "react-redux"
import 'bootstrap/dist/css/bootstrap.css';


import MarketContract from "../artifacts/contracts/MarketPlace.json"
import contractsAddress from "../artifacts/deployments/map.json"
import networks from "../utils/networksMap.json"


const Marketaddress = contractsAddress["5777"]["MarketPlace"][0]

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");


const useStyles = makeStyles((theme) => ({
    Container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: theme.spacing(2)
    },
    box: {
        padding: theme.spacing(3),
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1)
    },
    uploadBtn: {
        position: "center",
        padding: theme.spacing(2),
    }
}))

function MyProductsPage() {
    const classes = useStyles()

    const data = useSelector((state) => state.blockchain.value)
    const [saleProducts, setSaleProducts] = useState([])
    const [buyProducts, setBuyProducts] = useState([])
    const [currentTab, setCurrentTab] = useState("sell")

    const handleChange = (event, newValue) => {
        setCurrentTab(newValue)
    }

    async function remove(id) {
        const signer = provider.getSigner()
        const market = new ethers.Contract(Marketaddress, MarketContract.abi, signer);

        const remove_tx = await market.remove(Number(id))
        await remove_tx.wait()
        console.log("product removed")
        loadMyProducts()

    }
    async function loadMyProducts() {
        console.log(data.account)
        const signer = provider.getSigner()
        const market = new ethers.Contract(Marketaddress, MarketContract.abi, signer);

        const allProducts = await market.getAllProducts()

        const mySaleProducts = allProducts.filter(p => p[1] === data.account)
        const myBoughtProducts = allProducts.filter(p => p[7] === data.account)

        if (mySaleProducts !== undefined) {
            const items = mySaleProducts.map(p => {
                let item = {
                    productId: Number(p[0]),
                    name: p[2],
                    image: p[4],
                    price: utils.formatUnits(p[5].toString(), 'ether'),
                    status: p[8]
                }
                return item
            })
            setSaleProducts(items.reverse())
        }
        if (myBoughtProducts !== undefined) {
            const items = myBoughtProducts.map(p => {
                let item = {
                    productId: Number(p[0]),
                    name: p[2],
                    image: p[4],
                    price: utils.formatUnits(p[5].toString(), 'ether'),
                    status: p[8]
                }
                return item
            })
            setBuyProducts(items.reverse())
        }
    }
    useEffect(() => {
        loadMyProducts()
    }, [saleProducts.length, data.account])

    // ganache network is used for testing purposes 
    const currentNetwork = networks["1337"]
    // switch to polygon mainnet/testnet for production
    // const currentNetwork = networks["80001"]

    const isGoodNet = data.network === currentNetwork
    const isConnected = data.account !== ""

    return (
        <>
            <div >
                {isConnected ? (
                    isGoodNet ? (
                        <Container>
                            <TabContext value={currentTab}>
                                <div className={classes.Container}>
                                    <TabList onChange={handleChange}>
                                        <Tab label="My Sales" value="sell" />
                                        <Tab label="My Buyings" value="buy" />
                                    </TabList>
                                </div>

                                <TabPanel value="sell">
                                    <Container>
                                        <Row className='mt-5'>
                                            {saleProducts.length !== 0 ? (
                                                saleProducts.map((product, id) => {

                                                    return (
                                                        <Col md={3} style={{ marginBottom: "40px" }} key={id}>
                                                            <Card style={{ width: '16rem' }} key={id}>
                                                                <Card.Img variant="top" src={product.image} width="0px" height="180px" />
                                                                <Card.Body>
                                                                    <Card.Title style={{ fontSize: "14px" }}>
                                                                        {product.name}
                                                                    </Card.Title>
                                                                    <Card.Text>
                                                                        <Card.Text>{product.price} $</Card.Text>
                                                                    </Card.Text>
                                                                    <a className="btn btn-primary"
                                                                        style={{ margin: "4px" }}
                                                                        href={"/products/" + product.productId}
                                                                        role="button">
                                                                        See More
                                                                    </a>
                                                                    {product.status === 1 ? (
                                                                        <a className="btn btn-danger"
                                                                            role="button"
                                                                            onClick={() => (remove(product.productId))}>
                                                                            Remove
                                                                        </a>
                                                                    ) : (product.status === 4 ?
                                                                        (<a className="btn btn-success">Sold</a>) : null
                                                                    )}

                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    )
                                                })) : (
                                                <div className={classes.Container}>
                                                    You didn't list any product for sale
                                                </div>
                                            )}
                                        </Row>
                                    </Container>

                                </TabPanel>
                                <TabPanel value="buy" >
                                    <Container>
                                        <Row className='mt-5'>
                                            {buyProducts.length !== 0 ? (
                                                buyProducts.map((product, id) => {
                                                    return (
                                                        <Col md={3} style={{ margin: "20px" }} key={id}>
                                                            <Card style={{ width: '16rem' }} key={id}>
                                                                <Card.Img variant="top" src={product.image} width="0px" height="180px" />
                                                                <Card.Body>
                                                                    <Card.Title style={{ fontSize: "14px" }}>
                                                                        {product.name}
                                                                    </Card.Title>
                                                                    <Card.Text>
                                                                        <Card.Text>{product.price} $</Card.Text>
                                                                    </Card.Text>
                                                                    <a className="btn btn-primary"
                                                                        style={{ margin: "4px" }}
                                                                        href={"/products/" + product.productId} role="button">
                                                                        See More
                                                                    </a>
                                                                </Card.Body>
                                                            </Card>
                                                        </Col>
                                                    )
                                                })
                                            ) : (
                                                <div className={classes.Container}>
                                                    You didn't buy any product yet
                                                </div>
                                            )}
                                        </Row>
                                    </Container>
                                </TabPanel>
                            </TabContext>
                        </Container>
                    ) : (
                        <div className={classes.Container}>
                            You are on the wrong network switch to {currentNetwork} network
                        </div>
                    )
                ) : null
                }
            </div >
        </>

    )
}

export default MyProductsPage
