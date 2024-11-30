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


    const handlePageChange = (newPage) => {
        if (newPage < 1) newPage = 1; // Tránh chuyển đến trang nhỏ hơn 1
        if (newPage > totalPages) newPage = totalPages; // Tránh chuyển đến trang lớn hơn tổng số trang
        setCurrentPage(newPage);
    };
    
    // Nút "Trang đầu", "Trang cuối", "Trang trước", "Trang sau"
    const goToFirstPage = () => handlePageChange(1);
    const goToLastPage = () => handlePageChange(totalPages);
    const goToPreviousPage = () => handlePageChange(currentPage - 1);
    const goToNextPage = () => handlePageChange(currentPage + 1);

    return (
        <>
        <div className="categories-list">
            <h2>Các thể loại sách</h2>
            <hr />
            <div className="categories-list-content">
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
            </div>
            <div className="pagination">
                    <button onClick={goToFirstPage}>Trang đầu</button>
                    <button className="prevPage" onClick={goToPreviousPage}>Trang trước</button>
                    <span>{`Trang ${currentPage} / ${totalPages}`}</span>
                    <button className="nextPage" onClick={goToNextPage}>Trang sau</button>
                    <button onClick={goToLastPage}>Trang cuối</button>
                </div>
        </div>
    </>
    );
};

export default CategoriesList;
