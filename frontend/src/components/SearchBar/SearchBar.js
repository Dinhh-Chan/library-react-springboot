import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to fetch books from API
  const searchBooks = async (keyword) => {
    if (keyword.trim() === "") {
      setFilteredItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/books/search?keyword=${keyword}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setFilteredItems(data);
    } catch (error) {
      setError("Error fetching search results");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchBooks(searchTerm);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm]);

  const handleItemClick = (id) => {
    navigate(`/books/${id}`); // Navigate to book details page
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

      {isLoading && <div>Đang tìm kiếm...</div>}
      {error && <div>{error}</div>}

      {searchTerm && (
        <ul className="searchResults">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li key={item.id} onClick={() => handleItemClick(item.id)}>
                {item.title} - {item.publishedYear}
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
