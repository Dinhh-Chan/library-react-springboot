import React, { useState, useEffect } from "react";
import axios from "axios";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [userDetails, setUserDetails] = useState(null); // Thông tin người dùng hiện tại
    const userId = localStorage.getItem("id_user"); // Lấy ID người dùng từ localStorage

    // Lấy thông tin người dùng hiện tại
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/readers/${userId}`);
                setUserDetails(response.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin người dùng:", error);
                alert("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không trùng khớp.");
            return;
        }

        try {
            const payload = {
                username: userDetails.username, // Giữ nguyên tên người dùng
                contactInfo: userDetails.contactInfo, // Giữ nguyên thông tin liên hệ
                quota: userDetails.quota, // Giữ nguyên hạn mức
                role: userDetails.role, // Giữ nguyên vai trò
                password: formData.newPassword, // Cập nhật mật khẩu mới
            };

            const response = await axios.put(
                `http://localhost:8080/api/readers/${userId}`,
                payload
            );

            if (response.status === 200) {
                alert("Đổi mật khẩu thành công!");
            } else {
                alert("Đổi mật khẩu thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            alert("Đổi mật khẩu thất bại. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="form-container">
            <h1>Đổi Mật Khẩu</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="oldPassword">Mật khẩu cũ:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        placeholder="Nhập mật khẩu cũ"
                        value={formData.oldPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword">Mật khẩu mới:</label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Nhập lại mật khẩu mới:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="save-button">Đổi mật khẩu</button>
            </form>
        </div>
    );
};

export default ChangePassword;
