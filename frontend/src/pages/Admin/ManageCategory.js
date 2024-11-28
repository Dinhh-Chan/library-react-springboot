import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./ManageCategory.css"; // Import CSS

function ManageCategory() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [editCategory, setEditCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryNameInput, setNewCategoryNameInput] = useState(""); // Dùng để nhập tên danh mục mới
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categoriesPerPage] = useState(5);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false); // Trạng thái để hiện thị form thêm danh mục

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/categories");
                setCategories(response.data);
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
                setError("Không thể tải danh mục. Vui lòng thử lại sau.");
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        try {
            // Gửi yêu cầu POST để tạo danh mục mới
            const response = await axios.post("http://localhost:8080/api/categories", {
                categoryName: newCategoryNameInput,
            });
            setCategories([...categories, response.data]); // Cập nhật danh sách danh mục
            setNewCategoryNameInput(""); // Reset input
            setShowAddCategoryForm(false); // Ẩn form sau khi thêm thành công
            alert("Danh mục đã được thêm thành công.");
        } catch (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            alert("Không thể thêm danh mục. Vui lòng thử lại.");
        }
    };

    // Bắt đầu sửa danh mục
    const handleEdit = (category) => {
        setEditCategory(category);
        setNewCategoryName(category.categoryName);
    };

    // Lưu thay đổi danh mục
    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/api/categories/${editCategory.id}`, {
                categoryName: newCategoryName,
            });
            setCategories(
                categories.map((category) =>
                    category.id === editCategory.id ? { ...category, categoryName: newCategoryName } : category
                )
            );
            setEditCategory(null);
            alert("Danh mục đã được cập nhật thành công.");
        } catch (err) {
            console.error("Lỗi khi cập nhật danh mục:", err);
            alert("Không thể cập nhật danh mục. Vui lòng thử lại.");
        }
    };

    // Hủy sửa
    const handleCancel = () => {
        setEditCategory(null);
        setNewCategoryName("");
    };

    // Tính toán sách cần hiển thị trên mỗi trang
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    // Tính toán tổng số trang
    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="borrow-history">
            <div className="Borrow-history-header">
                <h1>Danh sách danh mục</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <SearchBar></SearchBar>
                </div>
                {/* Nút "Thêm danh mục" */}
                <button
                    className="AddCategoryButton"
                    onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
                >
                    Thêm danh mục
                </button>
            </div>

            {/* Nền mờ khi modal mở */}
            {showAddCategoryForm && <div className="modal-overlay"></div>}

            {/* Form thêm danh mục */}
            {showAddCategoryForm && (
                <div className="add-category-form">
                    <h2>Thêm danh mục mới</h2>
                    <input
                        type="text"
                        value={newCategoryNameInput}
                        onChange={(e) => setNewCategoryNameInput(e.target.value)}
                        placeholder="Nhập tên danh mục mới"
                    />
                    <button className="AcceptButton" onClick={handleAddCategory}>
                        Lưu
                    </button>
                    <button className="CancelButton" onClick={() => setShowAddCategoryForm(false)}>
                        Hủy
                    </button>
                </div>
            )}

            <div className="borrow-list">
                {error ? (
                    <p className="error-message">{error}</p>
                ) : currentCategories.length === 0 ? (
                    <p className="empty-history">Không có danh mục.</p>
                ) : (
                    currentCategories.map((category) => (
                        <div key={category.id} className="borrow-item">
                            {editCategory && editCategory.id === category.id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="edit-input"
                                    />
                                    <div className="edit-buttons">
                                        <button className="AcceptButton" onClick={handleSave}>
                                            Lưu
                                        </button>
                                        <button className="CancelButton" onClick={handleCancel}>
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="borrow-details">
                                        <h2>
                                            {category.id}. {category.categoryName}
                                        </h2>
                                    </div>
                                    <button className="UpdateButton" onClick={() => handleEdit(category)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="pagination">
                <button
                    className="prevPage"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`pageNumber ${currentPage === index + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className="nextPage"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default ManageCategory;
