import React from "react";
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom'
import './NavBar.css'
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DropDownMenu from "../DropDownItems/DropDownItems";
import { useState } from "react";


function NavBar() {
    const [openMenu,setOpenMenu] = useState(false);


    return ( 
        <>
        <nav className="navbar">
            <Link to="/" className="navBarLogo">
                Logo
            </Link>
            <SearchBar></SearchBar>
            <button className="menuButton" onClick={() => setOpenMenu(!openMenu)}>
                <FontAwesomeIcon icon={faBars} />
            </button>
        </nav>
        {openMenu && <DropDownMenu></DropDownMenu>}
        <div style={{height:"80px"}}></div>
        </>
     );
}

export default NavBar;