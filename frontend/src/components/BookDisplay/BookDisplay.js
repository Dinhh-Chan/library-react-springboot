import React, { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";
import { useNavigate } from "react-router-dom";
import "./BookDisplay.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";


const BookDisplay = () => {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Add loading state
  const booksPerPage = 49;
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await fetch("http://localhost:8080/api/books");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books.slice(startIndex, Math.min(endIndex, books.length));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = [];
  const range = 2;
  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    pageNumbers.push(i);
  }

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <div className="book-container">
      <h1>Danh sách sách</h1>
      <hr />
      
      {loading ? (
        <div className="loading-spinner">
          <p>Đang tải sách...</p>
          <div className="spinner"></div> {/* You can add a CSS spinner here */}
        </div>
      ) : (
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
      )}

      <div className="pagination">
        <button className="active" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
          Đầu
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faLessThan}></FontAwesomeIcon>
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
          <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
        </button>
        <button className="active" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
          Cuối
        </button>
      </div>
    </div>
  );
};

export default BookDisplay;