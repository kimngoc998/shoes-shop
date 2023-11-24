
import React, {useState, useEffect} from 'react';
import "./manageUser.css"
//import { useSelector } from 'react-redux';
import axios from 'axios';
import {BiPencil } from 'react-icons/bi';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export default function ManageOrder() {
    //const user = useSelector((state) => state.auth.login.currentUser);
    const [users, setUsers] = useState([]);
    const [openEdit, setOpenEdit] = useState(null);
  
  
    useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_API_URL}user`)
          .then((res) => {
            const data = res.data;
            const users = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setUsers(users);
            //setFilteredOrderList(users);
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
    // const [selectedBtn, setSelectedBtn] = useState('all');
    // const [filteredOrderList, setFilteredOrderList] = useState([]);
    // useEffect(() => {
    //   if (selectedBtn ==='all') {
    //     setFilteredOrderList(users);
    //   }else {
    //     setFilteredOrderList(
    //       users.filter((user) => user.status === selectedBtn)
    //         );
    //   }
    // }, [selectedBtn]);
    // const handleBtn = (value) => {
    //   setSelectedBtn(value);
    // }




return (
  <div className='manage-user'>
      <div className='manage-user-section'>
      {/* <button type='button' value='all' className={`btn manage-btn ${selectedBtn === 'all' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Tất cả</button>
          <button type='button' value='pending' className={`btn manage-btn ${selectedBtn === 'pending' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đợi xác nhận</button>
          <button type='button' value='delivery' className={`btn manage-btn ${selectedBtn === 'delivery' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đang giao</button>
          <button type='button' value='completed' className={`btn manage-btn ${selectedBtn === 'completed' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đã hoàn thành</button>
          <button type='button' value='cancel' className={`btn manage-btn ${selectedBtn === 'cancel' ? 'btn-primary' : 'tn-light'}`} onClick={(e) => handleBtn(e.target.value)}>Đã hủy</button>
       */}
       </div>
        <div className='manage-user-table'>
            <table className="table table-striped user-table">
            <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Họ Tên</th>
                  <th scope="col">username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Vai trò</th>
                  <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => {
                      const SelectedOption = user.isAdmin ? "true" : "false";
                      const handleOptionChange = (event, index) => {
                        const selectedOption = event.target.value;
                        const updatedUsers = [...users];
                        updatedUsers[index].isAdmin = selectedOption === "true";
                        setUsers(updatedUsers);
                      };
                      const handleEdit = (userId, value) => {

                        if(value !== user.isAdmin){

                        const dataEdit = {
                          isAdmin: value
                        };
                  
                        axios
                        .put(`${process.env.REACT_APP_API_URL}user/${userId}`, dataEdit)
                        // eslint-disable-next-line
                        .then((res) => {
                          setOpenEdit(null);
                        })}else{
                          setOpenEdit(null);
                        }
                      }
                    return(<>
                        <tr key={index} className={openEdit === user._id ? 'selTr' : ''}>
                          <th scope="row">{index}</th>
                          <td>{user.fullname}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{openEdit === user._id ? (<>
                            <select id="isAdmin-select" value={SelectedOption} onChange={event => handleOptionChange(event, index)}>
                              <option value="true">Quản lý</option>
                              <option value="false">Khách hàng</option>
                            </select>{" "}
                  <div className="circle-icon" onClick={() => handleEdit(user._id, SelectedOption)}>
                    <FontAwesomeIcon icon={faCheck} />
                  </div></>):(user.isAdmin ? 'Quản lý' : 'Khách hàng')}
                          </td>
                          <td><BiPencil size={24} onClick={() => setOpenEdit(user._id)}/></td>
                         </tr>
                            
                            </>)})}
                </tbody>
            </table>
        </div>
    </div>
  )
}
