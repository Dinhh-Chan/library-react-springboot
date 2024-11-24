import React, { useState, useEffect } from "react";
import "./Form.css";
import axios from "axios";

function AddForm({ bookData, setBookData, setVisibleForm, add }) {
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAuthor, setNewAuthor] = useState("");

    useEffect(() => {
        // Fetch categories and authors from API
        const fetchData = async () => {
            try {
                const categoryResponse = await axios.get("http://localhost:8080/api/categories");
                const authorResponse = await axios.get("http://localhost:8080/api/authors");
                setCategories(categoryResponse.data);
                setAuthors(authorResponse.data);
            } catch (error) {
                console.error("Error fetching categories or authors:", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create new category if needed
            let categoryIds = bookData.category && bookData.category !== "other"
                ? [bookData.category]
                : null;

            if (!categoryIds && newCategory) {
                const categoryResponse = await axios.post("http://localhost:8080/api/categories", {
                    categoryName: newCategory,
                });
                categoryIds = [categoryResponse.data.id];
            }

            // Create new author if needed
            let authorIds = bookData.authors && bookData.authors !== "other"
                ? [bookData.authors]
                : null;

            if (!authorIds && newAuthor) {
                const authorResponse = await axios.post("http://localhost:8080/api/authors", {
                    name: newAuthor,
                });
                authorIds = [authorResponse.data.id];
            }

            if (!categoryIds || !authorIds) {
                throw new Error("Category or Author information is missing or incorrect");
            }

            // Create or update inventory
            const payload = {
                bookId: null, // Use existing bookId if editing, null if creating new
                title: bookData.title,
                description: bookData.description,
                publishedYear: bookData.published_year,
                linkFile: bookData.thumbnail,
                totalStock: bookData.instock,
                availableStock: bookData.instock,
                categoryIds,
                authorIds,
            };

            await axios.post("http://localhost:8080/api/inventories/create", payload);

            setBookData({
                title: "",
                authors: "",
                category: "",
                thumbnail: "",
                description: "",
                published_year: "",
                instock: "",
                bookId: null,
            });
            alert("Thêm hoặc chỉnh sửa sách thành công!");
            setVisibleForm(false);
            add(); // Refresh book list
        } catch (error) {
            console.error("Error adding or editing book:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="admin-form-container">
                    <h3>{bookData.bookId ? "Chỉnh sửa sách" : "Thêm sách"}</h3>
                    <label>
                        Title:
                        <input
                            required
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label>
                        Published Year:
                        <input
                            type="text"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Total Stock:
                        <input
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Thumbnail:
                        <input
                            type="text"
                            name="thumbnail"
                            value={bookData.thumbnail}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Categories:
                        <select name="category" onChange={handleInputChange} value={bookData.category}>
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </option>
                            ))}
                            <option value="other">Khác...</option>
                        </select>
                        {bookData.category === "other" && (
                            <input
                                type="text"
                                placeholder="Danh mục mới"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                        )}
                    </label>
                    <label>
                        Authors:
                        <select
                            name="authors"
                            value={bookData.authors}
                            onChange={(e) => setBookData({ ...bookData, authors: e.target.value })}
                        >
                            <option value="">Chọn tác giả</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                            <option value="other">Khác...</option>
                        </select>
                        {bookData.authors === "other" && (
                            <input
                                type="text"
                                placeholder="Tác giả mới"
                                value={newAuthor}
                                onChange={(e) => setNewAuthor(e.target.value)}
                            />
                        )}
                    </label>
                </div>
                <button className="admin-button-form" type="submit">
                    {bookData.bookId ? "Update" : "Add"}
                </button>
            </form>
        </>
    );
}

export default AddForm;
