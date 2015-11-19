var axios = require('axios'),
    Promise = require('es6-promise').Promise,
    React = require('react'),
    PhotoBox = require('./photo-box'),
    PhotoSort = require('./photo-sort'),
    SearchBox = require('./search-box'),
    FiltersDisplay = require('./filters-display'),
    Lightbox = require('./lightbox');

var PhotoGallery = React.createClass({
  getInitialState: function() {
    return {
      photos: [],
      photosToLoad: 50,
      photoToView: -1,
      sortBy: 'date',
      tag: '',
      user: '',
      video: '',
      loc: '',
      top5: []
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({ loc: nextProps.loc }, function() {
      this.reloadGallery();
    }.bind(this))
  },
  componentDidMount: function() {
    this.reloadGallery();
  },
  changeSortMethod: function(sortBy) {
    this.setState({ sortBy: sortBy }, function() {
      this.reloadGallery();
    }.bind(this));
  },
  changeTagFilter: function(tag) {
    this.setState({ tag: tag }, function() {
      this.reloadGallery();
    }.bind(this))
  },
  clearTagFilter: function() {
    this.setState({ tag: '' }, function() {
      this.reloadGallery();
    }.bind(this))
  },
  changeMediaFilter: function(videoState) {
    this.setState({ 'video': videoState }, function() {
      this.reloadGallery();
    }.bind(this));
  },
  filterByUser: function(user) {
    this.setState({ user: user }, function() {
      this.reloadGallery(); // cb to deal with race condition
    }.bind(this))
  },
  clearUserFilter: function() {
    this.setState({ user: '' }, function() {
      this.reloadGallery();
    }.bind(this))
  },
  findLocations: function() {
    var sortedLocations = [],
        prop;

    var locations = this.state.photos.reduce(function(ret, photo){
      var name = photo.location && photo.location.name;

      if(isExcluded(name)) { return ret; }

      if(ret.hasOwnProperty(name)) {
        ret[name] += 1;
      } else {
        ret[name] = 1;
      }
      return ret;
    }, {});

    for (prop in locations){
      sortedLocations.push([prop, locations[prop]])
    }
    sortedLocations = sortedLocations.sort(function(a,b) {
      return a[1] - b[1];
    }).reverse().slice(0,5);

    this.setState({"top5": sortedLocations});
  },
  getTopFiveLocations: function() {
    var listItems;
    if(this.state.top5.length > 0) {
      listItems = this.state.top5.map(function(val, i) {
        return (<li key={val + i}> { [ val[0], " (", val[1], ")" ] } </li>)
      }.bind(this));
    return listItems;
    }
  },
  clearLocationFilter: function() {
    this.props.clearLoc();
  },
  loadMore: function(e) {
    e.preventDefault();

    var currentNoPhotos = parseInt(this.state.photosToLoad);

    this.setState({photosToLoad: currentNoPhotos + 100}, function() {
      this.reloadGallery();
    }.bind(this));
  },
  showLightbox: function(key) {
    this.setState({ 'photoToView': key });
  },
  closeLightBox: function() {
    this.setState({ 'photoToView': -1 }, function() {
        this.forceUpdate()
      }.bind(this)
    );
  },
  photosURL: function() {
    var uri = '/api/photos?sort_by=' + this.state.sortBy + '&displayNo=' + this.state.photosToLoad;
    if(this.state.tag) {
      uri += '&tag=' + encodeURIComponent(this.state.tag);
    }
    if(this.state.user) {
      uri += '&user=' + encodeURIComponent(this.state.user);
    }
    if(this.state.video && this.state.video === "On") {
      uri += '&video=on';
    }
    if(this.state.loc) {

      if(this.state.loc.lng && this.state.loc.lat) {
        uri += '&lng=' + this.state.loc.lng + "&lat=" + this.state.loc.lat;
      }
      // &lng=-21.817439&lat=64.126521&distance=10000
    }
    return uri;
  },
  reloadGallery: function() {
    axios.get(this.photosURL())
      .then(function(res) {
        this.setState({photos: res.data.data}, this.findLocations)
      }.bind(this))
      .catch(function(err) {
        console.log("Error: ", err);
      });
  },
  render: function() {
    var topFiveLocations,
        photoBoxes;

    photoBoxes = this.state.photos.map((photo, i) => {
      return (<PhotoBox photo={photo} key={i} position={i} onChange={this.filterByUser} onSelect={this.showLightbox} />)
    }.bind(this));

    if(this.state.top5) {
      topFiveLocations = this.getTopFiveLocations();
    } else {
      topFiveLocations = 'No photos for this location'
    }

    return (
      <div className="PhotoGallery">
        <section className="filter-and-sort-display">
          <FiltersDisplay tag={this.state.tag} user={this.state.user} onChange={this.changeMediaFilter} onTagClose={this.clearTagFilter} onClearUser={this.clearUserFilter} onClearMap={this.clearLocationFilter} />
          <PhotoSort sortBy={this.state.sortBy} onChange={this.changeSortMethod} />
          <SearchBox onSubmit={this.changeTagFilter} focussed={this.props.focussed} />
          <h2>Location name (count)</h2>
          <ol>
            {topFiveLocations}
          </ol>
        </section>
          {photoBoxes}
          <Lightbox photos={this.state.photos} photoToView={this.state.photoToView} close={this.closeLightBox} />
          <div className="loadmore" onClick={this.loadMore}>Load more</div>
      </div>
    );
  }
});

function isExcluded(locationName) {
  var exclusionList = [
    "iceland",
    "niceland"
  ];

  return (!locationName || exclusionList.indexOf(locationName.toLowerCase()) >= 0 ); // instead of if statement. !locationName is for undefined and null
}

module.exports = PhotoGallery;