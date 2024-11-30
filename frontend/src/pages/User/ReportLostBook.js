import React, { useEffect, useState } from "react";

const ReportLostBook = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [reportData, setReportData] = useState({
        title: '',
        content: '',
    });

    const id = localStorage.getItem("id_user"); // lấy id từ localStorage

    useEffect(() => {
        // Lấy thông tin người dùng từ API
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/readers/${id}`);
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        fetchUserInfo();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReportData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const report = {
            senderId: id, 
            receiverId: 1,
            content: reportData.content,
            status: "UNREAD",
            title: reportData.title,
            parentReportId: null, 
        };

        try {
            const response = await fetch("http://localhost:8080/api/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(report),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Báo cáo đã được gửi thành công!");
            } else {
                alert(`Lỗi: ${result.message}`);
            }
        } catch (error) {
            console.error("Lỗi khi gửi báo cáo:", error);
            alert("Đã xảy ra lỗi khi gửi báo cáo.");
        }
    };

    // Kiểm tra nếu userInfo là null, nếu đúng thì hiển thị thông báo đang tải
    if (!userInfo) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    return (
        <div className="form-container">
            <h1>Thông tin người dùng</h1>
                <p><b>Họ và tên:</b>{userInfo.hoVaTen || "Chưa có thông tin"}</p>
                <p><b>Ngày sinh:</b>{userInfo.dateOfBirth || "Chưa có thông tin"}</p>
                <p><b>Số điện thoại:</b>{userInfo.numberPhone || "Chưa có thông tin"}</p>
                <p><b>Gmail:</b>{userInfo.email || "Chưa có thông tin"}</p>

                <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Tiêu đề:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={reportData.title}
                        onChange={handleChange}
                        placeholder="Nhập tiêu đề báo cáo"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Nội dung:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={reportData.content}
                        onChange={handleChange}
                        placeholder="Nhập nội dung báo cáo"
                        required
                    />
                </div>
                <button type="submit" className="save-button">
                    Gửi báo cáo
                </button>
            </form>
        </div>
    );
};

export default ReportLostBook;
