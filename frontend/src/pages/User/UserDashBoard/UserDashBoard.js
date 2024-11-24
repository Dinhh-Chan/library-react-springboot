import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./UserDashBoard.css"
import NavBar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";

const UserDashboard = () => {
  const userId = localStorage.getItem("id_user");
  const userName = localStorage.getItem("userName");

  return (
<>
    <NavBar />
    <div className="profile-settings">
      <div className="sidebar">
        <div className="user-info">
          <div className="avatar"></div>
            <p>UserName: {userName}</p>
                <p className="user-id">ID: {userId}</p>
              </div>
                <div className="menu">
                  <Link to="" className="UserProfileLink" ></Link>
                  <Link to="profile-edit" className="UserProfileLink">Sửa Hồ Sơ</Link>
                  <Link to="borrow-history" className="UserProfileLink">Lịch Sử Mượn Sách</Link>
                  <Link to="change-password" className="UserProfileLink">Đổi Mật Khẩu</Link>
                </div>
        </div>
      <Outlet/>
    </div>
    <Footer />
</>);
};

export default UserDashboard;