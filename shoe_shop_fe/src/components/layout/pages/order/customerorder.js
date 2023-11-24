import React, {useEffect, useState} from 'react';
import "./customerorder.css";
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {  faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';


export default function Customerorder() {
  const user = useSelector((state) => state.auth.login.currentUser);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);

useEffect(() => {
  if (user) {
    const userID = user._id;
    axios
      .get(`${process.env.REACT_APP_API_URL}order/find/${userID}`)
      .then((res) => {
        const orders = res.data;
        setOrders(orders);
      })
      .catch((error) => {
        console.log(error);
      });
      axios
      .get(`${process.env.REACT_APP_API_URL}cart/find/${userID}`, {
        params: {
          status: "completed", // Replace "completed" with the desired status
        },
      })
      .then((res) => {
        const carts = res.data;
        setCarts(carts);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}, [user]);





  const getOrderStatusWidth = (status) => {
    if (status === "pending") {
      return 25;
    } else if (status === "delivery") {
      return 55;
    } else if (status === "completed" || status === "cancel") {
      return 100;
    }
  };
  

  return (
    <>
      <section className="h-100 gradient-custom" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBCardHeader className="px-4 py-5">
            <MDBTypography tag="h5" className="text-muted mb-0">
              Cảm ơn đơn hàng của bạn,{" "}
              <span style={{ color: "#a8729a" }}>{user?.username}</span>!
            </MDBTypography>
          </MDBCardHeader>
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol lg="10" xl="8">
            {orders.map((order1, index1) => {
                  const cartId = order1.cartId;        
                  const products = carts.find((cart) => cart._id === cartId);
                  // console.log(products);
                  const Orderstatus = order1.status;
                  const widthStatus = getOrderStatusWidth(Orderstatus);

                  const colorStop = Math.round((widthStatus / 100) * 100);

                  const progressBarStyle = {
                    borderRadius: "16px",
                    background: `linear-gradient(to right, #8ef5ca ${colorStop}%, #017a48)`,
                  };

                  const progressBarStylecancel = {
                    borderRadius: "16px",
                    background: `#fa4807`,
                  };

                  const totalQuantity = products ? products.products.reduce((accumulator, product) => accumulator + product.quantity, 0) : 0;

                  return (
            
              <MDBCard style={{ borderRadius: "10px", marginBottom: "20px"  }}  key={index1}>
                  <MDBCardBody className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      {order1.status === "completed" && (
                        <div className="alert alert-success mb-0" role="alert" style={{ display: "flex", alignItems: "center" }}>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: "2rem", marginRight: "1rem" }} />
                        <div>
                          <p style={{ marginBottom: "0" }}>ĐÃ HOÀN THÀNH: {new Date(order1.updatedAt).toLocaleDateString()} {new Date(order1.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.</p>
                        </div>
                      </div>
                        )}
                      {order1.status === "cancel" && (<p className="lead fw-normal mb-0" style={{ color: "#e61e46" }}>Đơn hàng đã hủy: {new Date(order1.updatedAt).toLocaleDateString()} {new Date(order1.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>)}
                      
                        {order1.status !== "completed" && order1.status !== "cancel" && (<p className="lead fw-normal mb-0" style={{ color: "#a8729a" }}>Đơn hàng chưa hoàn thành</p>)}
                      {/* <div><FontAwesomeIcon icon={faExclamationCircle} /></div> */}
                      <p className="small text-muted mb-0">
                        Người nhận: {order1.shipmentdetails.surname} {order1.shipmentdetails.name} <br />
                        Điện thoại: {order1.shipmentdetails.phone} <br />
                        Địa chỉ nhận hàng : {order1.shipmentdetails.address} <br />
                      </p>
                    </div>
                    <MDBCard className="shadow-0 border mb-4">
                      {products && products.products.map((item, index) => (
                        <MDBCardBody key={index}>
                          <MDBRow>
                            <MDBCol md="2">
                              <MDBCardImage src={item.img} fluid alt={item.brand} />
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0">{item.title}</p>
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">Màu: {item.color}</p>
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">Size: {item.size}</p>
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">
                                {item.gender === "F" || item.gender === "Female" || item.gender === "women" || item.gender === "Woman" ? (
                                  "Giày: Nữ"
                                ) : item.gender === "M" || item.gender === "Male" || item.gender === "man" || item.gender === "men" ? (
                                  "Giày: Nam"
                                ) : (
                                  "Giày: Unsex"
                                )}
                              </p>
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">Qty: {item.quantity}</p>
                            </MDBCol>
                            <MDBCol md="2" className="text-center d-flex justify-content-center align-items-center">
                              <p className="text-muted mb-0 small">{item.price.toLocaleString()} đ</p>
                            </MDBCol>
                          </MDBRow>
                          <hr className="mb-4" style={{ backgroundColor: "#e0e0e0", opacity: 1 }} />
                        </MDBCardBody>
                      ))}
                      <MDBRow className="align-items-center">
                          <MDBCol md="2">
                            <p className="text-muted mb-4 small">Tình trạng:</p>
                          </MDBCol>
                          {Orderstatus === "cancel" && (<>
                          <MDBCol md="10">
                            <MDBProgress
                              style={{ height: "6px", borderRadius: "16px" }}
                            >
                              <MDBProgressBar
                                style={progressBarStylecancel}
                                width={widthStatus}
                                valuemin={0}
                                valuemax={100}
                              />
                            </MDBProgress>
                            <div className="d-flex justify-content-around mb-1">
                                <p className="text-muted mt-1 mb-0 small ms-xl-5" style={{ fontWeight: "bold" }}>
                                Đơn hàng đã hủy
                              </p>
                            </div>
                          </MDBCol>
                          </>)}
                          {Orderstatus !== "cancel" && (<>
                          <MDBCol md="10">
                            <MDBProgress
                              style={{ height: "6px", borderRadius: "16px" }}
                            >
                              <MDBProgressBar
                                style={progressBarStyle}
                                width={widthStatus}
                                valuemin={0}
                                valuemax={100}
                              />
                            </MDBProgress>
                            <div className="d-flex justify-content-around mb-1">
                              
                                <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                Đang xử lý
                              </p>
                              <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                Đang giao hàng
                              </p>
                              <p className="text-muted mt-1 mb-0 small ms-xl-5">
                                Đơn hàng đã hòa thành
                              </p>

                            </div>
                          </MDBCol>
                          </>
                        )}
                        </MDBRow>
                    </MDBCard>
                    <div className="d-flex justify-content-between pt-2">
                      <p className="fw-bold mb-0">Thông tin đơn hàng</p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-1">Giá trị hàng:</span> {(order1.amount * 0.92).toLocaleString()} đ
                      </p>
                    </div>
                    <div className="d-flex justify-content-between pt-2">
                      <p className="text-muted mb-0">Số hóa đơn : {order1._id} </p>
                      <p className="text-muted mb-0">
                      <span className="fw-bold me-5">Số kiện hàng: </span>{totalQuantity}  Kiện
                    </p>
                    </div>
  
                    <div className="d-flex justify-content-between">
                      <p className="text-muted mb-0">
                      Ngày đặt hàng: {new Date(order1.createdAt).toLocaleDateString()} {new Date(order1.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-3">Thuế 8%: </span> {(order1.amount * 0.08).toLocaleString()} đ
                      </p>
                    </div>
  
                    <div className="d-flex justify-content-between">
                      <p className="text-muted mb-0">
                        Phương thức thanh toán : Thanh toán khi nhận hàng
                      </p>
                      <p className="text-muted mb-0">
                        <span className="fw-bold me-4">Giao hàng: </span>{" "}
                        Miễn phí
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mb-0 mt-1 exclamation">
                    <p className="text-muted" style={{ fontSize: "1.1rem"}}>
                    <FontAwesomeIcon icon={faExclamationCircle} className="exclamation-icon"/> Nếu có vấn đề về đơn hàng vui lòng liên hệ ngay với chúng tôi:{" "}
  <a href="mailto:support@tqn.com">support@tqn.com</a>
                    </p>
                  </div>
                  <MDBCardFooter
                    className="border-0 px-4 py-5"
                    style={{
                      backgroundColor: "#8a8888",
                      borderBottomLeftRadius: "10px",
                      borderBottomRightRadius: "10px",
                    }}
                  >
                    <MDBTypography
                      tag="h4"
                      className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0"
                    >
                        Thành tiền: <span className="h2 mb-0 ms-2">{(order1.amount || 0).toLocaleString()} đ</span>
                    </MDBTypography>
                  </MDBCardFooter>
                  </MDBCardBody>
                </MDBCard>)})}
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </>
    );
  }