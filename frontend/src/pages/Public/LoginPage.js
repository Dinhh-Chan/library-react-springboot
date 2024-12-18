import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleForgotPasswordChange = (e) => {
        setForgotPasswordEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Tạo form data
            const params = new URLSearchParams();
            params.append('username', formData.username);
            params.append('password', formData.password);
    
            // Gửi yêu cầu POST với form data
            const response = await axios.post(
                `http://localhost:8080/api/readers/login`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
    
            if (response.status === 200) {
                const responseUser = await axios.get(`http://localhost:8080/api/readers/${response.data.id}`);
                localStorage.setItem("token", "dummy-token");
                localStorage.setItem("id_user", response.data.id); 
                localStorage.setItem("role", response.data.role); 
                localStorage.setItem("userName", responseUser.data.username); 
                localStorage.setItem("fullName", responseUser.data.hoVaTen);
                if (response.data.role === "USER") {
                    window.location.href = "/"; 
                } else if (response.data.role === "ADMIN") {
                    window.location.href = "/admin/manage-books"; 
                }
            } else {
                alert("Đăng nhập thất bại: Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch (error) {
            alert("Đăng nhập thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
        }
    };
    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8080/api/readers/forgot-password`, {
                email: forgotPasswordEmail,
            });

            if (response.status === 200) {
                alert("Một mật khẩu mới đã được gửi đến email của bạn.");
                setShowForgotPassword(false);
                setForgotPasswordEmail("");
            }
        } catch (error) {
            alert("Gửi yêu cầu thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
        }
    };

    return (
        <div className="login">
            <div className="Logincontainer">
                <div className="LoginImg">
                    <img src="https://letsenhance.io/static/a31ab775f44858f1d1b80ee51738f4f3/11499/EnhanceAfter.jpg" alt=""></img>
                </div>
                <div className="login-container">
                    <h1>Đăng Nhập</h1>
                    {!showForgotPassword ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <input
                                        placeholder="Username"
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit">Đăng nhập</button>
                            </form>
                            <p>
                                Chưa có tài khoản?{" "}
                                <a
                                    className="register-link"
                                    href="/register"
                                >
                                    Đăng ký tại đây
                                </a>
                            </p>
                            <p>
                                <button 
                                    className="forgot-password-button" 
                                    onClick={() => setShowForgotPassword(true)}
                                    style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                >
                                    Quên mật khẩu
                                </button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2>Khôi Phục Mật Khẩu</h2>
                            <form onSubmit={handleForgotPasswordSubmit}>
                                <div>
                                    <input
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        value={forgotPasswordEmail}
                                        onChange={handleForgotPasswordChange}
                                        required
                                    />
                                </div>
                                <button type="submit">Gửi Mật Khẩu Mới</button>
                            </form>
                            <p>
                                <button 
                                    className="back-to-login-button" 
                                    onClick={() => setShowForgotPassword(false)}
                                    style={{ background: "none", border: "none", color: "blue", textDecoration: "underline", cursor: "pointer" }}
                                >
                                    Quay lại đăng nhập
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
