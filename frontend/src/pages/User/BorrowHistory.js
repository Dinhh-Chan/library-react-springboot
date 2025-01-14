import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowHistory = () => {
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState("ALL");
    
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchBorrowHistory = async () => {
            try {
                const userId = localStorage.getItem("id_user");
                if (!userId) {
                    setError("Người dùng chưa đăng nhập.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://localhost:8080/api/borrowings");
                const userHistory = response.data.filter((item) => item.readerId === parseInt(userId));

                if (userHistory.length === 0) {
                    setError("Không có lịch sử mượn sách nào.");
                } else {
                    setBorrowHistory(userHistory);
                    setFilteredHistory(userHistory); // Khởi tạo danh sách lọc ban đầu
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi lấy dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowHistory();
    }, []);

    // Cập nhật danh sách dựa trên bộ lọc
    useEffect(() => {
        if (filterStatus === "ALL") {
            setFilteredHistory(borrowHistory);
        } else {
            setFilteredHistory(
                borrowHistory.filter((item) => item.status === filterStatus)
            );
        }
        setCurrentPage(1); // Reset về trang đầu khi thay đổi bộ lọc
    }, [filterStatus, borrowHistory]);

    // Tính toán các trang
    const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

    // Lấy danh sách hiển thị cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Hàm chuyển trang trước
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Hàm chuyển trang sau
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="borrow-history">
            <h1>Lịch sử mượn sách</h1>
            <div className="filter-container">
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Tất cả</option>
                    <option value="DANG_MUON">Đang mượn</option>
                    <option value="DA_TRA">Đã trả</option>
                    <option value="DANG_CHO_DUYET">Đang chờ duyệt</option>
                </select>
            </div>

            <div className="borrow-list">
                {currentItems.length === 0 ? (
                    <p>Không có lịch sử mượn sách phù hợp.</p>
                ) : (
                    currentItems.map((borrow) => (
                        <div key={borrow.id} className="borrow-item">
                            <img
                                src={borrow.linkFile || "https://via.placeholder.com/50"}
                                alt={`Bìa sách ${borrow.bookTitle}`}
                                className="book-cover"
                            />
                            <div className="borrow-details">
                                <h3 className="book-title">Tên sách: {borrow.bookTitle}</h3>
                                <p>Ngày mượn: {borrow.borrowDate}</p>
                                <p>Ngày trả dự kiến: {borrow.returnDate}</p>
                                {borrow.actualReturnDate && (
                                    <p>Ngày trả thực tế: {borrow.actualReturnDate}</p>
                                )}
                                <p>
                                    Trạng thái:{" "}
                                    {borrow.status === "DANG_MUON"
                                        ? "Đang mượn"
                                        : borrow.status === "DA_TRA"
                                        ? "Đã trả"
                                        : borrow.status === "DANG_CHO_DUYET"
                                        ? "Đang chờ duyệt"
                                        : "Không xác định"}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Phân trang */}
            {filteredHistory.length > itemsPerPage && (
                <div className="pagination">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Trang trước
                    </button>
                    {/* Hiển thị các số trang */}
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`pagination-button ${currentPage === number ? "active" : ""}`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
};

export default BorrowHistory;
