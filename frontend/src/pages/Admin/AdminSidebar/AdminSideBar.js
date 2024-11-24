// src/components/AdminSidebar.js

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "react-router-dom";
import { faBook, faUsers, faTags, faSync, faSignOutAlt, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import "./AdminSideBar.css";
import { useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove items from localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("id_user");
        localStorage.removeItem("role");

        // Navigate to login page
        navigate("/login");
    };

    return ( 
        <>
            <div></div>
            <div className="AdminWrapper">
                <div className="AdminSidebar">
                    <div className="AdminMenu">
                        <img src='https://i.imgur.com/YVydVYH.png' alt='Logo'></img>
                        <Link to="/" className="AdminLinks">
                            <FontAwesomeIcon icon={faChartLine} /> Dashboard
                        </Link>
                        <Link to="manage-books" className="AdminLinks">
                            <FontAwesomeIcon icon={faBook}/> Manage Books
                        </Link>
                        <Link to="manage-borrow-and-returned-books" className="AdminLinks">
                            <FontAwesomeIcon icon={faSync} /> Borrowed Books
                        </Link>
                        <Link to="manage-users" className="AdminLinks">
                            <FontAwesomeIcon icon={faUsers}/> User List
                        </Link>
                        <Link to="manage-category" className="AdminLinks">
                            <FontAwesomeIcon icon={faTags} /> Category List
                        </Link>
                        {/* New Superset Dashboard Link */}
                        <Link to="superset-dashboard" className="AdminLinks">
                            <FontAwesomeIcon icon={faChartPie} /> Superset Dashboard
                        </Link>
                        <button className="AdminLinks" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                        </button>
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    );
}

export default AdminSidebar;
