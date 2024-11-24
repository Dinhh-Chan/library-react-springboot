import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import BookCard from "../BookCard/BookCard";
import "./BookByCategory.css";

const BooksByCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState("");
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/categories/${categoryId}`);
                setCategoryName(response.data.categoryName);
            } catch (error) {
                console.error("Error fetching category name:", error);
                setError("Không thể tải thông tin danh mục. Vui lòng thử lại.");
            }
        };

        fetchCategoryName();
    }, [categoryId]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/books/by-category/${categoryId}`);
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
                setError("Không thể tải danh sách sách. Vui lòng thử lại.");
            }
        };

        fetchBooks();
    }, [categoryId]);

    const handleBookClick = (id) => {
        navigate(`/books/${id}`);
    };

    return (
        <>
            <NavBar />
            <div className="books-by-category">
                <h1 className="aaaaaaaa">Danh sách sách theo thể loại: {categoryName}</h1>
                {error ? (
                    <p className="error-message">{error}</p>
                ) : books.length === 0 ? (
                    <p className="empty-message">Không có sách nào trong thể loại này.</p>
                ) : (
                    <div className="books-grid">
                        {books.map((book) => (
                            <BookCard
                                key={book.id}
                                id={book.id}
                                file={book.file}
                                title={book.title}
                                author={book.authors?.map((author) => author.name) || []}
                                onClick={handleBookClick}
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BooksByCategory;
