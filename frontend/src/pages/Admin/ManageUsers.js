import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBarAdmin from "./SearchBarAdmin";
import Modal from "../../components/Modal/Modal";
import AddForm from "../../components/Form/AddForm";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false);
    const [formType, setFormType] = useState("user");
    const [userData, setUserData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/readers");
                const usersData = response.data
                    .filter((user) => user.role === "USER")
                    .map((user) => ({
                        id: user.id,
                        username: user.username,
                        avatar:
                            "https://cdna.artstation.com/p/assets/images/images/082/071/286/large/wlop-1se.jpg?1732004139", 
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu người dùng:", error);
                alert("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
            }
        };

        fetchUsers();
    }, []);

    // Thêm người dùng
    const addUser = () => {
        const newUser = { id: users.length + 1, ...userData };
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    // Xóa người dùng
    const deleteUser = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/readers/${id}`);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            alert("Người dùng đã được xóa.");
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            alert("Không thể xóa người dùng. Vui lòng thử lại.");
        }
    };

    // Lọc người dùng theo tìm kiếm
    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                <AddForm
                    userData={userData}
                    setUserData={setUserData}
                    formType={formType}
                    setVisibleForm={setVisibleForm}
                    add={addUser}
                ></AddForm>
            </Modal>
            <div className="borrow-history">
                <div className="Borrow-history-header">
                    <h1>Danh sách người dùng</h1>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <SearchBarAdmin
                            placeholder="Tìm kiếm theo tên người dùng..."
                            onSearch={(value) => setSearchQuery(value)}
                        />
                    </div>
                </div>
                <div className="borrow-list">
                    {filteredUsers.length === 0 ? (
                        <p className="empty-history">Không có bạn đọc nào.</p>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.id} className="borrow-item">
                                <img
                                    src={user.avatar}
                                    alt={`Avatar của: ${user.username}`}
                                    className="book-cover"
                                />
                                <div className="borrow-details">
                                    <h3 className="book-title">{user.username}</h3>
                                </div>
                                <button
                                    className="DeleteButton"
                                    onClick={() => deleteUser(user.id)}
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

export default ManageUsers;
