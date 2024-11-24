import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";
import { faBook, faUsers, faTags, faSync, faSignOutAlt, faChartLine } from '@fortawesome/free-solid-svg-icons';
import "./AdminSideBar.css";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa các giá trị trong localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("id_user");
        localStorage.removeItem("role");

        // Điều hướng về trang đăng nhập
        navigate("/login");
    };
    return ( 
        <>
        <div></div>
        <div className="AdminWrapper">
            <div className="AdminSidebar">
                <div className="AdminMenu">
                <img src='https://i.imgur.com/YVydVYH.png' alt='https://i.imgur.com/YVydVYH.png'></img>
                        <Link to={""} className="AdminLinks"><FontAwesomeIcon icon={faChartLine} /> DashBoard</Link>
                        <Link to={"manage-books"} className="AdminLinks"><FontAwesomeIcon icon={faBook}/> Kho sách</Link>
                        <Link to={"manage-borrow-and-returned-books"} className="AdminLinks"><FontAwesomeIcon icon={faSync} /> Sách đang mượn</Link>
                        <Link to={"manage-users"} className="AdminLinks"><FontAwesomeIcon icon={faUsers}/> Danh sách người dùng</Link>
                        <Link to={"manage-category"} className="AdminLinks"><FontAwesomeIcon icon={faTags} /> Danh sách danh mục</Link>
                        <button className="AdminLinks" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt}/> Đăng xuất</button>
                </div>
            </div>
        <Outlet></Outlet>
        </div>
        </>
     );
}

export default AdminSidebar;
