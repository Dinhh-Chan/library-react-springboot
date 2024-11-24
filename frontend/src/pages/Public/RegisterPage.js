import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css"; // Optional, for the provided styles
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  // Thêm các trường bổ sung vào state để chứa thông tin đăng ký
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    contactInfo: "",
    quota: 10, // Mặc định là 10
    role: "USER", // Mặc định là "USER"
  });
  const navigate = useNavigate();

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu POST tới backend để tạo người đọc mới
      await axios.post("http://localhost:8080/api/readers", formData);

      // Nếu thành công, thông báo người dùng
      alert("Đăng ký thành công!");
      navigate("/login")
    } catch (error) {
      // Nếu có lỗi, thông báo cho người dùng
      console.error("Lỗi khi đăng ký:", error);
      alert(
        "Có lỗi xảy ra trong quá trình đăng ký: " +
          (error.response?.data?.message || "Lỗi không xác định")
      );
    }
  };

  return (
    <div className="register">
        <div className="container">
        <div className="form-left">
            <h2>Tạo tài khoản</h2>
            <p>Điền thông tin của bạn</p>
        </div>
        <div className="form-right">
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="contactInfo"
                placeholder="Gmail"
                value={formData.contactInfo}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                required
            />
            <div className="actions">
                <a href="/login">Đăng nhập</a>
                <button type="submit">Tạo</button>
            </div>
            </form>
        </div>
        </div>
    </div>
  );
};

export default RegisterPage;
