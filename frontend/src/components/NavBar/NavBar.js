// src/components/NavBar/NavBar.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Import Link từ react-router-dom
import './NavBar.css';
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DropDownMenu from "../DropDownItems/DropDownItems";
import NotificationButton from "../NotificationButton/NotificationButton";

function NavBar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [hasNotification, setHasNotifications] = useState(false);
    const navigate = useNavigate()
    const userId = localStorage.getItem("id_user");

    useEffect(() => {
        // Gọi API để lấy thông báo
        fetch("http://localhost:8080/api/reports")
            .then(response => response.json())
            .then(data => {
                // Lọc thông báo cho người dùng cụ thể theo receiverId hoặc senderId
                const userNotifications = data.filter(notification => notification.receiverId == userId);
                setNotifications(userNotifications);

                // Kiểm tra xem có thông báo nào chưa đọc hay không
                const hasUnread = userNotifications.some(notification => notification.status == "UNREAD");
                setHasNotifications(hasUnread);
                
            })
            .catch(error => console.error("Error fetching notifications:", error))
            .finally(console.log(userId,notifications))
    }, [userId,notifications]); // Chạy lại khi userId thay đổi
    
    return ( 
        <>
            <nav className="navbar">
                {/* Bao bọc img bằng Link để chuyển hướng về "/" */}
                <Link to="/" className="navbar-logo">
                    <img 
                        src='https://i.imgur.com/YVydVYH.png' 
                        alt="Logo" // Sử dụng alt mô tả rõ ràng hơn
                    />
                </Link>
                <SearchBar />
                <NotificationButton hasNotifications={hasNotification} onClick={() => navigate("/user/notification")}></NotificationButton>
                <button className="menuButton" onClick={() => setOpenMenu(!openMenu)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </nav>
            {openMenu && <DropDownMenu />}
            {/* Thêm khoảng trống dưới navbar */}
            <div style={{height:"80px"}}></div>
        </>
    );
}

export default NavBar;
