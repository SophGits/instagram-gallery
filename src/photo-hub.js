var React = require('react'),
    ReactDOM = require('react-dom'),
    PhotoGallery = require('./photo-gallery'),
    Map = require('./map');


var PhotoHub = React.createClass({
  getInitialState: function() {
    return {
      loc: '',
      inputIsInFocus: false,
      clearLocation: false
    }
  },
  updateLocation: function(location) {
    this.setState({ loc: location });
  },
  clearLocation: function() {
    this.setState({ clearLocation: true }, function() {
      this.setState({ loc: '' }, function() {
        this.setState({ clearLocation: false });
      });
    });
  },
  checkFocus: function(e) {
    // Decides whether autocomplete list should be visible
    // eg: Not if the user clicks away
    var clickedEl = e.target.className;

    if (clickedEl === "next" || clickedEl === "previous") {
      return;
    }
    if (document.activeElement.nodeName === "INPUT" || clickedEl === "autocomplete-result") { // will disable autocomplete list from selecting something
      this.setState({ inputIsInFocus: true });
    } else {
      this.setState({ inputIsInFocus: false });
    }
  },
  render: function() {
    return (
      <article className="PhotoHub" onClick={this.checkFocus}>
        <Map updateLocation={this.updateLocation} clearLocation={this.state.clearLocation} />
        <PhotoGallery loc={this.state.loc} focussed={this.state.inputIsInFocus} clearLoc={this.clearLocation} />
      </article>
    )
  }
});

module.exports = PhotoHub;