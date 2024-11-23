import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function ManageCategory() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    // Gọi API để lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/categories");
                setCategories(response.data); // Lưu dữ liệu vào state
            } catch (err) {
                console.error("Lỗi khi tải danh mục:", err);
                setError("Không thể tải danh mục. Vui lòng thử lại sau.");
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <div className="borrow-history">
                <div className="Borrow-history-header">
                    <h1>Danh sách danh mục</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <SearchBar />
                        <button className="CreateButton">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div className="borrow-list">
                    {error ? (
                        <p className="error-message">{error}</p>
                    ) : categories.length === 0 ? (
                        <p className="empty-history">Không có danh mục.</p>
                    ) : (
                        categories.map((category) => (
                            <div key={category.id} className="borrow-item">
                                <div className="borrow-details">
                                    <h2>{category.id}. {category.categoryName}</h2>
                                </div>
                                <button className="UpdateButton">
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button className="DeleteButton">
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

export default ManageCategory;
