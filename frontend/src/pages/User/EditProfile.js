import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        username: "",
        hoVaTen: "",
        dateOfBirth: "",
        numberPhone: "",
        email: "",
        password: "",
        role: "USER",
    });

    const userId = localStorage.getItem("id_user"); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/readers/${userId}`);
                const { username, hoVaTen, dateOfBirth, numberPhone, email, contactInfo, quota, password, role } = response.data;
                setFormData({ username, hoVaTen, dateOfBirth, numberPhone, email, contactInfo, quota, password, role });
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu người dùng:", err);
                setError("Không thể tải dữ liệu người dùng.");
                alert("Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.");
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Gửi dữ liệu cập nhật đến API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await axios.put(`http://localhost:8080/api/readers/${userId}`, formData);
            alert("Cập nhật hồ sơ thành công!");
        } catch (err) {
            console.error("Lỗi khi cập nhật hồ sơ:", err);
            setError("Cập nhật thất bại.");
            alert("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="form-container">
            <h1>Sửa hồ sơ</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="hoVaTen">Họ và tên:</label>
                    <input
                        type="text"
                        id="hoVaTen"
                        name="hoVaTen"
                        placeholder="Nhập họ và tên"
                        value={formData.hoVaTen}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Ngày sinh:</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="numberPhone">Số điện thoại:</label>
                    <input
                        type="text"
                        id="numberPhone"
                        name="numberPhone"
                        placeholder="Nhập số điện thoại"
                        value={formData.numberPhone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Gmail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Nhập email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Tên người dùng:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nhập tên người dùng mới"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="save-button">Lưu hồ sơ</button>
            </form>
        </div>
    );
};

export default EditProfile;
