import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./DropDown.css";

function DropDownMenu() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const fullName =localStorage.getItem("fullName");

    // Hàm xử lý khi nhấn vào nút Đăng Xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("id_user");
        navigate("/login");
    };

    return (

        <ul className="dropDownMenu">
            <li className="menuItems" >
                <Link to="/user" className="NavBarProfile">
                    {role === "USER" ?
                       (<>
                            <img src="https://i.imgur.com/B8ta5Aa.jpeg" alt="Profile" />
                            <h3>{fullName}</h3>
                        </>):
                        (<><button className="siginbutton" onClick={() => navigate("/login")}>Đăng nhập</button></>)}
                </Link>
            </li>
            <hr />
            <li className="menuItems">
                <Link to="/category" className="menuItems">Thể loại</Link>
            </li>
            <hr />
            {/* Các đường dẫn dành riêng cho người dùng đã đăng nhập */}
            {token ? (
                <>
                    <li className="menuItems">
                        <Link to="/user/profile-edit" className="menuItems">Sửa hồ sơ</Link>
                    </li>
                    <li className="menuItems">
                        <Link to="/user/borrow-history" className="menuItems">Lịch sử mượn</Link>
                    </li>
                    <li className="menuItems">
                        <Link to="/user/change-password" className="menuItems">Đổi mật khẩu</Link>
                    </li>
                    <li className="menuItems">
                        <Link to="/user/chat-bot" className="menuItems">Trò chuyện với chatbot</Link>
                    </li>
                    <hr />
                    <li className="menuItems">
                        <Link to="/user/report-lost-book" className="menuItems">Báo cáo với quản trị viên</Link>
                    </li>
                    <hr/>
                    <li>
                        <button className="logoutButton" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </li>
                </>
            ) : (
                <></>
            )}
            {/* Liên kết cho Admin */}
            {role === "ADMIN" && (
                <>
                    <hr />
                    <li className="menuItems">
                        <Link to="/admin" className="menuItems">Về trang Admin</Link>
                    </li>
                </>
            )}
        </ul>
    );
}

export default DropDownMenu;
