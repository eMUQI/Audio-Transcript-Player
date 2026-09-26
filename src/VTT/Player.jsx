import React from 'react'
import PropTypes from 'prop-types'
import Transcript from './Transcript'
import Metadata from './Metadata'
import Search from './Search'
import './Player.css'
import { translate } from '../i18n'

// 与 Chrome 原生菜单的倍速选项一致，保证两边切换后下拉框都有对应值
const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
const SEEK_STEP = 5

class Player extends React.Component {

  constructor() {
    super()
    this.state = {
      loaded: false,
      error: '',
      query: '',
      audioError: '',
      rate: 1
    }
    this.track = React.createRef()
    this.metatrack = React.createRef()
    this.audio = React.createRef()

    this.onLoaded = this.onLoaded.bind(this)
    this.seek = this.seek.bind(this)
    this.onTrackError = this.onTrackError.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    this.track.current.addEventListener('load', this.onLoaded)
    this.track.current.addEventListener('error', this.onTrackError)
    // 自定义字幕区域需要启用轨道，以加载字幕并接收时间同步事件。
    this.track.current.track.mode = 'hidden'
    if (this.track.current.readyState === 2) {
      this.onLoaded()
    } else if (this.track.current.readyState === 3) {
      this.onTrackError()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    this.track.current.removeEventListener('load', this.onLoaded)
    this.track.current.removeEventListener('error', this.onTrackError)
  }

  render () {
    const t = (text) => translate(this.props.language, text)
    let track = null
    let metatrack = null
    if (this.state.loaded) {
      track = this.track.current.track
      metatrack = this.metatrack.current.track
    }
    const preload = this.props.preload ? 'auto' : 'metadata'
    const metadata = this.props.metadata
      ? <Metadata
        url={this.props.metadata}
        seek={this.seek}
        track={metatrack} />
      : ""
    return (
      <div className="webvtt-player">
        <div className="media">
          <div className="player">
            <div className="player-controls">
              <audio
                crossOrigin="anonymous"
                preload={preload}
                ref={this.audio}
                controls
                aria-label={t('Audio')}
                onPlay={() => this.setState({ audioError: '' })}
                onError={() => this.setState({ audioError: 'This audio could not be loaded. Try another audio file.' })}
                // 同步浏览器原生菜单里改的倍速
                onRateChange={e => this.setState({ rate: e.currentTarget.playbackRate })}>

                <source src={this.props.audio} />
                <track default
                  kind="subtitles"
                  src={this.props.transcript}
                  ref={this.track} />
                <track default
                  kind="metadata"
                  src={this.props.metadata}
                  ref={this.metatrack} />
              </audio>
              <select
                className="speed"
                aria-label={t('Playback speed')}
                value={this.state.rate}
                onChange={e => { this.audio.current.playbackRate = Number(e.target.value) }}>
                {SPEEDS.map(rate => <option key={rate} value={rate}>{rate}×</option>)}
              </select>
            </div>
            {this.state.audioError && <p className="audio-error" role="alert">{t(this.state.audioError)}</p>}
          </div>
          {!this.state.error && <Search language={this.props.language} query={this.state.query} updateQuery={this.updateQuery} matchCount={track?.cues ? Array.from(track.cues).filter(cue => cue.text.toLowerCase().includes(this.state.query.toLowerCase())).length : 0} />}
          <div className="tracks">
            {this.state.error ? (
              <p role="alert">{t(this.state.error)}</p>
            ) : !this.state.loaded ? (
              <p role="status">{t('Loading subtitles…')}</p>
            ) : (
              <Transcript
                url={this.props.transcript}
                seek={this.seek}
                track={track}
                query={this.state.query} />
            )}
            {metadata}
          </div>
        </div>
      </div>
    )
  }

  onLoaded() {
    const cues = this.track.current.track.cues
    this.setState({
      loaded: true,
      error: cues && cues.length > 0
        ? ''
        : 'No subtitles found. Please check the subtitle file and re-upload.'
    })
  }

  onTrackError() {
    this.setState({
      loaded: false,
      error: 'Unable to load subtitles. Please check the SRT or VTT file and re-upload.'
    })
  }

  play() {
    this.audio.current.play().catch(error => {
      if (error.name !== 'AbortError') {
        this.setState({ audioError: 'Playback could not start. Try selecting your audio file again.' })
      }
    })
  }

  seek(secs) {
    this.audio.current.currentTime = secs
    this.play()
  }

  onKeyDown(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    // 输入框、下拉框和原生播放器自己处理方向键
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest('input, textarea, select, audio')) return
    e.preventDefault()
    const audio = this.audio.current
    audio.currentTime = Math.max(0, audio.currentTime + (e.key === 'ArrowLeft' ? -SEEK_STEP : SEEK_STEP))
  }

  updateQuery(query) {
    this.setState({query: query})
  }

}

Player.propTypes = {
  language: PropTypes.string,
  audio: PropTypes.string,
  transcript: PropTypes.string,
  metadata: PropTypes.string,
  preload: PropTypes.bool,
  query: PropTypes.string
}

export default Player
