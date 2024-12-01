import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";


function NotificationPage() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [visibleForm, setVisibleForm] = useState(true);
    const userId = localStorage.getItem("id_user");
    const [senderId, setSenderId] = useState("")
    const [sender, setSender] = useState([])

    useEffect(() => {
        // Fetch danh sách báo cáo từ API
        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/reports");
                const data = await response.json();
                const userNoti = data.filter(data => data.receiverId == userId)
                setReports(userNoti);
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
            const senderId = data.senderId;
            setSenderId(senderId);
            if (senderId) {
                // Fetch sender details
                const responseReader = await fetch(`http://localhost:8080/api/readers/${senderId}`);
                const senderData = await responseReader.json();
                setSender(senderData);
            }
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
                report.reportId === reportId ? { ...report, status: "Read" } : report
            )
        );
    };

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

    return ( <>
        <div className="form-container">
            <h1>Thông báo</h1>
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
                            <h3>Thông tin người gửi {senderId}</h3>
                            <p><b>Họ và tên:</b> {sender.hoVaTen}</p>
                            <p><b>Tên người dùng:</b> {sender.username}</p>
                            <p><b>Gmail:</b> {sender.email}</p>
                            <p><b>Số điện thoại:</b> {sender.numberPhone}</p>
                            <p><b>Ngày sinh:</b> {sender.dateOfBirth || "Chưa có thông tin"}</p>
                        </div>
                </Modal>
            )}
        </div>
    </> );
}

export default NotificationPage;