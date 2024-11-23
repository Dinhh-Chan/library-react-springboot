import React, { useState } from "react";
import "./BookCard.css";

function BookCard({ id, file, title, authors = [], onClick }) {
    const [isHover, setIsHover] = useState(false);

    return (
        <div
            className="BookWrapper"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={() => onClick(id)}
        >
            <div className="BookCover">
                <img src={file} alt={`Cover of ${title}`} />
            </div>
            {isHover && (
                <div className="BookCardContainer">
                    <b>{title}</b>
                    <p>Tác giả: {authors.length > 0 ? authors.join(", ") : "Không rõ"}</p>
                </div>
            )}
        </div>
    );
}

export default BookCard;
