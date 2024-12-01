import React, { useState, useEffect } from "react";

const ManageReport = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        // Lấy danh sách báo cáo từ API
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reports");
                const data = await response.json();
                setReports(data);

                // Sau khi lấy danh sách báo cáo, lấy thông tin người dùng
                if (data.length > 0) {
                    const senderId = data[0].senderId; // Giả sử senderId từ báo cáo đầu tiên
                    fetchUserInfo(senderId);
                }
            } catch (error) {
                console.error("Lỗi khi lấy báo cáo:", error);
            }
        };

        // Lấy thông tin người dùng từ API
        const fetchUserInfo = async (userId) => {
            try {
                const response = await fetch(`http://localhost:8080/api/readers/${userId}`);
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            }
        };

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

    const handleReplyChange = (event) => {
        setReplyContent(event.target.value);
    };

    const handleReplySubmit = async (reportId) => {
        if (!replyContent.trim()) {
            alert("Vui lòng nhập nội dung phản hồi.");
            return;
        }

        try {
            const { senderId, receiverId } = selectedReport; // Get senderId (receiverId is the sender of the original report)
            const newReply = {
                senderId: 1, // Admin's senderId
                receiverId: senderId, // The original sender of the report
                content: replyContent,
                status: "UNREAD", // Assuming the status should be "UNREAD"
                title: `Phản hồi từ admin: ${selectedReport.title}`, // Title for the reply
                parentReportId: reportId, // The original report's ID
            };

            const response = await fetch(`http://localhost:8080/api/reports/${reportId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newReply),
            });

            if (response.ok) {
                const updatedReport = await response.json();
                setSelectedReport(updatedReport); // Update the selected report with the new reply
                setReplyContent(""); // Clear the reply input
            } else {
                console.error("Lỗi khi gửi phản hồi");
            }
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error);
        }
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

                        {/* Chỉ hiển thị khung trả lời nếu báo cáo không phải của admin */}
                        {selectedReport.senderId !== 1 && (
                            <div className="reply-section">
                                <h3>Phản hồi</h3>
                                <textarea
                                    value={replyContent}
                                    onChange={handleReplyChange}
                                    placeholder="Nhập nội dung phản hồi"
                                />
                                <button onClick={() => handleReplySubmit(selectedReport.reportId)}>
                                    Gửi phản hồi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageReport;
