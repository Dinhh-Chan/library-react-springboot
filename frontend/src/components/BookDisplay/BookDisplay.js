import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";
import { useNavigate } from "react-router-dom";
import "./BookDisplay.css";

const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 49; // Số sách tối đa trên 1 trang
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

  // Hiển thị phạm vi các trang gần trang hiện tại (ví dụ: 5 trang quanh trang hiện tại)
  const pageNumbers = [];
  const range = 2; // Số lượng trang hiển thị quanh trang hiện tại
  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    pageNumbers.push(i);
  }

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="book-container">
      <h1>Danh sách sách</h1>
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
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Đầu
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Trước
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        ))}

        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Tiếp theo
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Cuối
        </button>
      </div>
    </div>
  );
};
export default BookDisplay;