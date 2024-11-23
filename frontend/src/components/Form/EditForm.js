import { useEffect, useState } from "react";
import "./Form.css"


function EditForm({formType,setVisibleForm,bookData,setBookData}) {
    const [updateBookData,setUpdateBookData] = useState({
        title:"",
        authors:"",
        category:"",
        thumnail:"",
        description:"",
        published_year:"",
        instock:"",
    })
    const [userData,setUserData] = useState({
        userName:"",
        address:"",
        phone:"",
    })

    const handleInputChange = (e, form) => {
        const { name, value } = e.target;
        if (form === "book") {
          setUpdateBookData(prevBookData => ({
            ...prevBookData,
            [name]: value
          }));
        } else if (form === "user") {
          setUserData({ ...userData, [name]: value });
        }
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (formType === "book") {
          setBookData(prevBookData =>
            prevBookData.map(item =>
              item.id === updateBookData.id? { ...item, title:updateBookData.title,
                                                        authors:updateBookData.authors,
                                                        category:updateBookData.category,
                                                        thumnail:updateBookData.thumnail,
                                                        description:updateBookData.description,
                                                        published_year:updateBookData.published_year,
                                                        instock:updateBookData.instock, }: item
            )
          );
          console.log("Updated Book Data:", bookData);
          setVisibleForm(false)
        } else if (formType === "user") {
          console.log("User Data:", userData);
          setVisibleForm(false)
        }
      };
    return ( <>
       <form onSubmit={handleSubmit}>
       {formType === "book" && (
            <div className="admin-form-container"> {/*thêm classname cho div*/}
                <h3>Sửa sách</h3>
                <label>
                Title:
                <input
                    required
                    type="text"
                    name="title"
                    value={updateBookData.title}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Authors:
                <input
                    type="text"
                    name="authors"
                    value={updateBookData.authors}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Categories:
                <input
                    type="text"
                    name="category"
                    value={updateBookData.category}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Published year:
                <input
                    type="text"
                    name="published_year"
                    value={updateBookData.published_year}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Stocks:
                <input
                    type="text"
                    name="instock"
                    value={updateBookData.instock}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Thumbnail:
                <input
                    type="text"
                    name="thumbnail"
                    value={updateBookData.thumnail}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Description
                    <textarea
                        name="description"
                        value={updateBookData.description}
                        onChange={(e) => handleInputChange(e,"book")}>
                    </textarea>
                </label>
            </div>
        )}

        {formType === "user" &&(
            <div className="admin-form-container"> {/*thêm classname cho div*/}
              <h3>Sửa thông tin bạn đọc</h3>
                <label>
                Username:
                    <input
                    required
                    type="text"
                    name="userName"
                    value={userData.userName}
                    onChange={(e)=> handleInputChange(e,"user")}>
                    </input>
                </label>
                <label>
                Address:
                    <input
                    required
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={(e)=> handleInputChange(e,"user")}>
                    </input>
                </label>
                <label>
                Phonenumber:
                    <input
                    required
                    type="text"
                    name="phone"
                    value={userData.phone}
                    onChange={(e)=> handleInputChange(e,"user")}>
                    </input>
                </label>
            </div>
        )}
    <button type="submit">Update</button>{/*thêm classname cho button*/}
       </form>
       </>);
}

export default EditForm;