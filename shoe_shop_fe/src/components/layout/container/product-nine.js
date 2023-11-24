import './product.css'
import React, {useState, useEffect} from "react"
import { Link } from 'react-router-dom';
import {
    getProducts as getProductsApi,
} from "./productsAPI";
// import {
//     getProducts as getProductsApi,
//     getProduct as getProductApi,
//     editProduct as editProductApi,
//     deleteProduct as deleteProductApi,
// } from "./productsAPI";


function ProductNine() {

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
    // const [categories, setCategories] = useState([])
    // useEffect(()=>{
    //     axios.get(`${process.env.REACT_APP_API_URL}products/`)
    //         .then((res) => {
    //             setProductList(res.data)
    //           })
    //           .catch((error) => {
    //             console.log(error);
    //           });
    // },[])

    useEffect(() => {
        getProductsApi().then((res) => {
            const sortedProducts = res.sort((a, b) => {
                // Sắp xếp theo createdAt mới nhất
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
            
              setProductList(sortedProducts);
            //setProductList(res);
            
            // phân loại theo category
            // if(selectedCategory===null){
            //     setFilteredProductList(res)
            // }
        })
    },[])
    //     const uniqueCategories = productList?.reduce((categories, product) => {
    //     if (!categories.includes(product.category)) {
    //       categories.push(product.category);
    //     }
    //     //console.log(categories);
    //     return categories;
    //   }, [])

    //   const [selectedCategory, setSelectedCategory] = useState(null);
    //   const [filteredProductList, setFilteredProductList] = useState([]);
    //   const handleCategory = (category) => {
    //     setSelectedCategory(category);
    //     //console.log(category);
    //   }


    //   useEffect(() => {
    //     if (selectedCategory===null) {
    //         setFilteredProductList(productList);

    //     } else {
    //         setFilteredProductList(
    //             productList.filter((product) => product.category === selectedCategory)
    //           );
    //     }
    //   }, [selectedCategory]);


    return (
        <div className="content">
            <div className="content_product">
                {/* <div className="content_cate">
                    <p className="p-cate">Phân loại: </p>
                    <button className={`btn-cate ${selectedCategory === null ? 'success' : 'default'}`} onClick={() => handleCategory(null)}>Tất cả</button>
                    {uniqueCategories && uniqueCategories.map((category, index) => (
                    <React.Fragment key={index}>
                    <button className={`btn-cate ${selectedCategory === category ? 'success' : 'default'}`} onClick={() => handleCategory(category)}>{category}</button>        
                    </React.Fragment>
                    ))}
                </div> */}

                <div className="content_product-hot">
                    <div className="content_product-hot-title">
                        <h3>Sản phẩm nổi bật</h3>
                    </div>
                    <div className="content-product-hot-list row">
                    {/* {filteredProductList.map(product=>{ */}
                    {productList.map(product=>{
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



export default ProductNine;