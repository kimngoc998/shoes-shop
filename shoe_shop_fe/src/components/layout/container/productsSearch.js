import './product.css'
import React, {useState, useEffect} from "react"
import { Link } from 'react-router-dom';
// import {
//     getProducts as getProductsApi
// } from "./productsAPI";
import { useParams } from "react-router-dom";
import axios from "axios";

export const ProductMale = () => {
    const { search } = useParams();
    window.onscroll = function () {
        var navbar = document.querySelector('.header_down');
        var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition <= 20) {
            navbar.style.top = "40px";
        } else {
            navbar.style.top = "0";
        }
    }
    const [productList, setProductList] = useState([])
    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API_URL}search/${search}`)
        .then((res) => {
            setProductList(res.data);
        })
        .catch((error) => {
          console.error(error);
        });

    },[search])
    // const handleSearchInput = () => {
    //     axios
    //       .get(`${process.env.REACT_APP_API_URL}search/${searchInput}`)
    //       .then((res) => {
    //         console.log(res);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       });
    //   };



    return (
        <div className="content">
            <div className="content_product">
                <div className="content_product-hot">
                    <div className="content_product-hot-title">
                        <h3>Tìm kiếm {search && <span className="highlight">- {search}</span>}</h3>
                    </div>
                    <div className="content-product-hot-list row">
                    {productList.length > 0 && productList.map(product=>{
                        let isOutOfStock = false;
                        const sizeColorRemaining = product.packing;
                        const sizeRemaining =  sizeColorRemaining[0] ? sizeColorRemaining[0].size : [];
                        // console.log(sizeRemaining);
                        const totalRemaining = sizeRemaining.reduce((accumulator, currentValue) => accumulator + currentValue.remaining, 0);
                         //console.log(totalRemaining);
                        if(totalRemaining < 1){
                        isOutOfStock = true;
                        }
                        return(<>
                        <div key={product._id} className="col-12 col-md-4 col-sm-6 col-lg-3">
                            <Link to={`/Product/${product._id}`} className="product-link">
                            <img src={product.img[0]} alt="" className="product-img" />
                            <div className="place-body">
                                <h3 className="place-heading">Giày {product.brand} {product.category}</h3>
                                <p className="place-time">{product.title}</p>
                                {isOutOfStock ? (<>
                                <p className="place-desc-outofstock">Sold out</p>
                                 <button className="btn-product s-col-full js-buy-ticket">XEM</button>
                                 </>) : (<>
                                 <p className="place-desc">{product.price.toLocaleString()} đ</p>
                                 <button className="btn-product s-col-full js-buy-ticket">MUA NGAY</button></>)}
                                
                            </div>
                            </Link>
                        </div></>)}

                        )}
                     {productList.length === 0 && (<h2>Không có sản phẩm liên quan</h2>)}
                    </div>
                </div>
            </div>
        </div>
    );
}

    export default ProductMale;