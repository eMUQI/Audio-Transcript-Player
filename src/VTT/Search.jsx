import React from "react" 
import PropTypes from "prop-types"
import style from "./Search.module.css"

const Search = ({ query, updateQuery }) => {
  return (
    <div className={style.search}>
      <div className={style.container}>
        <span className={style.icon}>🔍</span>
        <input 
          className={style.input}
          value={query}
          onChange={e => updateQuery(e.target.value)}
          placeholder="Search..."
        />
      </div>
    </div>
  )
}

Search.propTypes = {
  query: PropTypes.string,
  updateQuery: PropTypes.func
}

export default Search