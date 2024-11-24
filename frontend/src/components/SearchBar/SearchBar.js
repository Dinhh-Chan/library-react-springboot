import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredItems = searchTerm
    ? items.filter((item) =>
        (item.title || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleItemClick = (id) => {
    navigate(`/books/${id}`); // Điều hướng đến trang chi tiết sách
  };

  return (
    <div className="searchBarWrapper">
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm sách"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="SearchBarButton">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      {searchTerm && (
        <ul className="searchResults">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item.id)}
              >
                {item.title} - {item.pubshedYear}
              </li>
            ))
          ) : (
            <li>Không tìm thấy sách nào</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
