import React, { useState, useEffect } from "react";
import axios from "axios";

const BorrowHistory = () => {
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const filteredData = response.data.filter((item) => item.id === parseInt(userId));

                if (filteredData.length === 0) {
                    setError("Không có lịch sử mượn sách nào.");
                } else {
                    setBorrowHistory(filteredData);
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi lấy dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowHistory();
    }, []);

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>{error}</p>;

    return (
        <>
            {/* Borrow History */}
            <div className="borrow-history">
                <h1>Lịch sử mượn sách</h1>
                <div className="borrow-list">
                    {borrowHistory.map((borrow) => (
                        <div key={borrow.id} className="borrow-item">
                            <img
                                src="https://via.placeholder.com/50" 
                                alt="Bìa sách"
                                className="book-cover"
                            />
                            <div className="borrow-details">
                                <h3 className="book-title">Mã mượn: {borrow.id}</h3>
                                <p>Ngày mượn: {borrow.borrowDate}</p>
                                <p>Ngày trả dự kiến: {borrow.returnDate}</p>
                                <p>
                                    Trạng thái:{" "}
                                    {borrow.status === "DANG_MUON"
                                        ? "Đang mượn"
                                        : borrow.status === "DA_TRA"
                                        ? "Đã trả"
                                        : "Không xác định"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BorrowHistory;
