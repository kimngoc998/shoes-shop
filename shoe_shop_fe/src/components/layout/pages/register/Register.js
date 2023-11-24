import React, {useState} from 'react';
import "./register.css"
import { Link , useNavigate} from "react-router-dom";
import { registerUser } from '../../../../redux/apiRequest';
import { useDispatch } from 'react-redux';
import useConfirmExit from '../../../useConfirmExit';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEye , faEyeSlash} from '@fortawesome/free-solid-svg-icons';


const Register = () => {
    useConfirmExit();
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cfpassword, setCfpassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [mes, setMes] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    const newUser = {
        username : username,
        password : password,
        email : email
    };
    const reg = await registerUser(newUser, dispatch);
    if(reg){
        setMes(newUser.username +" Đang ký thành công!");
        setError(true);
        setTimeout(() =>navigate("/login"),500);
    }else{
        setMes("Tên đăng nhập hoặc email đã tồn tại");
        setError(true);
        setTimeout(() =>setError(false),2000)
    }
};
 


    return (
       <>
       <section>
        <div className='register-box'>
            <h2>Đăng ký</h2>
            {error? (<><div className='mess-Log'><p>{mes}</p></div></>):(<>
            <form onSubmit={handleSubmit} autoComplete="on">
                <div className="user-box">
                    <input type="text" id="username"  name="username"  onChange={(e) => setUsername(e.target.value)} value={username} required/>
                    <label>Tên đăng nhập</label>
                </div>
                <div className="user-box">
                    <input type="email" id="email" name="email" size="65" pattern='.+@gmail.com' onChange={(e) => setEmail(e.target.value)} value={email} autoComplete="off" required/>
                    <label>Email</label>
                </div>
                <div className="user-box">
                    <input type={isPasswordShown ? "password" : "text"} id="password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} required/>
                    <label>Mật khẩu</label>
                    {
              isPasswordShown === true ? (
                                  <FontAwesomeIcon icon={faEyeSlash} className="eye-icon" onClick={() => setIsPasswordShown(false)}/>
                                ) : (
                                  <FontAwesomeIcon icon={faEye} className="eye-icon" onClick={() => setIsPasswordShown(true)}/>
                                )
                            }
                </div>
                <div className="user-box">
                    <input type={isPasswordShown ? "password" : "text"} id="cfpassword" pattern={password} name="cfpassword" onChange={(e) => setCfpassword(e.target.value)} value={cfpassword} title="Confirm password must be the same password" required/>
                    <label>Nhập lại mật khẩu</label>
                    {
              isPasswordShown === true ? (
                                  <FontAwesomeIcon icon={faEyeSlash} className="eye-icon" onClick={() => setIsPasswordShown(false)}/>
                                ) : (
                                  <FontAwesomeIcon icon={faEye} className="eye-icon" onClick={() => setIsPasswordShown(true)}/>
                                )
                            }
                </div>
                <p>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                <input type="submit" value="Đăng ký tài khoản" />
            </form>
            </>)}
        </div>
        </section>
        </>
    )
}


export default Register;