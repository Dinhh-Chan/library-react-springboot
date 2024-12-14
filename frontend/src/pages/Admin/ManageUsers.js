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
    const [userData, setUserData] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user info
    const [isEditing, setIsEditing] = useState(false); // State to check if it's in edit mode
    const [newPassword, setNewPassword] = useState(""); // State to hold the new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State to hold confirm password

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

    // Fetch selected user data
    const fetchUserData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/readers/${id}`);
            setSelectedUser(response.data); // Store selected user data in state
            setVisibleForm(true); // Open modal
            setIsEditing(false); // Set form to view mode
            setNewPassword(""); // Reset password fields
            setConfirmPassword("");
        } catch (error) {
            console.error("Lỗi khi tải thông tin người dùng:", error);
        }
    };

    // Handle the edit mode and allow user to modify information
    const handleEditUser = () => {
        setIsEditing(true); // Set form to edit mode
    };

    // Handle updating the user data
    const handleUpdateUser = async () => {
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }

        const updatedUser = { ...selectedUser, password: newPassword };

        try {
            const response = await axios.put(`http://localhost:8080/api/readers/${updatedUser.id}`, updatedUser);
            setSelectedUser(response.data); // Update the selected user data
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === updatedUser.id ? { ...user, ...updatedUser } : user
                )
            );
            setIsEditing(false); // Exit edit mode
            setNewPassword(""); // Clear password fields
            setConfirmPassword("");
            alert("Thông tin người dùng đã được cập nhật.");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            alert("Không thể cập nhật thông tin người dùng. Vui lòng thử lại.");
        }
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
            {/* Modal to display user details */}
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                {selectedUser && (
                    <div className="admin-form-container">
                        <h2>Thông tin người dùng</h2>
                        {isEditing ? (
                            // Form for editing user information
                            <div className="admin-form-container">
                                <label>
                                    Tên đầy đủ:
                                    <input
                                        type="text"
                                        value={selectedUser.hoVaTen}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, hoVaTen: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Tên người dùng:
                                    <input
                                        type="text"
                                        value={selectedUser.username}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Số điện thoại:
                                    <input
                                        type="text"
                                        value={selectedUser.numberPhone}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, numberPhone: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Ngày sinh:
                                    <input
                                        type="date"
                                        value={selectedUser.dateOfBirth}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, dateOfBirth: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Quota:
                                    <input
                                        type="number"
                                        value={selectedUser.quota}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, quota: e.target.value })}
                                    />
                                </label>
                                <br />
                                <label>
                                    Mật khẩu mới:
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    Xác nhận mật khẩu mới:
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </label>
                                <br />
                                <button className="UpdateButtonManageUser" onClick={handleUpdateUser}>Cập nhật</button>
                            </div>
                        ) : (
                            // Display user information
                            <div className="admin-form-container">
                                <p><strong>Tên đầy đủ:</strong> {selectedUser.hoVaTen}</p>
                                <p><strong>Tên người dùng:</strong> {selectedUser.username}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Số điện thoại:</strong> {selectedUser.numberPhone}</p>
                                <p><strong>Ngày sinh:</strong> {selectedUser.dateOfBirth}</p>
                                <p><strong>Quota:</strong> {selectedUser.quota}</p>
                                <button className="UpdateButtonManageUser" onClick={handleEditUser}>Chỉnh sửa</button>
                            </div>
                        )}
                    </div>
                )}
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
                                    src={'https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Images.png'}
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
                                <button
                                    className="ViewButton"
                                    onClick={() => fetchUserData(user.id)}
                                >
                                    Xem chi tiết
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
