
import React, {useState, useEffect} from 'react';
import "./customerorder.css";
import "./manageOrder.css"
import Invoice from './Invoice';
import OrderDetail from './orderDetail';
//import { useSelector } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ManageOrder() {
    //const user = useSelector((state) => state.auth.login.currentUser);
    const [orders, setOrders] = useState([]);
    const [carts, setCarts] = useState([]);
    const [openDetail, setOpenDetail] = useState(null);
  
  
    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}order/`)
          .then((res) => {
            const data = res.data;
            const orders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(orders);
            setFilteredOrderList(orders);
          })
          .catch((error) => {
            console.log(error);
          });
          axios
          .get(`${process.env.REACT_APP_API_URL}cart/`)
          .then((res) => {
            const carts = res.data;
            setCarts(carts);
          })
          .catch((error) => {
            console.log(error);
          });  
    }, []);
  
  
  
    // const getOrderStatusWidth = (status) => {
    //   if (status === "pending") {
    //     return 25;
    //   } else if (status === "delivery") {
    //     return 55;
    //   } else if (status === "completed") {
    //     return 100;
    //   }
    // };
    const [selectedBtn, setSelectedBtn] = useState('all');
    const [filteredOrderList, setFilteredOrderList] = useState([]);
    useEffect(() => {
      if (selectedBtn ==='all') {
        setFilteredOrderList(orders);
      }else {
        setFilteredOrderList(
          orders.filter((order) => order.status === selectedBtn)
            );
      }
    }, [selectedBtn]);
    const handleBtn = (value) => {
      setSelectedBtn(value);
    }



return (
  <div className='manage-order'>
      <div className='manage-order-section'>
      <button type='button' value='all' className={`btn manage-btn ${selectedBtn === 'all' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Tất cả</button>
          <button type='button' value='pending' className={`btn manage-btn ${selectedBtn === 'pending' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đợi xác nhận</button>
          <button type='button' value='delivery' className={`btn manage-btn ${selectedBtn === 'delivery' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đang giao</button>
          <button type='button' value='completed' className={`btn manage-btn ${selectedBtn === 'completed' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đã hoàn thành</button>
          <button type='button' value='cancel' className={`btn manage-btn ${selectedBtn === 'cancel' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đã hủy</button>
      </div>
        <div className='manage-order-table'>
            <table className="table table-striped order-table">
            <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Ngày đặt hàng</th>
                  <th scope="col">Mã đơn hàng</th>
                  <th scope="col">Số kiện</th>
                  <th scope="col">Thanh toán</th>
                  <th scope="col">...</th>
                  </tr>
                </thead>
                <tbody>
                    {filteredOrderList.map((order, index) => {
                        const cart = carts.find((cart) => cart._id === order.cartId);
                        const totalQuantity = cart ? cart.products.reduce((accumulator, product) => accumulator + product.quantity, 0) : 0;       
                        //const Orderstatus = order.status;
                        //const widthStatus = getOrderStatusWidth(Orderstatus);
      
                        //const colorStop = Math.round((widthStatus / 100) * 100);
      
                        // const progressBarStyle = {
                        //   borderRadius: "16px",
                        //   background: `linear-gradient(to right, #8ef5ca ${colorStop}%, #017a48)`,
                        // };
    
                    return(<>
                        <tr key={index} className={openDetail === order._id ? 'selTr' : ''}>
                          <th scope="row">{index}</th>
                          <td>{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td>{order._id}</td>
                          <td>{totalQuantity}</td>
                          <td>COD - {order.amount.toLocaleString()} đ</td>
                          <td>{openDetail === order._id ? (<FontAwesomeIcon icon={faChevronDown}  onClick={() => setOpenDetail(null)}/>):
                          (<FontAwesomeIcon icon={faChevronDown} className='icon-container' onClick={() => setOpenDetail(order._id)}/>) 
                          }</td>
                          {/* <td><FontAwesomeIcon icon={faChevronDown} className={`${openDetail === order._id ? 'icon-container' : ''}`} onClick={() => setOpenDetail(order._id)}/></td> */}
                        </tr>{openDetail === order._id && 
                                <div className='order-detail'>
                                  {order.status !== "pending"  && order.status !== "cancel" ? <Invoice order={order} cart={cart}/> : <OrderDetail order={order} cart={cart}/>}
                                  </div>}
                            
                            </>)})}
                </tbody>
            </table>
        </div>
    </div>
  )
}
