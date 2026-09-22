import React from 'react'
import PropTypes from 'prop-types'
import Transcript from './Transcript'
import Metadata from './Metadata'
import Search from './Search'
import './Player.css'

class Player extends React.Component {

  constructor() {
    super()
    this.state = {
      loaded: false,
      error: '',
      currentTime: 0,
      query: ''
    }
    this.track = React.createRef()
    this.metatrack = React.createRef()
    this.audio = React.createRef()

    this.onLoaded = this.onLoaded.bind(this)
    this.seek = this.seek.bind(this)
    this.onTrackError = this.onTrackError.bind(this)
    this.updateQuery = this.updateQuery.bind(this)
  }

  componentDidMount() {
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
    this.track.current.removeEventListener('load', this.onLoaded)
    this.track.current.removeEventListener('error', this.onTrackError)
  }

  render () {
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
            <audio
              controls
              crossOrigin="anonymous"
              preload={preload}
              ref={this.audio}>
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
          </div>
          <div className="tracks">
            {this.state.error ? (
              <p role="alert">{this.state.error}</p>
            ) : !this.state.loaded ? (
              <p role="status">Loading subtitles…</p>
            ) : null}
            <Transcript 
              url={this.props.transcript} 
              seek={this.seek} 
              track={track} 
              query={this.state.query} />
            {metadata}
          </div>
          <Search query={this.state.query} updateQuery={this.updateQuery} />
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

  seek(secs) {
    this.audio.current.currentTime = secs
    this.audio.current.play()
  }

  updateQuery(query) {
    this.setState({query: query})
  }

}

Player.propTypes = {
  audio: PropTypes.string,
  transcript: PropTypes.string,
  metadata: PropTypes.string,
  preload: PropTypes.bool,
  query: PropTypes.string
}

export default Player
