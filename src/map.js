var React = require('react'),
    axios = require('axios');

var Map = React.createClass({
  getInitialState: function() {
    return {
      marker: ''
    }
  },
  shouldComponentUpdate: function() {
    return false;
  },
  componentWillReceiveProps: function(nextProps) {
    if (!!nextProps.clearLocation) {

      this.removeCurrentMarker();
    }
  },
  componentDidMount: function() {
    var map = this.initMap();

    if (typeof google !== "object") {
      console.log("Script not yet loaded (componentDidMount)");
      return;
    }

    this.registerClickListener(map);
  },
  registerClickListener: function(map) {
    google.maps.event.addListener(map, "click", function (e) {
      this.getLocation({lng: e.latLng.lng(), lat: e.latLng.lat()})
      this.placeMarker(map, e.latLng);
    }.bind(this));
  },
  removeCurrentMarker: function() {
    var currMarker = this.state.marker;
    if (currMarker.hasOwnProperty('map')) {
      return currMarker.setMap(null);
    }
  },
  placeMarker: function(map, latLng) {
    this.removeCurrentMarker();

    var marker = new google.maps.Marker({
       position: latLng,
       map: map,
       title: 'Hello World!'
     });

    this.setState({marker: marker});
  },
  initMap: function() {
    if (typeof google !== "object") { console.log("Script not yet loaded (initMap)"); return; }
    var mapOptions = {
      // disableDefaultUI: true,
      scrollwheel: false,
      // zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      streetViewControl: !1
    };

    var map = new google.maps.Map(this.refs.mapCanvas, mapOptions);
    map.fitBounds(this.getBounds());
    return map;
  },
  getLocation: function(location) {
    this.props.updateLocation(location);
  },
  getBounds: function() {
    var southWest = new google.maps.LatLng(63.528971, -24.565430);
    var northEast = new google.maps.LatLng(66.478208, -13.754883);
    return new google.maps.LatLngBounds(southWest,northEast);
  },
  render: function() {
    return (
      <div>
        <div ref="mapCanvas" id="mapCanvas"></div>
      </div>
    )
  }
});

module.exports = Map;