import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal/Modal";

const ManageReport = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [replies, setReplies] = useState([]);
    const [visibleForm, setVisibleForm] = useState(true);

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

    // Hàm lấy các phản hồi của báo cáo
    const fetchReplies = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}/replies`);
            const data = await response.json();
            setReplies(data);
        } catch (error) {
            console.error("Lỗi khi lấy phản hồi:", error);
        }
    };

    // Hàm xóa phản hồi
    const handleDeleteReply = async (replyId, reportId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/reply/${replyId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Cập nhật lại danh sách phản hồi sau khi xóa
                setReplies(replies.filter(reply => reply.reportId !== replyId));
                console.log("Phản hồi đã bị xóa.");
            } else {
                console.error("Lỗi khi xóa phản hồi");
            }
        } catch (error) {
            console.error("Lỗi khi xóa phản hồi:", error);
        }
    };

    const handleReportClick = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/reports/${reportId}`);
            const data = await response.json();
            setSelectedReport(data);
            fetchReplies(reportId);  // Gọi hàm để lấy phản hồi của báo cáo này
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết báo cáo:", error);
        }
        await fetch(`http://localhost:8080/api/reports/${reportId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "READ" }),
        });

        // Update the state to reflect the "read" status
        setReports((prevReports) =>
            prevReports.map((report) =>
                report.reportId === reportId ? { ...report, status: "READ" } : report
            )
        );
    };

    const handleCloseModal = () => {
        setSelectedReport(null); // Đóng modal
        setReplies([]); // Xóa danh sách phản hồi khi đóng modal
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
                fetchReplies(reportId); // Refresh the replies after submitting a new one
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
                {reports
                    .filter(report => report.senderId !== 1) // Chỉ hiển thị các báo cáo gửi đến admin
                    .map((report) => (
                        <li className={report.status == "UNREAD"? "Unread": "Read"} key={report.reportId} onClick={() => {handleReportClick(report.reportId)
                            setVisibleForm(true)
                        }}>
                            <h3>{report.title}</h3>
                            <p>{formatDate(report.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                        </li>
                    ))}
            </ul>

            {/* Modal thông tin chi tiết báo cáo */}
            {selectedReport && (
                <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>

                        <h2>{selectedReport.title}</h2>
                        <p><b>Nội dung:</b> {selectedReport.content}</p>
                        <p><b>Thời gian tạo:</b> {formatDate(selectedReport.createdAt)}</p> {/* Hiển thị thời gian đã format */}
                        <div>
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

                        {/* Hiển thị các phản hồi của báo cáo */}
                        <div className="replies-section">
                            <h3>Phản hồi:</h3>
                            {replies.length > 0 ? (
                                <ul>
                                    {replies.map((reply) => (
                                        <li key={reply.reportId}>
                                            <p><b>{reply.title}</b></p>
                                            <p>{reply.content}</p>
                                            <p><i>{formatDate(reply.createdAt)}</i></p>
                                            <p><b>Trạng thái:</b> {reply.status==="UNREAD"? "Chưa đọc":"Đã đọc"}</p>
                                            {/* Nút xóa phản hồi */}
                                            <button className="DeleteButton" onClick={() => handleDeleteReply(reply.reportId, selectedReport.reportId)}>
                                                Xóa
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Không có phản hồi nào.</p>
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
                </Modal>
            )}
        </div>
    );
};

export default ManageReport;
