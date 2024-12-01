import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation } from "react-router-dom";
import { faBook, faUsers, faTags, faSync, faSignOutAlt, faChartLine, faFlag } from '@fortawesome/free-solid-svg-icons';
import "./AdminSideBar.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";  // Import axios

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();  // To track the current route
    const [supersetToken, setSupersetToken] = useState(null);
    const [dashboardUrl, setDashboardUrl] = useState('');

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("id_user");
        localStorage.removeItem("role");
        navigate("/login");
    };

    // Call Superset API to get the JWT token
    const fetchSupersetToken = async () => {
        try {
            const response = await axios.post("http://localhost:8088/api/v1/security/login", {
                username: "admin",
                password: "admin",
                provider: "db",
                refresh: true
            });
            setSupersetToken(response.data.access_token);  // Set the JWT token
            console.log(response.data.access_token)
        } catch (error) {
            console.error("Failed to authenticate with Superset API", error);
        }
    };

    // Fetch the dashboard URL
    const fetchDashboardUrl = async () => {
        if (supersetToken) {
            try {
                // Example API call to get the dashboard details
                const dashboardId = 3; // Specify the dashboard ID you want
                const response = await axios.get(`http://localhost:8088/api/v1/dashboard/${dashboardId}`, {
                    headers: {
                        Authorization: `Bearer ${supersetToken}`
                    }
                });
                // Assuming the response contains the dashboard URL or you can create it
                setDashboardUrl(`http://localhost:8088/superset/dashboard/3/?native_filters_key=JNhB_WUlw4s7gnlYShih3EJL597dO0dNIAdphuGjfl0tV4KVbHkRvuhDPDGMp9pF&output=embed`);
                console.log(response)
            } catch (error) {
                console.error("Failed to fetch Superset dashboard", error);
            }
        }
    };

    // Run the fetch functions when the component mounts
    useEffect(() => {
        fetchSupersetToken();
    }, []);

    useEffect(() => {
        if (supersetToken) {
            fetchDashboardUrl();
        }
    }, [supersetToken]);

    return ( 
        <div className="AdminWrapper">
            <div className="admin-sidebar-content">
                <div className="admin-sidebar-wrapper">
                    <div className="AdminSidebar">
                        <div>
                            <div className="AdminMenu">
                                <img src='https://i.imgur.com/YVydVYH.png' alt='Logo'></img>
                                <Link to="manage-books" className="AdminLinks"><FontAwesomeIcon icon={faBook}/> Kho sách</Link>
                                <Link to="manage-borrow-and-returned-books" className="AdminLinks"><FontAwesomeIcon icon={faSync} /> Sách đang mượn</Link>
                                <Link to="manage-users" className="AdminLinks"><FontAwesomeIcon icon={faUsers}/> Danh sách người dùng</Link>
                                <Link to="manage-category" className="AdminLinks"><FontAwesomeIcon icon={faTags} /> Danh sách danh mục</Link>
                                <Link to="report" className="AdminLinks"><FontAwesomeIcon icon={faFlag} /> Đơn báo cáo</Link>

                                {/* Superset Dashboard Link */}
                                {dashboardUrl ? (
                                    <button className="AdminLinks" onClick={() => navigate("/admin/dashboard")}>
                                        <FontAwesomeIcon icon={faChartLine} /> Superset Dashboard
                                    </button>
                                ) : (
                                    <p>Loading Superset Dashboard...</p>
                                )}

                                <button className="AdminLinks" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt}/> Đăng xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="AdminContent">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminSidebar;
