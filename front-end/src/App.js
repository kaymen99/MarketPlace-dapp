import './App.css';
import Main from './components/Main';
import { MarketPage, MyProductsPage, ProductPage, AddProduct, } from './pages'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

    return (
        <div>
            <Router>
                <Main />
                <Routes>
                    <Route path="/" element={<MarketPage />} />
                    <Route path="/my-products" element={<MyProductsPage />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/products/:id" element={<ProductPage />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;