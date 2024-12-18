// src/components/Form/AddForm.js

import React, { useState, useEffect } from "react";
import "./Form.css";
import axios from "axios";

function AddForm({ bookData, setBookData, setVisibleForm, save }) {
    const [existingCategories, setExistingCategories] = useState([]);
    const [existingAuthors, setExistingAuthors] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAuthor, setNewAuthor] = useState("");

    // States để quản lý modals
    const [isSelectCategoryModalOpen, setIsSelectCategoryModalOpen] = useState(false);
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [isSelectAuthorModalOpen, setIsSelectAuthorModalOpen] = useState(false);
    const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    // States cho tìm kiếm và phân trang danh mục
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [categoryCurrentPage, setCategoryCurrentPage] = useState(1);
    const categoriesPerPage = 10;

    // States cho tìm kiếm và phân trang tác giả
    const [authorSearchTerm, setAuthorSearchTerm] = useState("");
    const [authorCurrentPage, setAuthorCurrentPage] = useState(1);
    const authorsPerPage = 10;

    // Loading states
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);

    useEffect(() => {
        // Fetch existing categories
        const fetchCategories = async () => {
            setIsLoadingCategories(true);
            try {
                const response = await axios.get("http://localhost:8080/api/categories");
                setExistingCategories(response.data);
                console.log("Fetched Categories:", response.data); // Debug
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        // Fetch existing authors
        const fetchAuthors = async () => {
            setIsLoadingAuthors(true);
            try {
                const response = await axios.get("http://localhost:8080/api/authors");
                setExistingAuthors(response.data);
                console.log("Fetched Authors:", response.data); // Debug
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setIsLoadingAuthors(false);
            }
        };

        fetchCategories();
        fetchAuthors();
    }, []);

    // Hàm mở và đóng các modals
    const openSelectCategoryModal = () => {
        console.log("Opening Select Category Modal with categories:", existingCategories);
        setIsSelectCategoryModalOpen(true);
    };
    const closeSelectCategoryModal = () => setIsSelectCategoryModalOpen(false);

    const openAddCategoryModal = () => setIsAddCategoryModalOpen(true);
    const closeAddCategoryModal = () => setIsAddCategoryModalOpen(false);

    const openSelectAuthorModal = () => setIsSelectAuthorModalOpen(true);
    const closeSelectAuthorModal = () => setIsSelectAuthorModalOpen(false);

    const openAddAuthorModal = () => setIsAddAuthorModalOpen(true);
    const closeAddAuthorModal = () => setIsAddAuthorModalOpen(false);

    // Hàm chọn danh mục
    const handleSelectCategory = (categoryName) => {
        if (selectedCategories.includes(categoryName)) {
            setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
        } else {
            setSelectedCategories([...selectedCategories, categoryName]);
        }
    };

    // Hàm chọn tác giả
    const handleSelectAuthor = (authorName) => {
        if (selectedAuthors.includes(authorName)) {
            setSelectedAuthors(selectedAuthors.filter(auth => auth !== authorName));
        } else {
            setSelectedAuthors([...selectedAuthors, authorName]);
        }
    };

    // Hàm lưu các danh mục đã chọn vào bookData
    const handleSaveSelectedCategories = () => {
        setBookData({ ...bookData, categoryNames: selectedCategories });
        setSelectedCategories([]);
        closeSelectCategoryModal();
    };

    // Hàm lưu các tác giả đã chọn vào bookData
    const handleSaveSelectedAuthors = () => {
        setBookData({ ...bookData, authorNames: selectedAuthors });
        setSelectedAuthors([]);
        closeSelectAuthorModal();
    };

    // Hàm thêm danh mục mới
    const handleAddCategory = async () => {
        if (!newCategory.trim()) {
            alert("Vui lòng nhập tên danh mục.");
            return;
        }

        // Kiểm tra xem danh mục đã tồn tại chưa
        if (existingCategories.some(cat => (cat.categoryName || "").toLowerCase() === newCategory.trim().toLowerCase())) {
            alert("Danh mục này đã tồn tại.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/categories", {
                categoryName: newCategory.trim(),
            });

            if (response.status === 201) {
                setExistingCategories([...existingCategories, response.data]);
                setBookData({
                    ...bookData,
                    categoryNames: [...bookData.categoryNames, response.data.categoryName],
                });
                setNewCategory("");
                closeAddCategoryModal();
                alert("Đã thêm danh mục mới thành công.");
            }
        } catch (error) {
            console.error("Error adding category:", error);
            alert("Không thể thêm danh mục. Vui lòng thử lại.");
        }
    };

    // Hàm thêm tác giả mới
    const handleAddAuthor = async () => {
        if (!newAuthor.trim()) {
            alert("Vui lòng nhập tên tác giả.");
            return;
        }

        // Kiểm tra xem tác giả đã tồn tại chưa
        if (existingAuthors.some(auth => (auth.name || "").toLowerCase() === newAuthor.trim().toLowerCase())) {
            alert("Tác giả này đã tồn tại.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/api/authors", {
                name: newAuthor.trim(),
            });

            if (response.status === 201) {
                setExistingAuthors([...existingAuthors, response.data]);
                setBookData({
                    ...bookData,
                    authorNames: [...bookData.authorNames, response.data.name],
                });
                setNewAuthor("");
                closeAddAuthorModal();
                alert("Đã thêm tác giả mới thành công.");
            }
        } catch (error) {
            console.error("Error adding author:", error);
            alert("Không thể thêm tác giả. Vui lòng thử lại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra thông tin bắt buộc
        if (
            !bookData.title ||
            !bookData.description ||
            !bookData.published_year ||
            !bookData.thumbnail ||
            !bookData.instock
        ) {
            alert("Vui lòng nhập đầy đủ thông tin sách!");
            return;
        }

        try {
            // Tạo dữ liệu mới cho POST
            const updatedBookData = {
                ...bookData,
                publishedYear: bookData.published_year,
                totalStock: parseInt(bookData.instock, 10),
                availableStock: parseInt(bookData.availableStock || bookData.instock, 10),
                categoryNames: bookData.categoryNames,
                authorNames: bookData.authorNames,
            };

            // Gọi hàm `save` truyền từ props
            await save(updatedBookData);

            // Reset form
            setBookData({
                id: null,
                title: "",
                description: "",
                published_year: "",
                thumbnail: "",
                instock: "",
                availableStock: "",
                categoryNames: [],
                authorNames: [],
            });
            setNewCategory("");
            setNewAuthor("");
            setVisibleForm(false);
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Không thể thêm sách. Vui lòng kiểm tra dữ liệu và thử lại.");
        }
    };

    // Logic tìm kiếm và phân trang cho danh mục
    const filteredCategories = existingCategories.filter(cat =>
        (cat.categoryName || "").toLowerCase().includes((categorySearchTerm || "").toLowerCase())
    );

    const indexOfLastCategory = categoryCurrentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
    const totalCategoryPages = Math.ceil(filteredCategories.length / categoriesPerPage);

    // Logic tìm kiếm và phân trang cho tác giả
    const filteredAuthors = existingAuthors.filter(auth =>
        (auth.name || "").toLowerCase().includes((authorSearchTerm || "").toLowerCase())
    );

    const indexOfLastAuthor = authorCurrentPage * authorsPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
    const currentAuthors = filteredAuthors.slice(indexOfFirstAuthor, indexOfLastAuthor);
    const totalAuthorPages = Math.ceil(filteredAuthors.length / authorsPerPage);

    // Hàm chuyển trang cho danh mục
    const paginateCategories = (pageNumber) => setCategoryCurrentPage(pageNumber);

    // Hàm chuyển trang cho tác giả
    const paginateAuthors = (pageNumber) => setAuthorCurrentPage(pageNumber);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="admin-form-container">
                    <h3>{bookData.id ? "Chỉnh sửa sách" : "Thêm sách mới"}</h3>
                    <label>
                        Tiêu đề:
                        <input
                            required
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                        />
                    </label>
                    <label>
                        Mô tả:
                        <textarea
                            required
                            name="description"
                            value={bookData.description}
                            onChange={(e) => setBookData({ ...bookData, description: e.target.value })}
                        ></textarea>
                    </label>
                    <label>
                        Năm xuất bản:
                        <input
                            required
                            type="number"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={(e) => setBookData({ ...bookData, published_year: e.target.value })}
                        />
                    </label>
                    <label>
                        Tổng số lượng:
                        <input
                            required
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={(e) => setBookData({ ...bookData, instock: e.target.value })}
                        />
                    </label>
                    <label>
                        Số lượng có sẵn:
                        <input
                            required
                            type="number"
                            name="availableStock"
                            value={bookData.availableStock}
                            onChange={(e) => setBookData({ ...bookData, availableStock: e.target.value })}
                        />
                    </label>
                    <label>
                        Link file:
                        <input
                            required
                            type="text"
                            name="thumbnail"
                            value={bookData.thumbnail}
                            onChange={(e) => setBookData({ ...bookData, thumbnail: e.target.value })}
                        />
                    </label>
                    {/* Danh mục */}
                    <label>
                        Danh mục:
                        <div className="button-group">
                            <button type="button" className="btn-primary" onClick={openSelectCategoryModal}>
                                Chọn danh mục hiện có
                            </button>
                            <button type="button" className="btn-secondary" onClick={openAddCategoryModal}>
                                Thêm danh mục mới
                            </button>
                        </div>
                        <div className="selected-items">
                            {bookData.categoryNames && bookData.categoryNames.length > 0 ? (
                                bookData.categoryNames.map((cat, index) => (
                                    <span key={index} className="selected-item">
                                        {cat}{index < bookData.categoryNames.length - 1 ? ', ' : ''}
                                    </span>
                                ))
                            ) : (
                                <span>Không có danh mục</span>
                            )}
                        </div>
                    </label>
                    {/* Tác giả */}
                    <label>
                        Tác giả:
                        <div className="button-group">
                            <button type="button" className="btn-primary" onClick={openSelectAuthorModal}>
                                Chọn tác giả hiện có
                            </button>
                            <button type="button" className="btn-secondary" onClick={openAddAuthorModal}>
                                Thêm tác giả mới
                            </button>
                        </div>
                        <div className="selected-items">
                            {bookData.authorNames && bookData.authorNames.length > 0 ? (
                                // Option 1: Sử dụng spans với dấu phẩy
                                bookData.authorNames.map((auth, index) => (
                                    <span key={index} className="selected-item">
                                        {auth}{index < bookData.authorNames.length - 1 ? ', ' : ''}
                                    </span>
                                    
                                    /* Option 2: Sử dụng một span duy nhất với chuỗi cách nhau bằng dấu phẩy
                                    <span className="selected-item">
                                        {bookData.authorNames.join(', ')}
                                    </span>
                                    */
                                ))
                            ) : (
                                <span>Không có tác giả</span>
                            )}
                        </div>
                    </label>

                    <button className="admin-button-form" type="submit">
                        {bookData.id ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>

            {/* Modal chọn danh mục hiện có */}
            {isSelectCategoryModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Chọn danh mục hiện có</h2>
                        <div className="modal-body">
                            {/* Thanh tìm kiếm danh mục */}
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm danh mục..."
                                    value={categorySearchTerm}
                                    onChange={(e) => {
                                        setCategorySearchTerm(e.target.value);
                                        setCategoryCurrentPage(1); // Reset trang khi tìm kiếm mới
                                    }}
                                    className="modal-input search-input"
                                />
                                {categorySearchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setCategorySearchTerm("")}
                                        className="reset-button"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            {/* Danh sách danh mục */}
                            {isLoadingCategories ? (
                                <p>Đang tải danh mục...</p>
                            ) : currentCategories.length > 0 ? (
                                currentCategories.map(category => {
                                    console.log("Rendering category:", category); // Debug
                                    return (
                                        <div key={category.id} className="modal-item">
                                            <input
                                                type="checkbox"
                                                id={`cat-${category.id}`}
                                                name="categories"
                                                value={category.categoryName}
                                                checked={selectedCategories.includes(category.categoryName)}
                                                onChange={() => handleSelectCategory(category.categoryName)}
                                            />
                                            <label htmlFor={`cat-${category.id}`}>{category.categoryName}</label>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Không có danh mục nào.</p>
                            )}
                        </div>
                        {/* Điều khiển phân trang danh mục */}
                        {totalCategoryPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => paginateCategories(categoryCurrentPage - 1)}
                                    disabled={categoryCurrentPage === 1}
                                    className="pagination-button"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalCategoryPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginateCategories(index + 1)}
                                        className={`pagination-button ${categoryCurrentPage === index + 1 ? "active" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginateCategories(categoryCurrentPage + 1)}
                                    disabled={categoryCurrentPage === totalCategoryPages}
                                    className="pagination-button"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                        <div className="modal-footer">
                            <button onClick={closeSelectCategoryModal} className="btn-secondary">
                                Đóng
                            </button>
                            <button onClick={handleSaveSelectedCategories} className="btn-primary">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thêm danh mục mới */}
            {isAddCategoryModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Thêm danh mục mới</h2>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Nhập tên danh mục mới"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="modal-input"
                            />
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeAddCategoryModal} className="btn-secondary">
                                Đóng
                            </button>
                            <button onClick={handleAddCategory} className="btn-primary">
                                Thêm danh mục
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal chọn tác giả hiện có */}
            {isSelectAuthorModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Chọn tác giả hiện có</h2>
                        <div className="modal-body">
                            {/* Thanh tìm kiếm tác giả */}
                            <div className="search-container">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tác giả..."
                                    value={authorSearchTerm}
                                    onChange={(e) => {
                                        setAuthorSearchTerm(e.target.value);
                                        setAuthorCurrentPage(1); // Reset trang khi tìm kiếm mới
                                    }}
                                    className="modal-input search-input"
                                />
                                {authorSearchTerm && (
                                    <button
                                        type="button"
                                        onClick={() => setAuthorSearchTerm("")}
                                        className="reset-button"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                            {/* Danh sách tác giả */}
                            {isLoadingAuthors ? (
                                <p>Đang tải tác giả...</p>
                            ) : currentAuthors.length > 0 ? (
                                currentAuthors.map(author => (
                                    <div key={author.id} className="modal-item">
                                        <input
                                            type="checkbox"
                                            id={`auth-${author.id}`}
                                            name="authors"
                                            value={author.name}
                                            checked={selectedAuthors.includes(author.name)}
                                            onChange={() => handleSelectAuthor(author.name)}
                                        />
                                        <label htmlFor={`auth-${author.id}`}>{author.name}</label>
                                    </div>
                                ))
                            ) : (
                                <p>Không có tác giả nào.</p>
                            )}
                        </div>
                        {/* Điều khiển phân trang tác giả */}
                        {totalAuthorPages > 1 && (
                            <div className="pagination">
                                <button
                                    onClick={() => paginateAuthors(authorCurrentPage - 1)}
                                    disabled={authorCurrentPage === 1}
                                    className="pagination-button"
                                >
                                    Trước
                                </button>
                                {Array.from({ length: totalAuthorPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => paginateAuthors(index + 1)}
                                        className={`pagination-button ${authorCurrentPage === index + 1 ? "active" : ""}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginateAuthors(authorCurrentPage + 1)}
                                    disabled={authorCurrentPage === totalAuthorPages}
                                    className="pagination-button"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                        <div className="modal-footer">
                            <button onClick={closeSelectAuthorModal} className="btn-secondary">
                                Đóng
                            </button>
                            <button onClick={handleSaveSelectedAuthors} className="btn-primary">
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal thêm tác giả mới */}
            {isAddAuthorModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Thêm tác giả mới</h2>
                        <div className="modal-body">
                            <input
                                type="text"
                                placeholder="Nhập tên tác giả mới"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                                className="modal-input"
                            />
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeAddAuthorModal} className="btn-secondary">
                                Đóng
                            </button>
                            <button onClick={handleAddAuthor} className="btn-primary">
                                Thêm tác giả
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>)
    }

    export default AddForm;

