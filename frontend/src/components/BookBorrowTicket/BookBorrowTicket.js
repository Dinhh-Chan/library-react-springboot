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
        fetchUserData();
    }, [readerId]);

    const handleBorrowBook = async () => {
        console.log(readerId);

        if (!readerId) {
            alert("Vui lòng đăng nhập để mượn sách.");
            navigate("/login");
            return;
        }

        const borrowDate = new Date().toISOString().split("T")[0]; // Ngày mượn hiện tại
        const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // Ngày trả dự kiến (14 ngày sau)

        try {
            console.log(readerId, book.id, borrowDate, returnDate)
            const response = await axios.post("http://localhost:8080/api/borrowings", {
                readerId,
                bookId: book.id,
            });

            if (response.status === 201) {
                alert("Mượn sách thành công!");
                navigate("/"); 
            }
        } catch (error) {
            console.error("Lỗi khi mượn sách:", error);
            alert("Không thể mượn sách. Vui lòng thử lại sau.");
        }
    };

    if (!book) {
        return <div>Không có thông tin sách để hiển thị.</div>;
    }

    return (
        <>
            <div className="BorrowBookTicketWrapper">
                <div>
                    <h2>Đơn mượn sách</h2>
                    <hr />
                </div>
                <div style={{ display: "flex", gap: "5rem", margin: "2rem", marginLeft: "5rem", marginRight: "5rem" }}>
                    <div className="BookBorrowTicketCover"><img src={book.file} alt="Book cover" /></div>
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
                        <p>Tên người mượn: {userData.username || "Không có thông tin"}</p> {/* Lấy từ thông tin API */}
                        <p>Id bạn đọc: {readerId}</p>
                    </div>
                    <div>
                        <p>Thông tin liên lạc: {userData.contactInfo || "Không có thông tin"}</p>
                    </div>
                </div>
                <hr />
                <div style={{ margin: "2rem", textAlign: "right" }}>
                    <p style={{ color: "grey", fontSize: "14px", lineHeight: "80%" }}>Vui lòng chỉ Nhấn "Mượn sách" khi đã chấp nhận quy định mượn sách. Đơn mượn sẽ được duyệt trong vòng 24h.</p>
                    <button className="BorrowBookButton" onClick={handleBorrowBook}>Mượn sách</button>
                </div>
            </div>
        </>
    );
}

export default BorrowBookTicket;
