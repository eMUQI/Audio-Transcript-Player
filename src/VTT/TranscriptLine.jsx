import React from 'react'
import PropTypes from 'prop-types'
import './TranscriptLine.css'

class TranscriptLine extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.props.cue.onenter = this.onEnter.bind(this)
    this.props.cue.onexit = this.onExit.bind(this)
    this.onClick = this.onClick.bind(this)
    this.lineRef = React.createRef();
  }

  render() {
    let style = ''
    if (this.props.query && this.props.cue.text.toLowerCase().includes(this.props.query.toLowerCase())) {
      style = 'match'
    }

    return (
      <button
        type="button"
        aria-current={this.state.isActive ? 'true' : undefined}
        className={`${this.state.isActive ? 'active' : ''} ${style} line`}
        onClick={this.onClick}
        ref={this.lineRef}
      >
        <span className="time">
          {this.startTime()} – {this.endTime()}
        </span>
        <span className="text">{this.props.cue.getCueAsHTML().textContent}</span>
      </button>
    )
  }

  onEnter() {
    this.setState({ isActive: true });
    const line = this.lineRef.current;
    const track = line.parentElement;
    // 仅滚动字幕容器，避免跟随播放时移动整页或打断键盘操作。
    if (!track.querySelector(':focus-visible')) {
      track.scrollTo({ top: line.offsetTop - track.offsetTop - track.clientHeight / 2 + line.clientHeight / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  onExit() {
    this.setState({ isActive: false })
  }

  onClick() {
    this.props.seek(this.props.cue.startTime)
  }

  startTime() {
    return this.formatSeconds(this.props.cue.startTime)
  }

  endTime() {
    return this.formatSeconds(this.props.cue.endTime)
  }

  formatSeconds(t) {
    let mins = Math.floor(t / 60)
    if (mins < 10) {
      mins = `0${mins}`
    }

    let secs = Math.floor(t % 60)
    if (secs < 10) {
      secs = `0${secs}`
    }

    return `${mins}:${secs}`
  }

}

TranscriptLine.propTypes = {
  cue: PropTypes.object,
  seek: PropTypes.func,
  query: PropTypes.string,
}

export default TranscriptLine
