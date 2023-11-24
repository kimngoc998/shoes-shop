import './App.css';
import React,{ useEffect, useState } from 'react'
import { BrowserRouter , Routes, Route} from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Homepage from './components/homepage';
import Login from './components/layout/pages/login/login';
import HeaderDown from './components/layout/header/header-down';
import HeaderTop from './components/layout/header/header-top';
import Footer from './components/layout/footer/footer';
import Add_Edit_Product from './components/layout/pages/edit-add-product/Add_Edit_Product';
import Edit_Product from './components/layout/pages/Edit_Products/Edit_Products'
import Product_detail from  './components/layout/container/product-details'
import Register from './components/layout/pages/register/Register';
import Cart from './components/layout/pages/cart/categori';
import ProductMale from './components/layout/container/productMale';
import ProductFemale from './components/layout/container/productFemale';
import ProductList from './components/layout/container/product-nine';
import CustomerOrder from './components/layout/pages/order/customerorder';
import ManageOrder from './components/layout/pages/order/manageOrder';
import ManageUser from './components/layout/pages/user/manageUser';
import NotFound from './components/layout/pages/404/NotFound';
import { CartContext } from './components/layout/pages/cart/CartContext';
import CreateOrder from './components/layout/pages/create-order/CreateOrder';
import Search from './components/layout/container/productsSearch';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import AboutUs from './components/layout/pages/Aboutus'

const cartFromLocalStorage = JSON.parse(localStorage.getItem("cartItems") || "[]");

function App() {
  const [cartItems, setCartItems] = useState(Array.isArray(cartFromLocalStorage) ? cartFromLocalStorage : []);
  const user = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);


  if (!Array.isArray(cartItems)) {
    setCartItems([]);
  }

  const isAdmin = user && user.isAdmin;
  const adminRoutes = (
    <>
      <Route path="/PageAdmin/" element={<Layout />} />
      <Route path="/PageAdmin/AddProduct" element={<Add_Edit_Product />} />
      <Route path="/PageAdmin/EditProduct/" element={<Edit_Product />} />
      <Route path="/PageAdmin/ManageOrder" element={<ManageOrder />} />
      <Route path="/PageAdmin/ManageUser" element={<ManageUser />} />
    </>
  );

    return (
        <BrowserRouter>
        <CartContext.Provider value={{cartItems,setCartItems}}>
        <div className='App'>
            <div className="header">
                <HeaderTop />
                <HeaderDown />
            </div>
            <div className='main'>
                <Routes>
                    <Route exact path="/" element={<Homepage/>} />
                    <Route path="/Logout" element={<Homepage/>} />
                    <Route path="/Login" element={<Login />} />
                    <Route path="/Register" element={<Register />} />
                    <Route path="/Cart" element={<Cart />} />
                    <Route path="/Product/:id" element={<Product_detail />} />
                    <Route path="/Search/:search" element={<Search />} />
                    <Route path="/ProductsMale" element={<ProductMale />} />
                    <Route path="/ProductsFemale" element={<ProductFemale />} />
                    <Route path="/ProductsMale/:brand" element={<ProductMale />} />
                    <Route path="/ProductsFemale/:brand" element={<ProductFemale />} />
                    <Route path="/ProductList" element={<ProductList />} />
                    <Route path="/MyOrder" element={<CustomerOrder />} />
                    <Route path="/CreateOrder/:cartId" element={<CreateOrder />} />                    
                    <Route path="/AboutUs" element={<AboutUs />} />
                    <Route path="/CreateOrder/:cartId" element={<CreateOrder />} />
                    <Route path="/*" element={<NotFound />} />
                    {isAdmin && adminRoutes}                    
                </Routes>
            </div>
                <Footer />
        </div>
        </CartContext.Provider>
        </BrowserRouter>
    );
}

export default App;