import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi request tới API mới để kiểm tra đăng nhập
            const response = await axios.post(`http://localhost:8080/api/readers/login?username=${formData.username}&password=${formData.password}`);
            

            if (response.status === 200) {
                const responseUser  = await axios.get(`http://localhost:8080/api/readers/${response.data.id}`);
                localStorage.setItem("token", "dummy-token");
                localStorage.setItem("id_user", response.data.id); 
                localStorage.setItem("role", response.data.role); 
                localStorage.setItem("userName", responseUser.data.username); 
                setTimeout(() => {
                    if (response.data.role === "USER") {
                        window.location.href = "/"; 
                    } else if (response.data.role === "ADMIN") {
                        window.location.href = "/admin/manage-books"; 
                    }
                }, 500);
            } else {
                alert("Đăng nhập thất bại: Sai tên đăng nhập hoặc mật khẩu");
            }
        } catch (error) {
            alert("Đăng nhập thất bại: " + (error.response?.data?.message || "Lỗi không xác định"));
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
            </div>
            </div>
        </div>
    );
};

export default LoginPage;
