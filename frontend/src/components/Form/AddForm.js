import { useState } from "react";
import "./Form.css"

function AddForm({bookData, setBookData, userData,setUserData ,formType, setVisibleForm, add}) { 

    const handleInputChange = (e, form) => {
        const { name, value } = e.target;
        if (form === "book") {
          setBookData({ ...bookData, [name]: value });
        } else if (form === "user") {
          setUserData({ ...userData, [name]: value });
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formType === "book") {
          console.log("Added Book Data:", bookData);
          setBookData({ title:"",
                        authors:"",
                        category:"",
                        thumbnail:"",
                        description:"",
                        published_year:"",
                        instock:"",});
          setVisibleForm(false)
          add()

        } else if (formType === "user") {
          console.log("Added User Data:", userData);
          setUserData({ userName:"",
                        address:"",
                        phone:"", });
          setVisibleForm(false)
          add()
        }
      };
    return (<>
    <form onSubmit={handleSubmit}>
        {formType === "book" && (
            //thêm classname cho div//
            <div className="admin-form-container">
                <h3>Thêm sách</h3>
                <label>
                Title:
                <input
                    required
                    type="text"
                    name="title"
                    value={bookData.title}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Authors:
                <input
                    type="text"
                    name="authors"
                    value={bookData.authors}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Categories:
                <input
                    type="text"
                    name="category"
                    value={bookData.category}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Published year:
                <input
                    type="text"
                    name="published_year"
                    value={bookData.published_year}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Stocks:
                <input
                    type="text"
                    name="instock"
                    value={bookData.instock}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Thumbnail:
                <input
                    type="text"
                    name="thumbnail"
                    value={bookData.thumbnail}
                    onChange={(e) => handleInputChange(e, "book")} />
                </label>
                <label>
                Description
                    <textarea
                        name="description"
                        value={bookData.description}
                        onChange={(e) => handleInputChange(e,"book")}>
                    </textarea>
                </label>
            </div>
        )}

        {formType === "user" &&(
            <div className="admin-form-container">
                <h3>Thêm bạn đọc</h3>
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
    <button className="admin-button-form" type="submit">Add</button> 
    {/* thêm classname cho button */}
    </form>
    </> );
}

export default AddForm;