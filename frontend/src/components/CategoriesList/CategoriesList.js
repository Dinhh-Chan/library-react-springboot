import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CategoriesList.css";
import CategoryCard from "./CategoryCard";

const CategoriesList = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 24; 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    const currentCategories = categories.slice(startIndex, Math.min(endIndex, categories.length));

    const handleCategoryClick = (categoryId) => {
        navigate(`/categories/${categoryId}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="categories-list">
            <h2>Categories</h2>
            <hr />
            <ul>
                {currentCategories.map((category) => (
                    <CategoryCard
                        key={category.id}
                        id={category.id}
                        title={category.categoryName}
                        onClick={handleCategoryClick}
                    />
                ))}
            </ul>
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

export default CategoriesList;
