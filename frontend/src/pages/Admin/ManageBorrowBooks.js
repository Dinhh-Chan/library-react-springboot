import { useEffect, useState } from "react";
import SearchBarAdmin from "./SearchBarAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ManageBorrowBooks = () => {
    const [borrowBooks, setBorrowBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchBorrowBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/borrowings");
                setBorrowBooks(response.data);
                setFilteredBooks(response.data); // Lưu trữ danh sách ban đầu
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu sách đang mượn:", err);
            }
        };

        fetchBorrowBooks();
    }, []);

    // Lọc danh sách dựa trên trạng thái
    useEffect(() => {
        let books = [...borrowBooks];

        if (filterStatus !== "ALL") {
            books = books.filter((book) => book.status === filterStatus);
        }

        if (searchQuery) {
            books = books.filter(
                (book) =>
                    book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    book.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredBooks(books);
    }, [filterStatus, searchQuery, borrowBooks]);

    // Duyệt mượn sách
    const approveBorrowing = async (id, readerId, bookId) => {
        try {
            await axios.post(`http://localhost:8080/api/borrowings/${id}/approve`, {
                idReader: readerId,
                bookId: bookId,
            });
            setBorrowBooks((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: "DANG_MUON" } : item
                )
            );
            alert("Đơn mượn đã được duyệt.");
        } catch (err) {
            console.error("Lỗi khi duyệt mượn sách:", err);
            alert("Không thể duyệt mượn sách. Vui lòng thử lại.");
        }
    };

    // Đánh dấu sách đã trả
    const markAsReturned = async (id, readerId, bookId) => {
        try {
            await axios.post(`http://localhost:8080/api/borrowings/${id}/return`, {
                idReader: readerId,
                bookId: bookId,
            });
            setBorrowBooks((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: "DA_TRA", actualReturnDate: new Date().toISOString().split("T")[0] } : item
                )
            );
            alert("Sách đã được đánh dấu là đã trả.");
        } catch (err) {
            console.error("Lỗi khi đánh dấu sách đã trả:", err);
            alert("Không thể cập nhật trạng thái trả sách. Vui lòng thử lại.");
        }
    };

    // Xóa đơn mượn
    const deleteBorrowing = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đơn mượn này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/borrowings/${id}`);
            setBorrowBooks((prev) => prev.filter((item) => item.id !== id));
            alert("Đơn mượn đã được xóa.");
        } catch (err) {
            console.error("Lỗi khi xóa đơn mượn:", err);
            alert("Không thể xóa đơn mượn. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <div className="borrow-history">
                <div className="Borrow-history-header">
                    <h1>Đơn mượn sách</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <SearchBarAdmin
                            placeholder="Tìm kiếm theo tên sách hoặc người mượn..."
                            onSearch={(value) => setSearchQuery(value)}
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="status-filter"
                        >
                            <option value="ALL">Tất cả</option>
                            <option value="DANG_CHO_DUYET">Đang chờ duyệt</option>
                            <option value="DANG_MUON">Đang mượn</option>
                            <option value="DA_TRA">Đã trả</option>
                        </select>
                    </div>
                </div>
                <div className="borrow-list">
                    {filteredBooks.length === 0 ? (
                        <p className="empty-history">Không có đơn mượn nào.</p>
                    ) : (
                        filteredBooks.map((borrow) => (
                            <div key={borrow.id} className="borrow-item">
                                <img
                                    src={borrow.linkFile}
                                    alt={`Bìa sách: ${borrow.bookTitle}`}
                                    className="book-cover"
                                />
                                <div className="borrow-details">
                                    <h3 className="book-title">{borrow.bookTitle}</h3>
                                    <p>Người mượn: {borrow.username} (ID: {borrow.readerId})</p>
                                    <p>Trạng thái: {borrow.status}</p>
                                    {borrow.status !== "DANG_CHO_DUYET" && (
                                        <>
                                            <p>Ngày mượn: {borrow.borrowDate}</p>
                                            <p>Ngày trả dự kiến: {borrow.returnDate}</p>
                                        </>
                                    )}
                                    {borrow.status === "DA_TRA" && (
                                        <p>Ngày trả thực tế: {borrow.actualReturnDate || "Không có thông tin"}</p>
                                    )}
                                </div>
                                <div className="borrow-actions">
                                    {borrow.status === "DANG_CHO_DUYET" && (
                                        <button
                                            className="AcceptButton"
                                            onClick={() =>
                                                approveBorrowing(
                                                    borrow.id,
                                                    borrow.readerId,
                                                    borrow.bookId
                                                )
                                            }
                                        >
                                            Duyệt
                                        </button>
                                    )}
                                    {borrow.status === "DANG_MUON" && (
                                        <button
                                            className="ReturnButton"
                                            onClick={() =>
                                                markAsReturned(
                                                    borrow.id,
                                                    borrow.readerId,
                                                    borrow.bookId
                                                )
                                            }
                                        >
                                            Đã trả
                                        </button>
                                    )}
                                    {borrow.status === "DA_TRA" && (
                                        <button
                                            className="DeleteButton"
                                            onClick={() => deleteBorrowing(borrow.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default ManageBorrowBooks;
