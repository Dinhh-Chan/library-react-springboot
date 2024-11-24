import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBarAdmin from "./SearchBarAdmin";
import Modal from "../../components/Modal/Modal";
import AddForm from "../../components/Form/AddForm";
import EditForm from "../../components/Form/EditForm";

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false);
    const [formType, setFormType] = useState("book");
    const [bookData, setBookData] = useState({
        title: "",
        authors: "",
        category: "",
        thumbnail: "",
        description: "",
        published_year: "",
        instock: "",
    });
    const [isEdit, setIsEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/books/inventory-info");
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
                alert("Không thể tải danh sách sách. Vui lòng thử lại sau.");
            }
        };

        fetchBooks();
    }, []);

    // Add book via API
    const addBook = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/books", {
                title: bookData.title,
                description: bookData.description,
                publishedYear: bookData.published_year,
                linkFile: bookData.thumbnail,
                totalStock: bookData.instock,
            });
            setBooks((prevBooks) => [...prevBooks, response.data]);
            alert("Thêm sách thành công!");
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    // Delete book via API
    const deleteBook = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/books/${id}`);
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
            alert("Xóa sách thành công!");
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Không thể xóa sách. Vui lòng thử lại.");
        }
    };

    // Lọc sách dựa trên tìm kiếm
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                {isEdit ? (
                    <EditForm
                        bookData={bookData}
                        setBookData={setBookData}
                        formType={formType}
                        setVisibleForm={setVisibleForm}
                    />
                ) : (
                    <AddForm
                        bookData={bookData}
                        setBookData={setBookData}
                        setVisibleForm={setVisibleForm}
                        add={addBook}
                    />
                )}
            </Modal>

            <div className="borrow-history">
                <div className="Borrow-history-header">
                    <h1>Kho sách</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <SearchBarAdmin
                            placeholder="Tìm kiếm theo tên sách..."
                            onSearch={(value) => setSearchQuery(value)}
                        />
                        <button
                            className="CreateButton"
                            onClick={() => {
                                setVisibleForm(true);
                                setFormType("book");
                                setIsEdit(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div className="borrow-list">
                    {filteredBooks.length === 0 ? (
                        <p className="empty-history">Không tìm thấy sách nào.</p>
                    ) : (
                        filteredBooks.map((book) => (
                            <div key={book.id} className="borrow-item">
                                <img
                                    src={book.linkFile}
                                    alt={`Bìa sách: ${book.title}`}
                                    className="book-cover"
                                />
                                <div className="borrow-details">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p>Trong kho: {book.totalStock}</p>
                                    <p>Đang được mượn: {book.borrowingCount || 0}</p>
                                </div>
                                <button
                                    className="UpdateButton"
                                    onClick={() => {
                                        setVisibleForm(true);
                                        setIsEdit(true);
                                        setBookData({
                                            id: book.id,
                                            title: book.title,
                                            description: book.description,
                                            publishedYear: book.publishedYear,
                                            linkFile: book.linkFile,
                                            totalStock: book.totalStock,
                                            availableStock: book.availableStock,
                                            categoryIds: book.categoryIds || [],
                                            authorIds: book.authorIds || [],
                                        });
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </button>


                                <button
                                    className="DeleteButton"
                                    onClick={() => deleteBook(book.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageBooks;
