import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import Modal from "../../components/Modal/Modal";
import AddForm from "../../components/Form/AddForm";
import EditForm from "../../components/Form/EditForm";


function ManageBooks() {
    const [Books, setBooks] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false)
    const [formType,setFormType] = useState("book")
    const [bookData,setBookData] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [updateBookData,setUpdateBookData] = useState([])
    
    useEffect(() => {
        const mockData = [
            {
                id: 1,
                title:"Đắc Nhân Tâm",
                authors:"",
                category:"",
                thumbnail:"https://via.placeholder.com/50",
                description:"",
                published_year:"",
                instock:50,
                borrowing: 3,
            },
        ];
        setBooks(mockData);
    }, []);

    const addBook = () =>{
        const newBook = { id: Books.length + 1, ...bookData, borrowing:0 };
        setBooks((prevBooks) => [...prevBooks, newBook]);
        console.log("Books after add:", Books);
    }

    return (<>
    <Modal
        onClose={() => setVisibleForm(false)}
        isOpen={visibleForm}
    >   {isEdit? <EditForm updateBookData={updateBookData} setUpdateBookData={setUpdateBookData} bookData={bookData} setBookData={setBookData} formType={formType} setVisibleForm={setVisibleForm}></EditForm>
                    :<AddForm bookData={bookData} setBookData={setBookData} formType={formType} setVisibleForm={setVisibleForm} add={addBook}></AddForm>
}
        
    </Modal>
    
    <div className="borrow-history">
        <div className="Borrow-history-header">
            <h1>Kho sách</h1>
            <div style={{display:"flex", alignItems:"center", gap:'10px'}}>
                <SearchBar></SearchBar>
                <button className="CreateButton"  onClick={()=> {setVisibleForm(true);
                                                                setFormType("book")
                                                                setIsEdit(false)
                }}><FontAwesomeIcon icon={faPlus}/></button>
            </div>
        </div>
                    <div className="borrow-list">
                        {Books.length === 0 ? (
                            <p className="empty-history">Không có lịch sử mượn sách nào.</p>
                        ) : (
                            Books.map((book) => (
                                <div key={book.id} className="borrow-item">
                                    <img
                                        src={book.thumbnail}
                                        alt={`Bìa sách: ${book.bookTitle}`}
                                        className="book-cover"
                                    />
                                    <div className="borrow-details">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p>Trong kho: {book.instock}</p>
                                        <p>Đang được mượn: {book.borrowing}</p>
                                    </div>
                                    
                                    <button className="UpdateButton" onClick={() => {setVisibleForm(true);
                                                                                    setIsEdit(true)
                                                                                    setFormType('book')
                                    }}><FontAwesomeIcon icon={faPen}/></button>
                                    <button className="DeleteButton"><FontAwesomeIcon icon={faTrash}/></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
    </> );
}

export default ManageBooks;