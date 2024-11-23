import React, { useState } from "react";
import "./SearchBar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const SearchBar = () => {
  const [input,setInput] = useState("")

  return (
    <div className="searchBarWrapper">
        <input type="text" placeholder="Tìm kiếm " value={input} onChange={(e) => setInput(e.target.value)}/>
        <button className="SearchBarButton"><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
    </div>
  );
};

export default SearchBar;
