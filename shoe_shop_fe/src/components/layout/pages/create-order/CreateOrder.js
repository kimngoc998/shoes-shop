import React,{ useContext, useState, useEffect} from "react";
import { Link, useParams } from 'react-router-dom';
import './createorder.css'
import {CartContext}  from "../cart/CartContext"
import {MDBCheckbox,MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardImage, MDBCol, MDBContainer, MDBInput, MDBListGroup, MDBListGroupItem, MDBRow, MDBTextArea, MDBTypography } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import axios from "axios";

export default function CreateOrder() {
    const { cartItems} = useContext(CartContext);
    const grandTotal = cartItems.reduce((total, product)=>{
        return total += product.price*product.quantity
    },0)
    //const freeShippingPrice = 800000;
    const cartN = cartItems.reduce((total, item) => total + item.quantity, 0);
    const user = useSelector((state)=> state.auth.login.currentUser);
    const { cartId } = useParams();

    const [surname,setSurname] = useState("");
    const [name,setName] = useState("");
    const [address,setAddress] = useState("");
    const [phone,setPhone] = useState("");
    const [email,setEmail] = useState("");
    const [information,setInformation] = useState("");
    const [saveInfo, setSaveInfo] = useState(true);
    console.log(user.shipmentdetails[0])
    useEffect(() => {
    if(user.shipmentdetails[0] !== undefined){
      const details = user.shipmentdetails[0];
      setSurname(details.surname);
      setName(details.name);
      setAddress(details.address);
      setPhone(details.phone);
      setEmail(user.email);
      setInformation(user.information)
      setSaveInfo(false);
    }
  }, [user]);


    const handleSubmit = async (e) => {
      e.preventDefault();
      const saveInfoValue = saveInfo;
      console.log(saveInfoValue);
      if(saveInfoValue){
        const newShipmentdetails = {
          surname: surname,
          name: name,
          address: address,
          phone: phone,
          information: information
        };
        const shipmentdetails = {
          email: email,
          shipmentdetails: newShipmentdetails
        }
        axios
        .put(`${process.env.REACT_APP_API_URL}user/${user._id}`, shipmentdetails)
        .then(()=> {
          console.log("cập nhật thông tin thành công")
        })
         // eslint-disable-next-line
        .catch((error)=>{
          console.log("quá trình lưu thông tin giao hàng bị lỗi")
        })
      }

      const newShipmentdetailsOrder = {
        surname: surname,
        name: name,
        address: address,
        email: email,
        phone: phone,
        information: information
      };
      const newOrder = {
        cartId: cartId,
        userId: user._id,
        products: cartItems,
        amount: grandTotal,
        shipmentdetails: newShipmentdetailsOrder
      };
    console.log(newOrder);

    axios
    .post(`${process.env.REACT_APP_API_URL}order/add`, newOrder)
    .then(() => {
      alert("Đặt hàng thành công");
      sessionStorage.removeItem("cartId");
      localStorage.removeItem("cartItems");
      window.location.href = "/MyOrder"; 
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
        window.location.href = "/Cart/"+cartId; 
      } else {
        console.log("Đặt hàng không thành công");
      }
    });

    
  }

    return (
        <MDBContainer className="my-3 py-3" style={{maxWidth: '1300px'}}>
        <section>
          <MDBRow>
            <MDBCol md="8" className="mb-4">
            <form onSubmit={handleSubmit}>
              <MDBCard className="mb-4 border-2">
                <MDBCardHeader className="py-3">
                  <MDBTypography tag="h5" className="mb-0 text-font text-uppercase">Thông tin giao hàng</MDBTypography>
                </MDBCardHeader>
                <MDBCardBody>
                <MDBRow>
                  <MDBCol>
                    <MDBInput label='Họ' type='text' id="surname" name="surname" required value={surname||""} onChange={(e)=>setSurname(e.target.value)}/>
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label='Tên' type='text'id="name" name="name" required value={name||""} onChange={(e)=>setName(e.target.value)}/>
                  </MDBCol>
                </MDBRow><br />
                <MDBInput label='Địa chỉ' type='text'id="address" name="address" required value={address||""} onChange={(e)=>setAddress(e.target.value)}/><br />
                <MDBInput label='Email' type='text'id="email" name="email" required  value={email||""}  onChange={(e)=>setEmail(e.target.value)}/><br />
                <MDBInput label='Số điện thoại' type='text'id="phone" name="phone" required  value={phone||""}  onChange={(e)=>setPhone(e.target.value)}/><br />
                <MDBTextArea label='Thông tin thêm'id="information" name="information" rows={4} value={information||""} onChange={(e)=>setInformation(e.target.value)}/><br />

                <div className="d-flex justify-content-center">
                  {user.shipmentdetails[0] !== undefined ? (
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckChecked' label='Thay đổi thông tin ' checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)}/>):
                    (<MDBCheckbox name='flexCheck' value='' id='flexCheckChecked' label='Lưu thông tin' checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)}/>)}
                  {/* defaultChecked  */}
                </div>
                </MDBCardBody>
              </MDBCard>
              <div className="text-center">
              <MDBBtn className="button-order col-md-10" type="submit">Đặt hàng</MDBBtn>
              </div>
              </form>
            </MDBCol>

            <MDBCol md="4" className="mb-4 position-statics ">
              <MDBCard className="mb-4 border-2">
                <MDBCardHeader className="py-3">
                  <MDBTypography tag="h5" className="mb-0 text-font">
                    {cartN} Kiện <Link to="/Cart"  className="float-end mt-1" style={{ fontSize: '13px' }}>Sửa</Link>
                  </MDBTypography>
                </MDBCardHeader>
                {
                                    cartItems.map((product)=>(
                                //eslint-disable-next-line      
                <MDBCardBody>
                  <MDBRow key={product.productId} className="border-bottom border-grey">
                    <MDBCol md="4">
                      <MDBCardImage src={product.img}
                        className="rounded-3" style={{ width: '150px'}} alt={product.title} />
                    </MDBCol>
                    <MDBCol md="6" className="ms-3">
                      <span className="mb-0 text-price">{product.price.toLocaleString()} đ</span>
                      <p className="mb-0 text-descriptions">{product.title}</p>
                      <span className="text-descriptions fw-bold">{product.color}</span> <span
                        className="text-descriptions fw-bold">{product.size}</span>
                      <p className="text-descriptions mt-0">
                        Số lượng:<span className="text-descriptions fw-bold">{product.quantity}</span>
                      </p>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>))}
                <MDBCardFooter className="mt-1">
                  <MDBListGroup flush>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0 text-muted">
                    Tổng tiền
                      <span>{grandTotal.toLocaleString()} đ</span>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0 fw-bold text-uppercase">
                    Tổng tiền 
                      <span>{grandTotal.toLocaleString()} đ</span>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
  
          </MDBRow>
        </section>
      </MDBContainer>

    )
}