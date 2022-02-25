import React, { useEffect, useState } from 'react';
import { ethers, utils } from "ethers"
import { makeStyles, CircularProgress } from "@material-ui/core"
import { useSelector } from "react-redux"
import { Card, Container, Row, Col, Form, FormControl, Button } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.css';


import MarketContract from "../artifacts/contracts/MarketPlace.json"
import contractsAddress from "../artifacts/deployments/map.json"
import networks from "../networksMap.json"
import Main from "../components/Main"
import "../components/NavbarElements"


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

function MarketPage() {
    const classes = useStyles()

    const data = useSelector((state) => state.blockchain.value)
    const [products, setproducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    async function loadProducts() {

        const signer = provider.getSigner()
        const market = new ethers.Contract(Marketaddress, MarketContract.abi, signer);
        const allProducts = await market.getAllProducts()

        const inSaleProducts = allProducts.filter(p => p[7] === 1)

        if (inSaleProducts !== undefined) {
            const items = inSaleProducts.map(p => {
                let item = {
                    productId: Number(p[0]),
                    name: p[2],
                    image: p[4],
                    price: utils.formatUnits(p[5].toString(), 'ether'),
                }
                return item
            })
            setproducts(items.reverse())
        }
    }

    function findProduct() {
        if (search !== "") {
            setLoading(true)
            const foundProducts = products.filter(p => p.name.toLowerCase().includes(search))
            setproducts(foundProducts)
            setLoading(false)
        }
    }

    // ganache network is used for testing purposes 
    const currentNetwork = networks["1337"]
    // switch to polygon mainnet/testnet for production
    // const currentNetwork = networks["80001"]
    const isGoodNet = data.network === currentNetwork

    useEffect(() => {
        loadProducts()
    }, [search])

    return (
        <>
            <Main />
            <div className={classes.Container}>
                {isGoodNet ? (
                    <>
                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search for a product"
                                className="me-2"
                                aria-label="Search"
                                onChange={(e) => { setSearch(e.target.value) }}
                            />
                            <Button variant="outline-info" onClick={() => { findProduct() }}>
                                {loading ? <CircularProgress size={26} color="#fff" /> : "Search"}
                            </Button>
                        </Form>
                        <Container>
                            <Row className='mt-5'>
                                {
                                    products.map((product, id) => {
                                        return (
                                            <Col style={{ marginBottom: "40px" }} md={3} key={id}>
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
                                                            href={"/products/" + product.productId}
                                                            role="button">
                                                            See More
                                                        </a>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Container>
                    </>
                ) : (
                    <div className={classes.Container}>
                        You are on the wrong network switch to {currentNetwork} network
                    </div>
                )}
            </div >
        </>

    )
}

export default MarketPage
