import React from "react";

const ReportLostBook = () => {
    return (
    <>
        <div className="form-container">
            <h1>Report Mất Sách</h1>
            <form>
                <div class="form-group">
                    <label for="username">Tên người dùng:</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Nhập tên người dùng" 
                        required 
                    />
                </div>
                <div class="form-group">
                    <label for="contact">Địa chỉ liên lạc:</label>
                    <input 
                        type="text" 
                        id="contact" 
                        name="contactInfo" 
                        placeholder="Nhập địa chỉ liên lạc" 
                        required 
                        />
                    </div>
                <div class="form-group">
                    <label for="contact">Số điện thoại:</label>
                    <input 
                        type="text" 
                        id="contact" 
                        name="contactInfo" 
                        placeholder="Nhập số điện thoại liên lạc" 
                        required 
                    />
                </div>
                <div class="form-group">
                    <label for="contact">Tên/Mã số sách:</label>
                    <input 
                        type="text" 
                        id="contact" 
                        name="contactInfo" 
                        placeholder="Nhập mã số sách" 
                        required 
                    />
                </div> 
                <div class="form-group">
                    <label for="contact">Lý do mất sách:</label>
                    <textarea 
                        type="text" 
                        id="contact" 
                        name="contactInfo" 
                        placeholder="" 
                        required 
                    />
                </div>    
                    <button type="submit" class="save-button">Lưu hồ sơ</button>
            </form>
        </div>
    </>
    );
};

export default ReportLostBook;