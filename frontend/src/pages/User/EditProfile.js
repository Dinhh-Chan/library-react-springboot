import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        username: "",
        contactInfo: "",
        quota: 0,
        password: "",
        role: "USER", 
    });

    const userId = localStorage.getItem("id_user"); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/readers/${userId}`);
                const { username, contactInfo, quota, password, role } = response.data;
                setFormData({ username, contactInfo, quota, password, role });
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
                <div className="form-group">
                    <label htmlFor="contactInfo">Thông tin iên lạc:</label>
                    <input
                        type="text"
                        id="contactInfo"
                        name="contactInfo"
                        placeholder="Nhập thông tin liên lạc mới"
                        value={formData.contactInfo}
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
