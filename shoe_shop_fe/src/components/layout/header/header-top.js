//import './header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAmericas, faChevronDown, faMobile, faUser} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import React from 'react';

function Header_top(){
    const user = useSelector((state)=> state.auth.login.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const handleLogout = (e) =>{
    e.preventDefault();
    try {
        sessionStorage.clear();
      localStorage.clear();
      logOut(dispatch,navigate);
    } catch (error) {
      console.log(error);
    }
  }
    
    return(
        <div>
            <div className="header_top">
                <div className="header_top-left">
                    <div className="header_top-language">
                        <FontAwesomeIcon icon={faEarthAmericas} />
                        VietNam
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    <div className="header_top-unit">VND
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    <div className="header_top-hostline">
                        <FontAwesomeIcon icon={faMobile} />
                        123-456-789
                    </div>
                </div>
                <div className="header_top-right">
                    {/* <div className="header_top-wishlise">
                        <FontAwesomeIcon icon={faHeart} />
                        Yêu thích
                    </div> */}
                    {user? (
                        <>
                        <p className="header_top-hello"><FontAwesomeIcon icon={faUser} /> Hi, <span> {user.username}  </span> </p>
                        { user.isAdmin? (<> <Link to="/PageAdmin/" className="header_top-admin"> <span> Admin page </span> </Link> </>):(<></>)}
                                    <Link to="/" className="header_top-admin" onClick={handleLogout} >Đăng xuất</Link>
        
        </>
      ) : (<>
                    <div className="header_top-register"><Link to={"/Register"}>Đăng ký</Link></div>
                    <div className="header_top-login"><Link to={"/Login"}>Đăng nhập</Link></div></>)}
                </div>
            </div>
            <div className="center">
                <div className="box-shadow"></div>
            </div>
        </div>
    );
}

export default Header_top;