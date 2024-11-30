// src/components/RegisterPage.js

import React, { useState } from "react";
import axios from "axios";
import "./RegisterPage.css"; // Optional, for the provided styles
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  // Thêm các trường bổ sung vào state để chứa thông tin đăng ký
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    contactInfo: "",
    quota: 10, // Mặc định là 10
    role: "USER", // Mặc định là "USER"
    date_of_birth: "",
    ho_va_ten: "",
    email:"",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  // Hàm kiểm tra mật khẩu
  const validatePassword = (password) => {
    // Kiểm tra ít nhất 8 ký tự, bao gồm ít nhất một chữ và một số
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  // Xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { password: "", confirmPassword: "" };

    // Xác thực mật khẩu
    if (!validatePassword(formData.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ và số.";
      valid = false;
    }

    // Xác thực confirmPassword
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và nhập lại mật khẩu không khớp.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    try {
      // Gửi yêu cầu POST tới backend để tạo người đọc mới
      const payload = {
        username: formData.username,
        password: formData.password,
        contactInfo: formData.contactInfo,
        quota: formData.quota,
        role: formData.role,
        ho_va_ten: formData.ho_va_ten,
        email: formData.email,
        date_of_birth:formData.date_of_birth,
      };
      await axios.post("http://localhost:8080/api/readers", payload);

      // Nếu thành công, thông báo người dùng
      navigate("/login");
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
              name="ho_va_ten"
              placeholder="Họ và tên"
              value={formData.ho_va_ten}
              onChange={handleChange}
              required
            />
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
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactInfo"
              placeholder="Thông tin liên lạc"
              value={formData.contactInfo}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="date_of_birth"
              placeholder="Ngày sinh"
              value={formData.date_of_birth}
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
            {errors.password && <p className="error">{errors.password}</p>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
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
