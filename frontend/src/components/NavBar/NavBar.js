import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './NavBar.css';
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DropDownMenu from "../DropDownItems/DropDownItems";

function NavBar() {
    const [openMenu, setOpenMenu] = useState(false);

    
    return ( 
        <>
            <nav className="navbar">
                {/* Bao bọc img bằng Link để chuyển hướng về "/" */}
                <Link to="/" className="navbar-logo">
                    <img 
                        src='https://i.imgur.com/YVydVYH.png' 
                        alt="Logo" // Sử dụng alt mô tả rõ ràng hơn
                    />
                </Link>
                <SearchBar />
                <button className="menuButton" onClick={() => setOpenMenu(!openMenu)}>
                    <FontAwesomeIcon icon={faBars} />
                </button>
            </nav>
            {openMenu && <DropDownMenu />}
            {/* Thêm khoảng trống dưới navbar */}
            <div style={{height:"80px"}}></div>
        </>
    );
}

export default NavBar;
