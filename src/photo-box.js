var React = require('react');

var PhotoBox = React.createClass({
  handleUsernameClick: function(e) {
    e.preventDefault();
    var username = e.target.innerHTML;
    this.props.onChange(username);
  },
  handlePhotoCLick: function(e) {
    e.preventDefault();
    this.props.onSelect(this.props.position);
  },
  render: function() {
    var tags = this.props.photo.tags.map(function(tag, i) {
      return (
        <li key={i}>{tag}</li>
      )
    })

    var legibleTime = this.props.photo.created_time;
    legibleTime = new Date(legibleTime).toDateString();

    var videoIcon;
    if(this.props.photo.type === 'video'){
      videoIcon = <img src="/images/video-icon-grey.svg" />
    }

    return (
      <div className="photo-box">
        <img src={this.props.photo.image_url} onClick={this.handlePhotoCLick} />
        <p className="username"><a href="#" onClick={this.handleUsernameClick}>{this.props.photo.user.username}</a></p>
        <p className="created-time">{legibleTime}</p>
        <p className="likes-number">{this.props.photo.likes_count}</p>
        <p className="media-type">{videoIcon}</p>
        <ul className="tag-list">
          {tags}
        </ul>
      </div>
    );
  }
});

module.exports = PhotoBox;