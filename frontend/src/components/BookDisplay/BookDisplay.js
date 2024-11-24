import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";
import { useNavigate } from "react-router-dom";
import "./BookDisplay.css";

const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 28; // Số sách tối đa trên 1 trang
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // Tính toán sách hiển thị trên trang hiện tại
  const totalPages = Math.ceil(books.length / booksPerPage); // Tổng số trang
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books.slice(startIndex, Math.min(endIndex, books.length));

  // Xử lý khi nhấn nút chuyển trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="book-container">
      <h1>Sách nổi bật</h1>
      <hr></hr>
      <div className="book-grid">
        {currentBooks.map((book) => (
          <BookCard
            key={book.id}
            file={book.file}
            id={book.id}
            title={book.title}
            author={book.authors.map((author) => author.name).join(", ")}
            onClick={() => handleBookClick(book.id)}
          />
        ))}
      </div>
      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
export default BookDisplay;