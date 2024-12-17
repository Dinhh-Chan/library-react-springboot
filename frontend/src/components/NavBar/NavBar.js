import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Import Link từ react-router-dom
import './NavBar.css';
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRobot } from "@fortawesome/free-solid-svg-icons";
import DropDownMenu from "../DropDownItems/DropDownItems";
import NotificationButton from "../NotificationButton/NotificationButton";

function NavBar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [notifications, setNotifications] = useState([]); // Dữ liệu thông báo
    const [hasNotification, setHasNotifications] = useState(false); // Kiểm tra có thông báo chưa đọc
    const navigate = useNavigate();
    const userId = localStorage.getItem("id_user"); // Lấy userId từ localStorage

    useEffect(() => {
        // Kiểm tra xem đã có notifications chưa, nếu có thì không gọi lại API
        const fetchNotifications = async () => {
            if (userId && notifications.length === 0) {
                try {
                    // Gọi API để lấy thông báo (Sử dụng phương thức GET)
                    const response = await fetch(`http://localhost:8080/api/reports?receiverId=${userId}`, {
                        method: 'GET', // Phương thức GET
                        headers: {
                            'Content-Type': 'application/json', // Đảm bảo định dạng JSON
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Lỗi khi lấy dữ liệu từ API");
                    }

                    const data = await response.json();

                    // Lọc thông báo cho người dùng cụ thể theo receiverId hoặc senderId
                    const userNotifications = data.filter(notification => notification.receiverId == userId);
                    setNotifications(userNotifications); // Gắn giá trị cho biến notifications

                    // Kiểm tra xem có thông báo nào chưa đọc hay không
                    const hasUnread = userNotifications.some(notification => notification.status === "UNREAD");
                    setHasNotifications(hasUnread); // Gắn giá trị cho biến hasNotification
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        fetchNotifications();
    }, [userId, notifications.length]); // Chỉ chạy lại khi userId thay đổi và notifications chưa có

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
                <Link to={"/user/chat-bot"}>
                    <button className="NotificationButton">
                        <FontAwesomeIcon icon={faRobot}/>
                    </button></Link>
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
