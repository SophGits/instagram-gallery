var React = require('react');

var FiltersDisplay = React.createClass({
  getInitialState: function() {
    return {
      video: 'Off',
      locationFilter: ''
    }
  },
  handleClick: function(e) {
    e.preventDefault();
    var videoState = this.state.video === 'Off' ? 'On' : 'Off';
    this.setState({video: videoState});
    this.props.onChange(videoState);
  },
  handleTagClose: function(e) {
    e.preventDefault();
    this.props.onTagClose();
  },
  handleUserClose: function(e) {
    e.preventDefault();
    this.props.onClearUser();
  },
  handleLocationClose: function(e) {
    e.preventDefault();
    this.props.onClearMap();
  },
  render: function() {
    var videoStatement = this.state.video === 'Off' ? 'Show videos' : 'Show all media';
    return (
      <div className="display-filters">
        <h2>Active filters</h2>

        <div className="tag filter">
          <p>
            <img className="tag-icon" src="/images/tag-icon.svg" />
            Tag: {this.props.tag}
          </p>
          <a href="#" className="close" onClick={this.handleTagClose}>X(remove tag)</a>
        </div>

        <div className="user filter">
          <p>
            <img className="person-icon" src="/images/person-icon.svg" />
            User: {this.props.user}
          </p>
          <a href="#" className="close" onClick={this.handleUserClose}>X(clear user)</a>
        </div>

        <div className="location filter">
          <p>
            <img className="location-icon" src="/images/icelandpointer-icon.svg" />
            Location: {this.state.locationFilter}
          </p>
          <a href="#" onClick={this.handleLocationClose}>X(Clear location)</a>
        </div>

        <div className="video sort">
          <p>
            <img className="media-icon" src="/images/video-icon.svg" />
            Video media: {this.state.video}
          </p>
          <a href="#" onClick={this.handleClick}>{videoStatement}</a>
        </div>

      </div>
    )
  }
});

module.exports = FiltersDisplay;