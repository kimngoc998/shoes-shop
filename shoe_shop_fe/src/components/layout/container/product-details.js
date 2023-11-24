import './product.css'
import React, { useState, useEffect, useContext } from "react";
//import axios from 'axios';
import { useParams } from "react-router-dom";
import SimpleImageSlider from "react-simple-image-slider";
import { CartContext } from "../pages/cart/CartContext";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Comments from '../pages/comment/Comments';
import {
  getProduct as getProductApi,
} from "./productsAPI";
import PropTypes from 'prop-types';

function Product_Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetail, setProductDetail] = useState(null);
  const [sliderImages, setSliderImages] = useState(null);
  const [selectSwatch, setSelectwatch] = useState(null);
  const [rem, setRem] = useState(null);
  const [indexColor, setIndexColor] = useState("0");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const user = useSelector((state) => state.auth.login.currentUser);
  const [isOutOfStock, setIsOutOfStock] = useState(false);


  // useEffect(() => {
  //       axios
  //         .get(`${process.env.REACT_APP_API_URL}products/${id}`)
  //         .then((res) => {
  //           setProductDetail(res.data);
  //           setSliderImages(res.data.img);
  //           setSelectwatch(res.data.size_color_remaining);
  //           // const remaining = res.data.size_color_remaining.find((item) => item.remaining > 0);
  //           const sizeColorRemaining = res.data.size_color_remaining;
  //           const sizeRemaining = sizeColorRemaining[0].size_remaining;
  //           // console.log(sizeRemaining);
  //           const totalRemaining = sizeRemaining.reduce((accumulator, currentValue) => accumulator + currentValue.remaining, 0);
  //           // console.log(totalRemaining);
  //           if(totalRemaining < 1){
  //             setIsOutOfStock(true);
  //           }else{
  //             setIsOutOfStock(false);
  //           }
  //         })
  //         .catch(console.log);

  //    }, [id]);
  // console.log(isOutOfStock)

  useEffect(() => {
    getProductApi(id).then((res) => {
      setProductDetail(res);
      setSliderImages(res.img);
      setSelectwatch(res.packing);
      // const remaining = res.data.size_color_remaining.find((item) => item.remaining > 0);
      const sizeColorRemaining = res.packing;
      const sizeRemaining = sizeColorRemaining[0] ? sizeColorRemaining[0].size : [];
      // console.log(sizeRemaining);
      const totalRemaining = sizeRemaining.reduce((accumulator, currentValue) => accumulator + currentValue.remaining, 0);
      // console.log(totalRemaining);
      if (totalRemaining < 1) {
        setIsOutOfStock(true);
      } else {
        setIsOutOfStock(false);
      }
    })

  }, [id]);


  /* eslint-disable */
  function QuantityBtn({ productInfo }) {

    const { cartItems, setCartItems } = useContext(CartContext)
    let productIndexInCart = cartItems.findIndex((element) => {
      return element.id === productInfo.productId;
    });


    let [numInCart, setNumInCart] = useState(
      (productIndexInCart === -1) ? 0 : cartItems[productIndexInCart].quantity
    )


    const handleAdd = () => {
      if (user) {
        const newItem = {
          productId: productDetail._id,
          title: productDetail.title,
          price: productDetail.price,
          img: productDetail.img[0],
          color: selectedColor,
          size: selectedSize,
          gender: productDetail.gender,
          quantity: 1,
        };

        const existingItemIndex = cartItems.findIndex(
          (item) =>
            item.productId === productDetail._id &&
            item.color === selectedColor &&
            item.size === selectedSize
        );

        if (existingItemIndex !== -1) {
          const updatedCartItems = cartItems.map((item, index) => {
            if (index === existingItemIndex) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }
            return item;
          });
          setCartItems(updatedCartItems);
        } else {
          setCartItems([newItem, ...cartItems]);
        }
      } else {
        alert("Vui lòng đăng nhập")
        navigate("/login")
      }
    };


    return (
      selectedSize && selectedColor ? (
        <button className="btn-product s-col-full js-buy-ticket" onClick={handleAdd} >MUA NGAY</button>
      ) : (
        <button className="btn-product s-col-full js-buy-ticket" disabled>MUA NGAY</button>
      ))
  }
  QuantityBtn.propTypes = {
    productInfo: PropTypes.object.isRequired,
  };

  return (
    <>
      {productDetail && (
        <div className='main'>
          <div className="content">
            <div className="content_main">
              <div className="content_container row">
                <div className="content_container-img col-lg-6 col-md-12 col-12 ">
                  <div className='custom-class'>
                  {sliderImages && sliderImages.length > 0 && (
                    <SimpleImageSlider width={500} height={500} images={sliderImages} showNavs={true} />)}
                  </div>
                </div>
                <div className="content_container-information col-lg-5 col-md-12 col-12">
                  <div className="content_container-body">
                    <h3 className="place-time">{productDetail.title}</h3>
                    <h4 className="place-desc" >{productDetail.price.toLocaleString()} đ</h4>
                    <p>Thương hiệu: <strong>{productDetail.brand}</strong>  -{productDetail.category}</p>
                    <p>Tình trạng: New</p>
                    <p>Giao hàng và thanh toán:
                      Giao hàng toàn quốc và thanh toán khi nhận hàng. Bạn có thể kiểm tra sản phẩm.</p>
                    <p>Tặng hộp giày thay thế.</p>
                    <div className="select-swatch">
                      {isOutOfStock ? (
                        <p >Tình trạng : <span className="out-of-stock-label">Hết hàng </span></p>) : (<p>Tình trạng : {rem}</p>)}
                      <div className="select-swatch-color">
                        <div className="select-swatch-color-item">
                          {selectSwatch && selectSwatch.length > 0 && selectSwatch.map((item, index) => {
                            return (<>
                              <input key={index} type="radio" id={"color" + index} name="color" value={item._id} checked={index === indexColor} onChange={() => { setIndexColor(index); setSelectedColor(item.color) }} />
                              <label htmlFor={"color" + index}>{item.color}</label></>
                            );
                          })}

                        </div>
                        {isOutOfStock ? (<>
                          <div className="select-swatch-color-size-item">
                            {selectSwatch && selectSwatch.length > 0 && selectSwatch[indexColor].size.map((item, index) => {
                              return (<>
                                <input key={index} type="radio" id={"size" + item.value} name="size" value={item.value} onChange={() => { setSelectedSize(item.value) }} />
                                <label htmlFor={"size" + item.value}>{item.value}</label>
                              </>
                              );
                            })}
                          </div>
                        </>) : (<>
                          <div className="select-swatch-color-size-item">
                            {selectSwatch && selectSwatch.length > 0 && selectSwatch[indexColor].size.map((item, index) => {

                              return (<>
                                {item.remaining > 0 ? (
                                  <>
                                    <input key={index} type="radio" id={"size" + item.value} name="size" value={item.value} onChange={() => { setSelectedSize(item.value); setRem(item.remaining) }} />
                                    <label htmlFor={"size" + item.value}>{item.value}</label>
                                  </>
                                ) : (
                                  <>
                                    <input key={index} type="radio" id={"size" + item.value} name="size" disabled value={item.value} onChange={() => { setSelectedSize(item.value); setRem(item.remaining) }} />
                                    <label className="disabled-label" htmlFor={"size" + item.value}>{item.value}</label>
                                  </>
                                )}</>
                              );
                            })}
                          </div>
                        </>)}

                      </div>
                    </div>
                  </div>
                  {isOutOfStock ? (
                    <button className="btn-product s-col-full js-buy-ticket" disabled>
                      HẾT HÀNG
                    </button>
                  ) : (
                    <QuantityBtn productInfo={productDetail} />
                  )}

                </div>
              </div>
            </div>

            <div className="content_container-details">
              <h3>Mô tả sản phẩm</h3>
              <p>{productDetail.description}</p>
              <h3>Bảng kích cỡ của giày</h3>
                        {productDetail.brand === "Nike" && (
                        <img src={require('../img/size/nike.jpg')} className="img-size" alt="size"/>
                        )}
                        {productDetail.brand === "Adidas" && (
                        <img src={require('../img/size/adidas.jpg')} className="img-size" alt="size" />
                        )}
                        {productDetail.brand === "New Balance" && (
                        <img src={require('../img/size/newbalance.jpg')} className="img-size" alt="size" />
                        )}
                        {productDetail.brand !== "Nike" && productDetail.brand !== "Adidas" && productDetail.brand !== "New Balance" && (
                          <img src={require('../img/size/all.jpg')} className="img-size" alt="size" />
                        )}
            </div>
          </div>
        </div>
      )}
      <Comments user={user} productId={id} />
    </>
  )
}

export default Product_Details;
