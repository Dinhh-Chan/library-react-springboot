import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";


const ManageReport = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [visibleForm, setVisibleForm] = useState(true);

    useEffect(() => {
        // Fetch danh sách báo cáo từ API
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reports");
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error("Lỗi khi lấy báo cáo:", error);
            }
        };

        fetchReports();
    }, []);

    const handleReportClick = async (reportId) => {
        try {
            // Lấy thông tin chi tiết của báo cáo khi click vào báo cáo
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
        <>
        <div className="form-container">
            <h1>Danh sách báo cáo</h1>
        <div className="borrow-list">
            <ul>
                {reports.map((report) => (
                    <li key={report.reportId} onClick={() => {handleReportClick(report.reportId);
                        setVisibleForm(true)
                    }}>
                        <h3>{report.title}</h3>
                        <p>{formatDate(report.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                    </li>
                ))}
            </ul>
        </div>

            {/* Modal thông tin chi tiết báo cáo */}
            {selectedReport && (
                <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                        <h2>{selectedReport.title}</h2>
                        <p><b>Nội dung:</b> {selectedReport.content}</p>
                        <p><b>Thời gian tạo:</b> {formatDate(selectedReport.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                        <div>
                            <h3>Thông tin người gửi</h3>
                            <p><b>Họ và tên:</b> {selectedReport.senderInfo?.hoVaTen}</p>
                            <p><b>Tên người dùng:</b> {selectedReport.senderInfo?.username}</p>
                            <p><b>Gmail:</b> {selectedReport.senderInfo?.email}</p>
                            <p><b>Số điện thoại:</b> {selectedReport.senderInfo?.numberPhone}</p>
                            <p><b>Ngày sinh:</b> {selectedReport.senderInfo?.dateOfBirth || "Chưa có thông tin"}</p>
                        </div>
                </Modal>
            )}
        </div>
        </>
    );
};

export default ManageReport;
