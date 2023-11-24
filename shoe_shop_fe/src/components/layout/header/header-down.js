import './header.css';
import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faShoppingCart, faBell } from '@fortawesome/free-solid-svg-icons';
// import { faFile } from '@fortawesome/free-regular-svg-icons';
import { Link } from 'react-router-dom';
import { Badge } from 'rsuite';
import { CartContext } from "../pages/cart/CartContext"
import axios from 'axios';
import { useSelector } from 'react-redux';
import Search from '../../search';
import {
    getProducts as getProductsApi
} from "../container/productsAPI";

function Header_down() {

    const { cartItems, setCartItems } = useContext(CartContext);
    const cartN = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [isOpen, setIsOpen] = useState(false);
    const [hasOrder, setHasOrder] = useState(false)
    const [hasIncompleteOrder, setHasIncompleteOrder] = useState(false)
    const [cartId, setCartId] = useState("");
    sessionStorage.setItem("cartId", cartId);
    const [FproductList, setFProductList] = useState([])
    const [MproductList, setMProductList] = useState([])

    useEffect(() => {
        getProductsApi()
            .then((res) => {
                const dataList = res;
                const FvalidGenders = ['F', 'Female', 'Women', 'Woman', 'Nữ', 'Unsex', ''];
                const FfilterData = dataList.filter((data) => FvalidGenders.includes(data.gender));
                setFProductList(FfilterData);
                const MvalidGenders = ['M', 'Male', 'Men', 'Man', 'Nam', 'Unsex', ''];
                const MfilterData = dataList.filter((data) => MvalidGenders.includes(data.gender));
                setMProductList(MfilterData);
            })
    }, [])

    function uniqueBrands(productList) {
        return productList?.reduce((brands, product) => {
            if (!brands.includes(product.brand)) {
                brands.push(product.brand);
            }
            return brands;
        }, []);
    }
    const FBrands = uniqueBrands(FproductList);
    const MBrands = uniqueBrands(MproductList);


    const handleRedirect = () => {
        // Navigate to the /Cart page with the cartId passed as a URL parameter
        window.location.href = `/Cart`;
    };

    useEffect(() => {
        if (cartN > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [cartN]);


    const user = useSelector((state) => state.auth.login.currentUser);


    useEffect(() => {
        if (user) {
            const userID = user._id;
            const newCart = {
                userId: userID,
                products: Array.from(cartItems)
            };
            //console.log(newCart);
            // console.log("tài khoản đẵ thay đổi");
            axios
                .get(`${process.env.REACT_APP_API_URL}cart/find/${userID}`, {
                    params: {
                        status: "pending"
                    }
                })
                .then((res) => {
                    const data = res.data;
                    //console.log(data);
                    if (data === null || data.length === 0) {
                        axios
                            .post(`${process.env.REACT_APP_API_URL}cart/add`, newCart)
                            .then((res) => {
                                setCartId(res.data._id);
                                // const data = res.data;
                                // console.log(data);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else if (data.length > 0) {
                        //console.log("123");
                        const foundCartItems = data[0].products;
                        // console.log(foundCartItems.length);
                        // Kiểm tra cartItems chưa có giá trị
                        setCartItems(foundCartItems);
                        setCartId(data[0]._id);
                        //console.log(cartId);

                        //   setCartId(data[0]._id);
                        //   console.log("gắn giỏ hàng");

                    }
                })
                .catch((error) => {
                    console.log(error);
                });

            axios
                .get(`${process.env.REACT_APP_API_URL}order/find/${userID}`)
                .then((res) => {
                    if (res.data.length > 0) {
                        setHasOrder(true);
                        let hasIncompleteOrder = false;

                        res.data.forEach((order) => {
                            if (order.status !== "completed" || order.status !== "cancel") {
                                hasIncompleteOrder = true;
                                // Nếu tìm thấy đơn hàng chưa hoàn thành, thoát khỏi vòng lặp
                                return;
                            }
                        });

                        setHasIncompleteOrder(hasIncompleteOrder);
                    }

                })
                .catch((error) => {
                    console.log(error);

                });
        }
    }, [user])



    useEffect(() => {
        if (user) {
            const userID = user._id;
            const newCart = {
                userId: userID,
                products: cartItems
            };
            axios
                .put(`${process.env.REACT_APP_API_URL}cart/${cartId}`, newCart)
                .then((res) => {
                    // console.log("Cập nhật giỏ hàng thành công");
                    const id = res.data._id;
                    // console.log(id);
                    setCartId(id);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [cartItems]);



    /* eslint-disable */
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className="header_down-right-search-mobile">
                <div className="no-border drop-left-padding search-mobile">
                    <Search />
                </div>
            </div>
            <div className="header_down">
                <div className="header_down-scroll">
                    <div className="header_down-center-mobile">
                        <div className="header_down-menu-mobile">
                            <div className="icon-timelint" >
                                <button onClick={toggleMenu}>

                                    <FontAwesomeIcon icon={faBars} />
                                </button>
                                {isMenuOpen && (
                                    <ul className="menu-ul-mobile">
                                        <li className="header_down-menu-home-mobile"><Link to="/" >TRANG CHỦ</Link></li>
                                        <li className="header_down-menu-pages-mobile"><Link to="/ProductsMale" >NAM</Link>
                                            <FontAwesomeIcon icon={faChevronDown} />
                                            <ul className="subnav-mobile">
                                                {MBrands.map((brand) => (
                                                    <li key={brand}><Link to={`/ProductsMale/${brand}`}>{brand}</Link></li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="header_down-menu-pages-mobile"><Link to="/ProductsFemale">NỮ</Link>
                                            <FontAwesomeIcon icon={faChevronDown} />
                                            <ul className="subnav-mobile">
                                                {FBrands.map((brand) => (
                                                    <li key={brand}><Link to={`/ProductsFemale/${brand}`}>{brand}</Link></li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="header_down-menu-products-mobile"><Link to="/ProductList">SẢN PHẨM</Link>
                                        </li>
                                        <li className="header_down-menu-blog-mobile"><a href="/Aboutus">ABOUT US</a></li>
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="header_down-left">
                        <div className="header_down-logo">
                            <Link to="/">
                                <img src={require('../img/shoe.png')} alt="logo" className="logo-img" />SHOES(TQN)</Link>
                        </div>
                    </div>
                    <div className="header_down-center">
                        <div className="header_down-menu">
                            <ul className="menu-ul">
                                <li className="header_down-menu-home"><Link to="/">TRANG CHỦ</Link></li>
                                <li className="header_down-menu-pages"><Link to="/ProductsMale" >NAM</Link>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                    <ul className="subnav">
                                        {MBrands.map((brand) => (
                                            <li key={brand}><Link to={`/ProductsMale/${brand}`}>{brand}</Link></li>
                                        ))}
                                        {/* <li><a href="#">Hunter</a></li>
                                    <li><a href="#">Sandan</a></li>
                                    <li><a href="#">Media</a></li> */}
                                    </ul>
                                </li>
                                <li className="header_down-menu-pages"><Link to="/ProductsFemale">NỮ</Link>
                                    <FontAwesomeIcon icon={faChevronDown} />
                                    <ul className="subnav">
                                        {FBrands.map((brand) => (
                                            <li key={brand}><Link to={`/ProductsFemale/${brand}`}>{brand}</Link></li>
                                        ))}
                                        {/* <li><a href="#">Hunter</a></li>
                                    <li><a href="#">Sandan</a></li>
                                    <li><a href="#">Guốc</a></li> */}
                                    </ul>
                                </li>
                                <li className="header_down-menu-products"><Link to="/ProductList">SẢN PHẨM</Link>
                                </li>
                                <li className="header_down-menu-blog"><a href="/Aboutus">ABOUT US</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="header_down-right">
                        <div className="header_down-right-search">
                            <div className="item no-border drop-left-padding">
                                <Search />
                            </div>
                        </div>
                        <div className="header_down-right-cart">
                            <Link to="/Cart" onClick={handleRedirect}>
                                {isOpen ? (<Badge content={cartN}><FontAwesomeIcon icon={faShoppingCart} /></Badge>) : (<FontAwesomeIcon icon={faShoppingCart} />)}</Link>
                        </div>
                        {user && hasOrder ? (
                            <div className="header_down-right-order">
                                <Link to="/MyOrder">
                                    {hasIncompleteOrder ? (<Badge content={hasIncompleteOrder}><FontAwesomeIcon icon={faBell} /></Badge>) :
                                        (<FontAwesomeIcon icon={faBell} />)}</Link>
                            </div>) : (<></>)}

                    </div>
                </div>
            </div>
        </>
    );
}

export default Header_down;