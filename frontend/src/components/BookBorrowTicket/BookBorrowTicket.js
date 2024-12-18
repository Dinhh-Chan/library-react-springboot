import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookBorrowTicket.css";

function BorrowBookTicket() {
    const location = useLocation();
    const navigate = useNavigate();
    const book = location.state?.book;
    const readerId = localStorage.getItem("id_user");
    const [userData, setUserData] = useState({});
    const [borrowLimit, setBorrowLimit] = useState(0); // Số lượng mượn tối đa
    const [borrowing, setBorrowing] = useState(null); // Thông tin đơn mượn hiện tại
    const [borrowingStatus, setBorrowingStatus] = useState(""); // Trạng thái đơn mượn

    // Định nghĩa statusMap trong component
    const statusMap = {
        "DANG_MUON": "Đang mượn",
        "DA_TRA": "Đã trả",
        "DANG_CHO_DUYET": "Đang chờ duyệt",
        "QUA_HAN": "Quá hạn"
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (readerId) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/readers/${readerId}`);
                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }
            }
        };

        // Kiểm tra số lượng đơn mượn
        const checkBorrowLimit = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/borrowings/user/${readerId}/limit`);
                if (response.status === 200) {
                    setBorrowLimit(response.data.count); // Lấy số lượng mượn hiện tại
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra số đơn mượn:", error);
            }
        };

        // Fetch đơn mượn hiện tại của người dùng
        const fetchCurrentBorrowing = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/borrowings/user/${readerId}`);
                if (response.status === 200) {
                    // Tìm đơn mượn liên quan đến cuốn sách hiện tại và chưa trả
                    const currentBorrowing = response.data.find(borrow => borrow.bookId === book.id && borrow.status === "DANG_MUON");
                    if (currentBorrowing) {
                        setBorrowing(currentBorrowing);
                        // Kiểm tra trạng thái
                        const today = new Date();
                        const expectedReturnDate = new Date(currentBorrowing.returnDate);
                        if (today > expectedReturnDate) {
                            setBorrowingStatus("QUA_HAN");
                            console.log("Trạng thái đặt: QUA_HAN");
                        } else {
                            setBorrowingStatus("DANG_MUON");
                            console.log("Trạng thái đặt: DANG_MUON");
                        }
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy đơn mượn hiện tại:", error);
            }
        };

        fetchUserData();
        checkBorrowLimit(); // Kiểm tra số lượng mượn khi component được mount
        fetchCurrentBorrowing(); // Lấy đơn mượn hiện tại
    }, [readerId, book.id]);

    const handleBorrowBook = async () => {
        if (!readerId) {
            alert("Vui lòng đăng nhập để mượn sách.");
            navigate("/login");
            return;
        }

        // Kiểm tra số lượng đơn mượn trước khi mượn thêm
        if (borrowLimit >= 10) {
            alert("Bạn không thể mượn thêm sách. Vui lòng trả lại sách trước khi mượn thêm.");
            return;
        }

        const borrowDate = new Date().toISOString().split("T")[0]; // Ngày mượn hiện tại
        const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // Ngày trả dự kiến (14 ngày sau)

        try {
            console.log(readerId, book.id, borrowDate, returnDate);
            const response = await axios.post("http://localhost:8080/api/borrowings", {
                readerId,
                bookId: book.id,
                borrowDate,  // Ngày mượn
                returnDate,  // Ngày trả dự kiến
            });

            if (response.status === 201) {
                alert("Đơn mượn của bạn đã được gửi đi và chờ duyệt");

                // Lưu thông tin mượn sách vào state
                setBorrowing(response.data);

                // Cập nhật trạng thái sau khi mượn sách
                const today = new Date();
                const expectedReturn = new Date(returnDate);
                if (today > expectedReturn) {
                    setBorrowingStatus("QUA_HAN");
                } else {
                    setBorrowingStatus("DANG_MUON");
                }

                // Tăng số lượng mượn hiện tại
                setBorrowLimit(prevLimit => prevLimit + 1);
            }
        } catch (error) {
            console.error("Lỗi khi mượn sách:", error);
            alert("Không thể mượn sách. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="BorrowBookTicketWrapper">
            <div>
                <h2>Đơn mượn sách</h2>
                <hr />
            </div>
            <div style={{ display: "flex", gap: "5rem", margin: "2rem", marginLeft: "5rem", marginRight: "5rem" }}>
                <div className="BookBorrowTicketCover">
                    <img src={book.file} alt="Book cover" />
                </div>
                <div>
                    <h2>Tên sách: {book.title}</h2>
                    <p>Mô tả: {book.description || "Không có thông tin"}</p>
                    <p>Tác giả: {book.authors.map((author) => author.name).join(", ")}</p>
                    <p>Nhà xuất bản: {book.publisher || "Không có thông tin"}</p>
                    <p>Năm xuất bản: {book.pubshedYear || "Không có thông tin"}</p>
                    <p>Thể loại: {book.categories.length > 0 ? book.categories.map((category) => category.categoryName).join(", ") : "Không có thông tin"}</p>
                    <p>Mã sách: {book.id}</p>
                </div>
            </div>
            <hr />
            <div style={{ display: "flex", gap: "20rem", margin: "2rem", marginLeft: "5rem", marginRight: "5rem" }}>
                <div>
                    <p>Tên người mượn: {userData.username || "Không có thông tin"}</p>
                    <p>Id bạn đọc: {readerId}</p>
                </div>
                <div>
                    <p>Thông tin liên lạc: {userData.contactInfo || "Không có thông tin"}</p>
                </div>
            </div>
            <hr />
            {borrowing && (
                <>
                    <div style={{ display: "flex", gap: "20rem", margin: "2rem", marginLeft: "5rem", marginRight: "5rem" }}>
                        <div>
                            <p>Ngày mượn: {borrowing.borrowDate}</p>
                            <p>Ngày trả dự kiến: {borrowing.returnDate}</p>
                        </div>
                        <div>
                            <p>
                                Trạng thái:{" "}
                                <span className={`status-${borrowingStatus.toLowerCase().replace(/_/g, '-')}`}>
                                    {statusMap[borrowingStatus] || "Không xác định"}
                                </span>
                                {console.log("Status Map:", statusMap)}
                                {console.log("Borrowing Status:", borrowingStatus)}
                            </p>
                        </div>
                    </div>
                    <hr />
                </>
            )}
            <div style={{ margin: "2rem", textAlign: "right" }}>
                <p style={{ color: "grey", fontSize: "14px", lineHeight: "80%" }}>
                    Vui lòng chỉ Nhấn "Mượn sách" khi đã chấp nhận quy định mượn sách. Đơn mượn sẽ được duyệt trong vòng 24h.
                </p>
                <button className="BorrowBookButton" onClick={handleBorrowBook}>Mượn sách</button>
            </div>
        </div>
    );
}

export default BorrowBookTicket;
