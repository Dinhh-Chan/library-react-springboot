import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";

function NotificationPage() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [visibleForm, setVisibleForm] = useState(true);
    const userId = localStorage.getItem("id_user");
    const [sender, setSender] = useState({});
    const [currentPage, setCurrentPage] = useState(0); // Trạng thái lưu trang hiện tại
    const [reportsPerPage] = useState(5); // Số lượng báo cáo mỗi trang

    useEffect(() => {
        // Fetch danh sách báo cáo từ API
        const fetchReports = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/reports");
                const userNoti = response.data.filter((report) => report.receiverId == userId);
                setReports(userNoti);
            } catch (error) {
                console.error("Lỗi khi lấy báo cáo:", error);
            }
        };
        fetchReports();
    }, [userId]);

    // Xử lý phân trang
    const indexOfLastReport = (currentPage + 1) * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const handleReportClick = async (reportId) => {
        try {
            // Lấy thông tin chi tiết của báo cáo khi click vào báo cáo
            const response = await axios.get(`http://localhost:8080/api/reports/${reportId}`);
            setSelectedReport(response.data);
            const senderId = response.data.senderId;
            if (senderId) {
                // Fetch sender details
                const responseReader = await axios.get(`http://localhost:8080/api/readers/${senderId}`);
                setSender(responseReader.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết báo cáo:", error);
        }

        await axios.put(`http://localhost:8080/api/reports/${reportId}/status`, {
            status: "READ",
        });

        // Update the state to reflect the "read" status
        setReports((prevReports) =>
            prevReports.map((report) =>
                report.reportId === reportId ? { ...report, status: "READ" } : report
            )
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < Math.ceil(reports.length / reportsPerPage)) {
            setCurrentPage(page);
        }
    };

    return (
        <>
            <div className="form-container">
                <h1>Thông báo</h1>
                <div className="borrow-list">
                    <ul>
                        {currentReports.map((report) => (
                            <li
                                className={report.status === "UNREAD" ? "Unread" : "Read"}
                                key={report.reportId}
                                onClick={() => {
                                    handleReportClick(report.reportId);
                                    setVisibleForm(true);
                                }}
                            >
                                <h3>{report.title}</h3>
                                <p>{formatDate(report.createdAt)}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Modal thông tin chi tiết báo cáo */}
                {selectedReport && (
                    <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                        <h2>{selectedReport.title}</h2>
                        <p><b>Nội dung:</b> {selectedReport.content}</p>
                        <p><b>Thời gian tạo:</b> {formatDate(selectedReport.createdAt)}</p>
                        <div>
                            <h3>Thông tin người gửi </h3>
                            <p><b>Họ và tên:</b> {sender.hoVaTen}</p>
                            <p><b>Gmail:</b> {sender.email}</p>
                            <p><b>Số điện thoại:</b> {sender.numberPhone}</p>
                            <p><b>Ngày sinh:</b> {sender.dateOfBirth || "Chưa có thông tin"}</p>
                        </div>
                    </Modal>
                )}

                {/* Pagination Controls */}
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 0}
                    >
                        Trước
                    </button>
                    <span>
                        Trang {currentPage + 1} / {Math.ceil(reports.length / reportsPerPage)}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= Math.ceil(reports.length / reportsPerPage) - 1}
                    >
                        Sau
                    </button>
                </div>
            </div>
        </>
    );
}

export default NotificationPage;
