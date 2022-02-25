import { Navbar, Container, Nav } from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.css';
import Account from "./Account"

function NavLinks() {

    return (
        <>
            <Navbar className="justify-content-center"
                bg="dark"
                variant="dark">
                <Container>
                    <Navbar.Brand href="/">
                        <b>DMarKet</b>
                    </Navbar.Brand>
                    <Nav activeKey={window.location.pathname}>
                        <Nav.Link href="/">Market</Nav.Link>
                        <Nav.Link href="/my-products">My Products</Nav.Link>
                        <Nav.Link href="/add-product">Sell</Nav.Link>
                    </Nav>

                    <Account />
                </Container>
            </Navbar>

        </>
    );
}

export default NavLinks;