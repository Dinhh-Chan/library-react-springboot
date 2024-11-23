// src/routes/AppRoutes.js
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

            {/* Các trang sau đây chỉ có thể truy cập khi đã đăng nhập */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        {role === "ADMIN" ? <AdminSideBar /> : <Navigate to="/" />}
                    </ProtectedRoute>
                }
            >
                 <Route path="manage-books" element={<ManageBooks/>} />
          <Route path="manage-borrow-and-returned-books" element={<ManageBorrowBooks/>} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-category" element={<ManageCategory />} />
            </Route>
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
                <Route
                    path="profile-edit"
                    element={
                        <ProtectedRoute>
                            {role === "USER" ? <EditProfile /> : <Navigate to="/login" />}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="borrow-history"
                    element={
                        <ProtectedRoute>
                            {role === "USER" ? <BorrowHistory /> : <Navigate to="/login" />}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="change-password"
                    element={
                        <ProtectedRoute>
                            {role === "USER" ? <ChangePassword /> : <Navigate to="/login" />}
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="report-lost-book"
                    element={
                        <ProtectedRoute>
                            {role === "USER" ? <ReportLostBook /> : <Navigate to="/login" />}
                        </ProtectedRoute>
                    }
                />
            </Route>
            
            {/* Bất kỳ URL nào không xác định sẽ điều hướng về trang chủ */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
