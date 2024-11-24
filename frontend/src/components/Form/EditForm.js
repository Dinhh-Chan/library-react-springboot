import { useState } from "react";
import "./Form.css";
import axios from "axios";


function EditForm({ formType, setVisibleForm, bookData, setBookData }) {
    const [updateBookData, setUpdateBookData] = useState({
        title: bookData.title || "",
        description: bookData.description || "",
        publishedYear: bookData.publishedYear || "",
        linkFile: bookData.linkFile || "",
        totalStock: bookData.totalStock || "",
        availableStock: bookData.availableStock || "",
        categoryIds: bookData.categoryIds || [],
        authorIds: bookData.authorIds || [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBookData((prev) => ({
            ...prev,
            [name]: name === "categoryIds" || name === "authorIds" ? value.split(",").map(Number) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                bookId: bookData.id,
                ...updateBookData,
            };
            const response = await axios.put(`http://localhost:8080/api/books/${bookData.id}`, payload);
            setBookData((prevBooks) =>
                prevBooks.map((book) => (book.id === bookData.id ? response.data : book))
            );
            alert("Cập nhật sách thành công!");
            setVisibleForm(false);
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Không thể cập nhật sách. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {formType === "book" && (
                    <div className="admin-form-container">
                        <h3>Sửa sách</h3>
                        <label>
                            Title:
                            <input
                                required
                                type="text"
                                name="title"
                                value={updateBookData.title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={updateBookData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </label>
                        <label>
                            Published Year:
                            <input
                                type="number"
                                name="publishedYear"
                                value={updateBookData.publishedYear}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Link File (Thumbnail):
                            <input
                                type="text"
                                name="linkFile"
                                value={updateBookData.linkFile}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Total Stock:
                            <input
                                type="number"
                                name="totalStock"
                                value={updateBookData.totalStock}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Available Stock:
                            <input
                                type="number"
                                name="availableStock"
                                value={updateBookData.availableStock}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Categories (IDs, comma-separated):
                            <input
                                type="text"
                                name="categoryIds"
                                value={updateBookData.categoryIds.join(",")}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Authors (IDs, comma-separated):
                            <input
                                type="text"
                                name="authorIds"
                                value={updateBookData.authorIds.join(",")}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>
                )}
                <button type="submit" className="admin-button-form">
                    Update
                </button>
            </form>
        </>
    );
}

export default EditForm;