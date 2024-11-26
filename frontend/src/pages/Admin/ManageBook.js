import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBarAdmin from "./SearchBarAdmin";
import Modal from "../../components/Modal/Modal";
import AddForm from "../../components/Form/AddForm";

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [bookData, setBookData] = useState({
        id: null,
        title: "",
        description: "",
        published_year: "",
        thumbnail: "",
        instock: "",
        availableStock: "",
        categoryIds: [],
        authorIds: [],
    });
    const [searchQuery, setSearchQuery] = useState("");
    
    // Trạng thái phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5); // Hiển thị 5 sách mỗi trang

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

    const saveBook = async (bookData) => {
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
            const payload = {
                bookId: bookData.id || null,
                title: bookData.title,
                description: bookData.description,
                publishedYear: parseInt(bookData.published_year, 10),
                linkFile: bookData.thumbnail,
                totalStock: parseInt(bookData.instock, 10),
                availableStock: parseInt(bookData.availableStock || bookData.instock, 10),
                categoryNames: bookData.categoryNames || [], // Lấy từ form
                authorNames: bookData.authorNames || [], // Lấy từ form
            };
    
            // POST dữ liệu
            const response = await axios.post("http://localhost:8080/api/inventories/create", payload);
    
            if (bookData.id) {
                // Nếu chỉnh sửa, cập nhật danh sách sách
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === bookData.id ? response.data.book : book
                    )
                );
            } else {
                // Nếu thêm mới, thêm sách vào danh sách
                setBooks((prevBooks) => [...prevBooks, response.data.book]);
            }
    
            setVisibleForm(false);
            alert("Lưu sách thành công!");
            window.location.reload();
        } catch (error) {
            console.error("Error saving book:", error.response?.data || error.message);
            alert("Không thể lưu sách. Vui lòng thử lại.");
        }
    };
    
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

    const editBook = async (bookId) => {
        try {
            // Gọi API inventory-info
            const inventoryResponse = await axios.get(`http://localhost:8080/api/books/inventory-info`);
            const bookInventory = inventoryResponse.data.find((book) => book.id === bookId);
    
            if (!bookInventory) {
                alert("Không tìm thấy sách với ID này trong Inventory.");
                return;
            }
    
            // Gọi API /api/books để lấy chi tiết sách
            const bookResponse = await axios.get(`http://localhost:8080/api/books/${bookId}`);
            const bookDetail = bookResponse.data;
    
            // Kết hợp dữ liệu từ hai API
            setBookData({
                id: bookDetail.id,
                title: bookDetail.title,
                description: bookDetail.description,
                published_year: bookInventory.publishedYear || bookDetail.pubshedYear || "", // Ưu tiên từ inventory-info
                thumbnail: bookDetail.file || "",
                instock: bookInventory.totalStock || 0,
                availableStock: bookInventory.availableStock || 0,
                categoryNames: bookDetail.categories.map((cat) => cat.categoryName), // Danh sách tên danh mục
                authorNames: bookDetail.authors.map((auth) => auth.name), // Danh sách tên tác giả
            });
    
            setIsEdit(true);
            setVisibleForm(true);
        } catch (error) {
            console.error("Error fetching book details:", error);
            alert("Không thể tải thông tin sách. Vui lòng thử lại.");
        }
    };

    // Lọc sách theo từ khóa tìm kiếm
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Tính toán sách cần hiển thị trên mỗi trang
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

    // Thêm các nút phân trang
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                <AddForm
                    bookData={bookData}
                    setBookData={setBookData}
                    setVisibleForm={setVisibleForm}
                    save={saveBook} // Truyền hàm saveBook
                />
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
                                setIsEdit(false); // Đặt chế độ là thêm mới
                                setBookData({
                                    id: null,
                                    title: "",
                                    description: "",
                                    published_year: "",
                                    thumbnail: "",
                                    instock: "",
                                    availableStock: "",
                                    categoryIds: [],
                                    authorIds: [],
                                }); // Reset dữ liệu về trạng thái mặc định
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>

                <div className="borrow-list">
                    {currentBooks.length === 0 ? (
                        <p className="empty-history">Không tìm thấy sách nào.</p>
                    ) : (
                        currentBooks.map((book) => (
                            <div key={book.id} className="borrow-item">
                                <img
                                    src={book.linkFile}
                                    alt={`Bìa sách: ${book.title}`}
                                    className="book-cover"
                                />
                                <div className="borrow-details">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p>Tổng số lượng: {book.totalStock || "N/A"}</p>
                                    <p>Trong kho: {book.availableStock || "N/A"}</p>
                                    <p>Đang được mượn: {book.borrowingCount || 0}</p>
                                </div>
                                <button
                                    className="UpdateButton"
                                    onClick={() => editBook(book.id)} // Sử dụng book.id để truyền đúng ID của sách
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
        </>
    );
}

export default ManageBooks;
