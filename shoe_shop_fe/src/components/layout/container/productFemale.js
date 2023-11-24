import './product.css'
import React, {useState, useEffect} from "react"
import { Link } from 'react-router-dom';
import {
    getProducts as getProductsApi,
    // getProduct as getProductApi,
    // editProduct as editProductApi,
    // deleteProduct as deleteProductApi,
} from "./productsAPI";
import { useParams } from "react-router-dom";


export const ProductFemale = () => {
    const { brand } = useParams();
window.onscroll = function () {
    var navbar = document.querySelector('.header_down');
    var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollPosition <= 20) {
        navbar.style.top = "40px";
    } else {
        navbar.style.top = "0";
    }
}
//const [productList, setProductList] = useState([])
const [filteredProductList, setFilteredProductList] = useState([]);


useEffect(() => {
    getProductsApi()
      .then((res) => {
        const dataList = res;
        const validGenders = ['F', 'Female', 'Women', 'Woman', 'Nữ', 'Unsex', ''];
        const filterData = dataList.filter((data) => validGenders.includes(data.gender));
        //setProductList(filterData);
  
        if (brand === undefined) {
          setFilteredProductList(filterData);
        } else {
          const filteredList = filterData.filter((product) => product.brand === brand);
          setFilteredProductList(filteredList);
        }
      });
  }, [brand]);

return (
    <div className="content">
        <div className="content_product">
            <div className="content_product-hot">
                <div className="content_product-hot-title">
                    <h3>Sản phẩm Nữ {brand && <span className="highlight">- {brand}</span>}</h3>
                </div>
                <div className="content-product-hot-list row">
                {filteredProductList && filteredProductList.map(product=>{
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
                    </div></>)})}
                </div>
            </div>
        </div>
    </div>
);
}

export default ProductFemale;