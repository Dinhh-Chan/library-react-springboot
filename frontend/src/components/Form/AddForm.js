import React, { useState } from "react";
import "./Form.css";
import axios from "axios";

function AddForm({ bookData, setBookData, setVisibleForm, save }) {
    const [newCategory, setNewCategory] = useState("");
    const [newAuthor, setNewAuthor] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        // Xử lý danh mục và tác giả đặc biệt
        if (name === "categoryNames" || name === "authorNames") {
            setBookData({ ...bookData, [name]: value.split(",").map((item) => item.trim()) });
        } else {
            setBookData({ ...bookData, [name]: value });
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
            // Nếu người dùng không thay đổi danh mục/tác giả, sử dụng dữ liệu đang có trong form
            const categories = newCategory
                ? newCategory.split(",").map((cat) => cat.trim())
                : bookData.categoryNames;
            const authors = newAuthor
                ? newAuthor.split(",").map((auth) => auth.trim())
                : bookData.authorNames;
    
            // Tạo dữ liệu mới cho POST
            const updatedBookData = {
                ...bookData,
                publishedYear: bookData.published_year,
                totalStock: parseInt(bookData.instock, 10),
                availableStock: parseInt(bookData.availableStock || bookData.instock, 10),
                categoryNames: categories,
                authorNames: authors,
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
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Mô tả:
                        <textarea
                            required
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label>
                        Năm xuất bản:
                        <input
                            required
                            type="number"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Tổng số lượng:
                        <input
                            required
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Số lượng có sẵn:
                        <input
                            required
                            type="number"
                            name="availableStock"
                            value={bookData.availableStock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Link file:
                        <input
                            required
                            type="text"
                            name="thumbnail"
                            value={bookData.thumbnail}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Danh mục (cách nhau bằng dấu phẩy):
                        <input
                            type="text"
                            name="categoryNames"
                            value={newCategory || (bookData.categoryNames ? bookData.categoryNames.join(", ") : "")}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nhập danh mục, ví dụ: Khoa học, Lịch sử"
                        />
                    </label>
                    <label>
                        Tác giả (cách nhau bằng dấu phẩy):
                        <input
                            type="text"
                            name="authorNames"
                            value={newAuthor || (bookData.authorNames ? bookData.authorNames.join(", ") : "")}
                            onChange={(e) => setNewAuthor(e.target.value)}
                            placeholder="Nhập tác giả, ví dụ: Nguyễn Văn A, Trần Thị B"
                        />
                    </label>

                    <button className="admin-button-form" type="submit">
                        {bookData.id ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>
        </>
    );
}

export default AddForm;