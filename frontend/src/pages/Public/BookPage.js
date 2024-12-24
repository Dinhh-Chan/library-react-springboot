import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import "./BookPage.css";
import Modal from "../../components/Modal/Modal";
import BorrowBookTicket from "../../components/BookBorrowTicket/BookBorrowTicket";

function BookPage() {
    const { id } = useParams(); // Get `id` from URL
    const [book, setBook] = useState(null);
    const [inventory, setInventory] = useState(null); // New state for inventory
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
    const [visibleForm, setVisibleForm] = useState(false);

    useEffect(() => {
        // Function to fetch book and inventory details
        const fetchBookAndInventoryDetails = async () => {
            try {
                // Fetch book details
                const responseBook = await fetch(`http://localhost:8080/api/books/${id}`);
                if (!responseBook.ok) {
                    throw new Error("Không tìm thấy sách");
                }
                const bookData = await responseBook.json();
                setBook(bookData);

                // Fetch inventory details
                const responseInventory = await fetch(`http://localhost:8080/api/inventories/${id}`);
                if (!responseInventory.ok) {
                    throw new Error("Không tìm thấy thông tin tồn kho");
                }
                const inventoryData = await responseInventory.json();
                setInventory(inventoryData);

                setLoading(false); // Data fetched successfully
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBookAndInventoryDetails();
    }, [id]);

    // Handler for "Borrow Book" button click
    const handleBorrowClick = () => {
        const token = localStorage.getItem("token");

        if (token) {
            // User is logged in
            navigate("/borrow-ticket", { state: { book } });
        } else {
            // User is not logged in, redirect to login page
            alert("Vui lòng đăng nhập để mượn sách.");
            navigate("/login");
        }
    };

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="BookPageContainer">
                    <p>Đang tải thông tin sách...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavBar />
                <div className="BookPageContainer">
                    <p>{error}</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                <BorrowBookTicket />
            </Modal>
            <NavBar />
            <div className="BookPageWrapper">
                <div className="BookpageContainer1">
                    <div className="BookPageCover">
                        <img src={book.file} alt={`Cover of ${book.title}`} />
                    </div>
                    <div>
                        <div className="BookPageInformations">
                            <h1>Tên sách: {book.title}</h1>
                            <p>
                                Tác giả: {book.authors.map((author) => author.name).join(", ")}
                            </p>
                            <p>
                                Năm xuất bản: {book.pubshedYear || "Không có thông tin"}
                            </p>
                            <p>
                                Thể loại:{" "}
                                {book.categories.length > 0
                                    ? book.categories.map((category) => category.categoryName).join(", ")
                                    : "Không có thông tin"}
                            </p>
                            <p>Mã sách: {book.id}</p>
                            <p>Số lượng tồn kho: {inventory.availableStock > 0 ? inventory.availableStock : "Hết hàng"}</p>
                              
                        </div>
                        <div>
                            <button className="BookPageButton" onClick={handleBorrowClick}>
                                Mượn sách
                            </button>
                        </div>
                        <hr />
                        <div className="description-container">
                            <b>Mô tả:</b>
                            <p>{book.description || "Không có thông tin"}</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default BookPage;
