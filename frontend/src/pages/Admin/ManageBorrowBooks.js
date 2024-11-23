import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ManageBorrowBooks = () => {
    const [borrowBooks, setBorrowBooks] = useState([]);

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchBorrowBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/borrowings");
                const formattedData = response.data.map((borrow) => ({
                    id: borrow.id,
                    bookTitle: `Sách ID ${borrow.id}`, 
                    bookCover: "https://via.placeholder.com/50", 
                    borrowDate: borrow.borrowDate,
                    returnDate: borrow.returnDate,
                    status: borrow.status,
                    name: `Người mượn ID ${borrow.id}`, 
                }));
                setBorrowBooks(formattedData);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu sách đang mượn:", err);
            }
        };

        fetchBorrowBooks();
    }, []);

    return (
        <>
        <div className="borrow-history">
            <div className="Borrow-history-header">
                <h1>Sách đang được mượn</h1>
                <div style={{display:"flex", alignItems:"center", gap:'10px'}}>
                    <SearchBar></SearchBar>
                    <button className="CreateButton"><FontAwesomeIcon icon={faPlus}/></button>
                </div>
            </div>
            <div className="borrow-list">
                {borrowBooks.length === 0 ? (
                    <p className="empty-history">Không có lịch sử mượn sách nào.</p>
                ) : (
                    borrowBooks.map((borrow) => (
                        <div key={borrow.id} className="borrow-item">
                            <img
                                src={borrow.bookCover}
                                alt={`Bìa sách: ${borrow.bookTitle}`}
                                className="book-cover"
                            />
                            <div className="borrow-details">
                                <h3 className="book-title">{borrow.bookTitle}</h3>
                                <p>Ngày mượn: {borrow.borrowDate}</p>
                                <p>Ngày trả dự kiến: {borrow.returnDate}</p>
                                <p>Người mượn: {borrow.name} (id: {1})</p>
                            </div>
                            
                            <button className="UpdateButton"><FontAwesomeIcon icon={faPen}/></button>
                            <button className="DeleteButton"><FontAwesomeIcon icon={faTrash}/></button>
                        </div>
                    ))
                )}
            </div>
        </div>
    </>
    );
};

export default ManageBorrowBooks;
