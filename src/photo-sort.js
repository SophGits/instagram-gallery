var React = require('react');

var PhotoSort = React.createClass({
  changeSortMethod: function(e) {
    e.preventDefault();
    var newSortState = this.props.sortBy === 'date' ? "likes" : "date";
    this.props.onChange(newSortState);
  },
  render: function() {
    var linkText = this.props.sortBy === 'date' ? "most-liked" : "most recent";
    return (
      <section className="sort-method-wrapper">
        <h2>Change sort</h2>
        <a className="sort-method" href="#" onClick={this.changeSortMethod}>
          Sort by {linkText}
        </a>
      </section>
    )
  }
})

module.exports = PhotoSort;
