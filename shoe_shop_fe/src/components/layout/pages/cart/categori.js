import './categori.css';
import {Link} from 'react-router-dom'
import {CartContext}  from "./CartContext"
import React,{ useContext} from "react"

function Categori() {

    const { cartItems, setCartItems } = useContext(CartContext);
    const cartId = sessionStorage.getItem("cartId");

    // const handleRedirect = () => {
    //     // Navigate to the /Cart page with the cartId passed as a URL parameter
    //     window.location.href = `/CreateOrder/${cartId}`;
    //   };

    const cartEmpty = cartItems.length<=0 ? true : false;

    
    const grandTotal = cartItems.reduce((total, product)=>{
        return total += product.price*product.quantity
    },0)
    // const freeShippingPrice = 800000

    const handleAdd = (index) => {
        const updatedCartItems = [...cartItems];
        const item = updatedCartItems[index];
        item.quantity++;

        setCartItems(updatedCartItems);
      };

      const handleSubtract =(index) =>{
        const updatedCartItems = [...cartItems]; 
        const item = updatedCartItems[index]; 

        if(item.quantity === 1){
            let newCartArray = [...cartItems]
            newCartArray.splice(index,1)
            setCartItems(newCartArray)
        }else{ 
            const updatedCartItems = [...cartItems];
            const item = updatedCartItems[index];
            item.quantity--;
            setCartItems(updatedCartItems);}
        }


    


    return (
            <>
            <h1>Giỏ Hàng</h1>

            {
                cartEmpty && 
                <div>
                    <div className="nothingInCart">Giỏ hàng không có sản phẩm<br/><br/>
                    <Link to="/">Xem sản phẩm</Link></div> :
                </div>
            }

            {
                !cartEmpty &&
                <div className="container">
                    <div className="cartSection">
                        <table className="checkoutTable" id="checkoutTable">
                            <tbody>
                                {
                                    cartItems.map((product,index)=>(
                                        <tr key={product.productId}>
                                            <td className='td-img'>
                                                <Link to={"/products/" + product.productId}>
                                                  <img src={product.img} alt={product.title} value={product.productId}/>
                                                </Link>
                                            </td>
                                            <td className='td-product'>
                                                <p>Sản Phẩm : <span className='text-bold'>{product.title} </span></p>
                                                <p>Giá : <span className='text-bold'>{product.price.toLocaleString()}</span> đ</p>
                                                <p>Màu : <span className='text-bold'>{product.color}</span></p>
                                                <p>Kích cỡ : <span className='text-bold'>{product.size}</span></p>
                                            </td>
                                            <td className='td-cart'>
                                            <div className='addToCart'>
                                                <span className="subtractBtn" onClick={()=>handleSubtract(index)}>-</span>
                                                <span className='text-green'>{product.quantity}</span>
                                                <span className="addBtn" onClick={()=>handleAdd(index)}>+</span>
                                            </div>
                                            </td>
                                            <td className='td-SubTotal'>
                                                <div className="productSubTotal">
                                                {(product.price * product.quantity).toLocaleString()}đ
                                                </div>
                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="checkoutSection">
                        <div>Tổng tiền</div>
                        <div className="grandTotal text-red">{grandTotal.toLocaleString()} đ</div>
                        {/* {
                            grandTotal >= freeShippingPrice ? 
                            <div className="freeShipping">✔️Giao hàng miễn phí</div> :
                            <div className="noShipping">Đơn hàng từ {freeShippingPrice.toLocaleString()}đ sẽ được giao hàng miễn phí</div>
                        } */}
                        <div className="freeShipping">✔️Giao hàng miễn phí</div>
                        <Link to={`/CreateOrder/${cartId}`}>
                        <button type='submit'>Đặt hàng</button></Link>
                    </div>
                </div> 
            }

        </>
    )
}

export default Categori;