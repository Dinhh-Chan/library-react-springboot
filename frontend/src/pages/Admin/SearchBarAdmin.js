import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBarAdmin = ({ placeholder = "Tìm kiếm...", onSearch }) => {
    const [input, setInput] = useState("");

    const handleSearch = () => {
        if (onSearch) {
            onSearch(input);
        }
    };

    return (
        <div className="searchBarAdminWrapper">
            <input
                type="text"
                placeholder={placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button className="SearchBarAdminButton" onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
        </div>
    );
};

export default SearchBarAdmin;
