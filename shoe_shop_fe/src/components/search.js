import React, { useState } from 'react';
import "./search.css"
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function Search() {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const toggleSearchBar = () => {
    setSearchBarActive(!searchBarActive);
  };


  return (<>
    <div className="ui icon input icon search-input-icon">
        <input placeholder="Tìm kiếm" type="text" className="search-bar" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
        <Link to={`/Search/${searchInput}`} id="search-button" onClick={toggleSearchBar}><FontAwesomeIcon icon={faSearch} /></Link>
    </div>
    </>
  );
}

export default Search;