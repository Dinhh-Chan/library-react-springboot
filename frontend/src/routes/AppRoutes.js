import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/Public/HomePage";
import AdminSideBar from "../pages/Admin/AdminSidebar/AdminSideBar";
import LoginPage from "../pages/Public/LoginPage";
import RegisterPage from "../pages/Public/RegisterPage";
import BookPage from "../pages/Public/BookPage";
import CategoriesPage from "../pages/Public/CategoriesPage";
import BookBorrowTicketPage from "../pages/User/BookBorrowTicketPage";
import ProtectedRoute from "./ProtectedRoute";
import UserDashBoard from "../pages/User/UserDashBoard/UserDashBoard"
import EditProfile from "../pages/User/EditProfile";
import BorrowHistory from "../pages/User/BorrowHistory";
import ChangePassword from "../pages/User/ChangePassword";
import ReportLostBook from "../pages/User/ReportLostBook";
import ManageBooks from '../pages/Admin/ManageBook';
import ManageBorrowBooks from '../pages/Admin/ManageBorrowBooks';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageCategory from '../pages/Admin/ManageCategory';
import BooksByCategory from "../components/CategoriesList/BookByCategory";
import ManageReport from '../pages/Admin/ManageReport';
import NotificationPage from "../pages/User/NotificationPage";

const AppRoutes = ({ role }) => {
    return (
        <Routes>
            {/* Các trang ai cũng có thể truy cập */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/category" element={<CategoriesPage />} />
            <Route path="/categories/:categoryId" element={<BooksByCategory />} />

            {/* Các trang admin */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        {role === "ADMIN" ? <AdminSideBar /> : <Navigate to="/" />}
                    </ProtectedRoute>
                }
            >   
                <Route path="report" element={<ManageReport/>}/>
                <Route path="manage-books" element={<ManageBooks />} />
                <Route path="manage-borrow-and-returned-books" element={<ManageBorrowBooks />} />
                <Route path="manage-users" element={<ManageUsers />} />
                <Route path="manage-category" element={<ManageCategory />} />
                
                {/* Render the iframe inside /admin/dashboard route */}
                <Route
    path="dashboard"
    element={
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f4f7fa", // Màu nền nhẹ cho trang
            }}
        >
            <iframe
                src="http://localhost:8088/superset/dashboard/3"
                title="Superset Dashboard"
                style={{
                    width: "1300px",
                    height: "80vh", // Chiếm 80% chiều cao của màn hình
                    border: "none",
                    borderRadius: "8px", // Bo góc cho iframe
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", //
                    // transition: "transform 0.3s ease", // Hiệu ứng khi hover
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            ></iframe>
        </div>
    }
/>

            </Route>
                    
            {/* Các trang user */}
            <Route
                path="/borrow-ticket"
                element={
                    <ProtectedRoute>
                        {role === "USER" ? <BookBorrowTicketPage /> : <Navigate to="/" />}
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/user"
                element={
                    <ProtectedRoute>
                        {role === "USER" ? <UserDashBoard /> : <Navigate to="/login" />}
                    </ProtectedRoute>
                }
            >   
                <Route path="notification" element={<NotificationPage />} />
                <Route path="profile-edit" element={<EditProfile />} />
                <Route path="borrow-history" element={<BorrowHistory />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="report-lost-book" element={<ReportLostBook />} />
            </Route>

            {/* Default route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
