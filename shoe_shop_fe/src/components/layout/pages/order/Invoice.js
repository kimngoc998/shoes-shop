import React, { useState, useRef }  from 'react'
import "./manageOrder.css"
import { format } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {  faPenToSquare, faPrint } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useReactToPrint} from 'react-to-print';
import PropTypes from 'prop-types';
function Invoice({order, cart}) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Invoice',
    onAfterPrint: () => {
      alert("Print success");
    }
  })

    const formattedDate = (date) => {
        return format(new Date(date), 'do MMMM yyyy', { locale: viLocale });
      };
      const totalQuantity = cart ? cart.products.reduce((accumulator, product) => accumulator + product.quantity, 0) : 0;

      const [showForm, setShowForm] = useState(false);
      const [status, setStatus] = useState(order.status);
      const [orderCode, setOrderCode] = useState('');
    
      const handleIconClick = () => {
        setShowForm(true);
      };
    
      const handleSubmit = () => {
        // Xử lý logic khi submit form
        axios.put(`${process.env.REACT_APP_API_URL}order/${order._id}`, {
          status: status
        })
        // eslint-disable-next-line
        .then((res) => {
          setShowForm(false);
          // eslint-disable-next-line
        }).catch((err) => {
          alert("Error");
        })
      };
    
      const handleCancel = () => {
        setShowForm(false);
      };

  return (<>
<div className="container-order-detail" ref={componentRef}>
    <table className="fullPadding" width="100%" border="0" cellPadding="0" cellSpacing="0" align="center">
                  <tbody>
                    <tr>
                      <td>
                        <table className="col" width="45%" border="0" cellPadding="0" cellSpacing="0" align="left">
                          <tbody>
                            <tr>
                              <td align="left"> <img className="logo" src={require('../../img/shoe.png')} alt="logo" border="0" /></td>
                            </tr>
                            <tr>
                              <td className="header-text-left">
                                Chào, <strong>{order.shipmentdetails.name} {order.shipmentdetails.surname}</strong>.
                                <br /> Cảm ơn quý khách đã mua sắm từ cửa hàng của chúng tôi.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="col" width="45%" border="0" cellPadding="0" cellSpacing="0" align="right">
                          <tbody>
                            <tr>
                              <td className="header-text-right" style={{color: 'red' ,fontSize: '28px'}}>
                              Hóa đơn
                              </td>
                            </tr>
                            <tr className="hiddenMobile">
                              <td height="50"></td>
                            </tr>
                            <tr className="visibleMobile">
                              <td height="20"></td>
                            </tr>
                            <tr>
                              <td className="header-text-right" style={{fontSize: '15px'}}>
                                Đơn hàng: {order._id}
                                <br /> <br />
                                <small>{formattedDate(order.createdAt)}</small>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
    </table>

  <table className="order-detail-table" width="100%">
    <thead>
      <tr>
        <th style={{ textAlign: 'left' }}>Sản phẩm</th>
        <th>Màu</th>
        <th>Kích cỡ</th>
        <th>Số lượng</th>
        <th>Giá trị</th>
      </tr>
    </thead>
    {cart.products && cart.products.map((product, index) => {
  return (
    <tbody key={index}>
      <tr>
        <td style={{ textAlign: 'left' }}>{product.title}</td>
        <td>{product.color}</td>
        <td>{product.size}</td>
        <td>{product.quantity}</td>
        <td>{(product.price * 0.92).toLocaleString()}đ</td>
      </tr>
    </tbody>
  );
})}
  </table>

  <table className="total-table" width="100%" border="0" cellPadding="0" cellSpacing="0" align="center">
    <tbody>
      <tr>
        <td className="subtotal" align="right">
          Tống giá trị
        </td>
        <td className="subtotal-value" align="right">
        {(order.amount * 0.92).toLocaleString()} đ
        </td>
      </tr>
      <tr>
        <td className="grand-total" align="right">
          <strong>Tổng cộng (Đã bao gồm thuế)</strong>
        </td>
        <td className="grand-total-value" align="right">
          <strong>{order.amount.toLocaleString()} đ</strong>
        </td>
     </tr>
      <tr>
        <td className="tax" align="right">
          <small>Thuế</small>
        </td>
        <td className="tax-value" align="right">
          <small>{(order.amount * 0.08).toLocaleString()} đ</small>
        </td>
      </tr>
      <tr>
        <td className="subtotal" align="right">
          Tổng kiện
        </td>
        <td className="subtotal-value" align="right">
        {totalQuantity}
        </td>
      </tr>
      <tr height="30"></tr>
    </tbody>
  </table>
  <table width="50%" border="0" cellPadding="0" cellSpacing="0" align="left" className="col">
  <tbody>
    <tr>
      <td style={{ fontSize: "14px",  color: "#5b5b5b", lineHeight: "1", verticalAlign: "top" }}>
        <strong>THÔNG TIN VẬN CHUYỂN</strong>
      </td>
    </tr>
    <tr>
      <td style={{ fontSize: "14px",  color: "#5b5b5b", lineHeight: "20px", verticalAlign: "top" }}>
        Đơn hàng của {order.shipmentdetails.name} {order.shipmentdetails.surname}<br/>
        Địa chỉ nhận hàng: {order.shipmentdetails.address}<br/> 
        Số điện thoại: {order.shipmentdetails.phone}<br/>
        Email: {order.shipmentdetails.email}<br/>
      </td>
    </tr>
  </tbody>
</table>


<table width="50%" border="0" cellPadding="0" cellSpacing="0" align="right" className="col">
  <tbody>
    <tr>
      <td style={{ fontSize: "14px",  color: "#5b5b5b", lineHeight: "1", verticalAlign: "top" }}>
        <strong>PHƯƠNG THỨC THANH TOÁN</strong>
      </td>
    </tr>
    <tr>
      <td width="100%" height="10"></td>
    </tr>
    <tr>
      {/* <td style={{ fontSize: "14px",  color: "#5b5b5b", lineHeight: "20px", verticalAlign: "top" }}>
        Credit Card<br/> Credit Card Type: Visa<br/> Worldpay Transaction ID: <a href="#" style={{ color: "#ff0000", textDecoration: "underline" }}>4185939336</a><br/>
        <a href="#" style={{ color: "#b0b0b0" }}>Right of Withdrawal</a>
      </td> */}
            <td style={{ fontSize: "14px",  color: "#5b5b5b", lineHeight: "20px", verticalAlign: "top" }}>
        Tiền mặt<br/> Thanh toán khi nhận hàng<br/>
      </td>
    </tr>
  </tbody>
</table>

            {/* <table width="100%" border="0" cellPadding="0" cellSpacing="0" align="center" className="fullPadding">
              <tbody>
                <tr>
                  <td style={{ fontSize: "18px", color: "#5b5b5b",  lineHeight: "18px", verticalAlign: "top", textAlign: "center" }}>
                    Have a nice day.
                  </td>
                </tr>
              </tbody>
            </table> */}


</div>
<div className='control-order'>
      <button type='button' className='btn btn-control-order' onClick={handleIconClick}><FontAwesomeIcon icon={faPenToSquare} /></button>
      <button type='button' className='btn btn-control-order' onClick={handlePrint}><FontAwesomeIcon icon={faPrint} /></button>
      {showForm && (
        <div className="order-upload">
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Đang cho xác nhận</option>
                <option value="delivery">Gửi hàng</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancel">Hủy đơn hàng</option>
          </select><br />
           <input type="text" placeholder="Mã đơn hàng" value={orderCode} onChange={(e) => setOrderCode(e.target.value)} required/><br/>
          <button type='submit' className='btn btn-primary' onClick={handleSubmit}>Submit</button>
          <button type='button' className='btn btn-light' onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>

    </>
  )
}
Invoice.propTypes = {
  order: PropTypes.object.isRequired,
  cart: PropTypes.array.isRequired,
};
export default Invoice
