import PropTypes from 'prop-types'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { translate } from '../i18n'
import style from './Search.module.css'

const Search = ({ query, updateQuery, matchCount, language }) => {
  const t = (text) => translate(language, text)
  return (
    <div className={style.search}>
      <div className={style.container}>
        <SearchOutlined className={style.icon} aria-hidden="true" />
        <input
          className={style.input}
          aria-label={t('Search transcript')}
          value={query}
          onChange={e => updateQuery(e.target.value)}
          placeholder={t('Find a word or phrase')}
        />
        {query && (
          <button type="button" className={style.clear} onClick={() => updateQuery('')} aria-label={t('Clear search')}>
            <CloseOutlined />
          </button>
        )}
      </div>
      <span className={style.results} role="status">
        {query && (matchCount
          ? translate(language, matchCount === 1 ? '1 matching line' : '{n} matching lines', matchCount)
          : t('No matching lines'))}
      </span>
    </div>
  )
}

Search.propTypes = {
  language: PropTypes.string,
  query: PropTypes.string,
  updateQuery: PropTypes.func,
  matchCount: PropTypes.number
}

export default Search
