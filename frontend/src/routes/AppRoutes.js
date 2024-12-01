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
                        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
                            <iframe
                                src="http://localhost:8088/superset/dashboard/3/?native_filters_key=b2uP4dJK338fPPyAwHd3fxSLMLSkfPnXgbuw-8a3eqYgHPw0KURyvyvjgmQr4aVg"
                                title="Superset Dashboard"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                }}
                                allowFullScreen // For full-screen functionality
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
