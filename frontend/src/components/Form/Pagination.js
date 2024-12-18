// src/components/Pagination.js

import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            startPage = 1;
            endPage = Math.min(totalPages, maxPageButtons);
        } else if (currentPage + 2 >= totalPages) {
            startPage = Math.max(1, totalPages - (maxPageButtons - 1));
            endPage = totalPages;
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return { pages, startPage, endPage };
    };

    const { pages, startPage, endPage } = getPageNumbers();

    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                Đầu
            </button>
            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>

            {startPage > 1 && <span className="pagination-ellipsis">...</span>}

            {pages.map((page) => (
                <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? "active" : ""}`}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && <span className="pagination-ellipsis">...</span>}

            <button
                className="pagination-button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
            <button
                className="pagination-button"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                Cuối
            </button>
        </div>
    );
};

export default Pagination;
