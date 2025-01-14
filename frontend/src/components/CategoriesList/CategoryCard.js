import React from "react";
import "./CategoryCard.css";

function CategoryCard({ title, id, onClick }) {
    return (
        <div className="CategoryCardWrapper" onClick={() => onClick(id)}>
            <b>{title}</b>
        </div>
    );
}

export default CategoryCard;
