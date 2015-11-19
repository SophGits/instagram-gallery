var React = require('react'),
    axios = require('axios'),
    Promise = require('es6-promise').Promise;

var Lightbox = React.createClass({
  getInitialState: function(){
    return {
      photos: [],
      position: -1,
      embeddedPhoto: ''
    }
  },
  close: function(e) {
    if(e.target.className === "lightbox-bg" || e.target.className === "close") {
      this.props.close();
      this.setState({ position: -1 });
    }
  },
  previous: function() {
    if(this.state.position >= 1) {
      var prevPosition = this.state.position -=1;
      this.setState({ position: prevPosition }, this.embedPhoto);
    } else {
      console.log("Too far left");
    }
  },
  next: function() {
    if(this.state.position <= this.state.photos.length -2) {
      var nextPosition = this.state.position +=1;
      this.setState({ position: nextPosition }, this.embedPhoto);
    } else {
      console.log("Too far right");
    }
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      photos: nextProps.photos,
      position: nextProps.photoToView
    }, function() {
      this.embedPhoto()
    });
  },
  componentDidUpdate: function() {
    instgrm.Embeds.process(); // but only needs to be called for photos (not videos)

    // var photoToView = this.state.photos && this.state.photos[this.state.position];
    // if(!photoToView.video_url) {
    // }

  },
  embedPhoto: function() {
    var photo = this.state.photos[this.state.position];

    if(!photo) {
      return this.setState({embeddedPhoto: ''});
    }

    axios.get('/api/embed?instagram_link=' + photo.instagram_link)
      .then(function(res) {
        this.setState({ embeddedPhoto: res.data});
      }.bind(this))
      .catch(function(err){console.log('embed error: ',err)})
  },
  getMedia: function(photoToView) {
    if(!photoToView.video_url) {
      if(!!this.state.embeddedPhoto) {
        return <div className="content" dangerouslySetInnerHTML={{__html: this.state.embeddedPhoto}}></div>;
      }
    } else {
      return (
        <video key={this.state.position} id="videoplayer" width="640" height="640" controls>
          <source src={photoToView.video_url}
           type="video/mp4"/>
        </video>
      )
    }
  },
  render: function() {
    var photoToView,
        lightboxBg = "lightbox-bg hide",
        image;


    if(this.state.photos.length > 0 && this.state.position >= 0) {
      photoToView = this.state.photos[this.state.position];
      lightboxBg = "lightbox-bg";
      image = this.getMedia(photoToView);
    }
    console.log('Photo to view:', this.state.position);

    return (
      <div className={lightboxBg} onClick={this.close}>
        <div className="lightbox-photo">
          {image}
        <div className="close" onClick={this.close}>X (Close)</div>
        <div className="previous" onClick={this.previous}>Previous</div>
        <div className="next" onClick={this.next}>Next</div>
        </div>
      </div>
    )
  }
})

module.exports = Lightbox;