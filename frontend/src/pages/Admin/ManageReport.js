import React, { useState, useEffect } from "react";

const ManageReport = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        // Lấy thông tin người dùng từ API
        const fetchUserInfo = async () => {
            const userId = 8; // Thay đổi id người dùng theo trường hợp của bạn
            try {
                const response = await fetch(`http://localhost:8080/api/readers/${userId}`);
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

        // Lấy danh sách báo cáo từ API
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reports");
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Lỗi khi lấy báo cáo:", error);
            }
        };

        fetchUserInfo();
        fetchReports();
    }, []);

    const handleReportClick = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}`);
            const data = await response.json();
            setSelectedReport(data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết báo cáo:", error);
        }
    };

    const handleCloseModal = () => {
        setSelectedReport(null); // Đóng modal
    };

    // Hàm format thời gian
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className="form-container">
            <h1>Danh sách báo cáo</h1>
            <ul>
                {reports.map((report) => (
                    <li key={report.reportId} onClick={() => handleReportClick(report.reportId)}>
                        <h3>{report.title}</h3>
                        <p>{formatDate(report.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                    </li>
                ))}
            </ul>

            {/* Modal thông tin chi tiết báo cáo */}
            {selectedReport && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseModal}>
                            &times;
                        </span>
                        <h2>{selectedReport.title}</h2>
                        <p><b>Nội dung:</b> {selectedReport.content}</p>
                        <p><b>Thời gian tạo:</b> {formatDate(selectedReport.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                        <div className="info-section">
                            <h3>Thông tin người gửi</h3>
                            {userInfo && (
                                <>
                                    <p><b>Họ và tên:</b> {userInfo.hoVaTen}</p>
                                    <p><b>Tên người dùng:</b> {userInfo.username}</p>
                                    <p><b>Gmail:</b> {userInfo.email}</p>
                                    <p><b>Số điện thoại:</b> {userInfo.numberPhone}</p>
                                    <p><b>Ngày sinh:</b> {userInfo.dateOfBirth || "Chưa có thông tin"}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageReport;
