var React = require('react'),
    axios = require('axios');

var SearchBox = React.createClass({
  getInitialState: function() {
    return { input: '' }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var term = this.refs.filter.value.trim();
    this.props.onSubmit(term);
  },
  handleChange: function(e) {
    this.setState({ input: this.refs.filter.value.trim() })
  },
  handleAutocomplete: function(tag) {
    this.refs.filter.value = tag;
    this.setState({ input: tag });
    this.props.onSubmit(tag);
  },
  render: function() {
    return (
      <form className="filter-form" onSubmit={this.handleSubmit}>
        <h2>Choose tag filter</h2>
        <input autoComplete="off" ref="filter" type="text" placeholder="Filter by tag, eg: 'ice'" onChange={this.handleChange} />
        <input type="submit" value="Go" />
        <AutocompleteList query={this.state.input} onSelect={this.handleAutocomplete} focussed={this.props.focussed} />
      </form>
    )
  }
});

var AutocompleteList = React.createClass({
  getInitialState: function() {
    return {
      tags: [],
      matches: [],
      listName: 'autocomplete'
    }
  },
  handleClick: function(e) {
    this.props.onSelect(e.target.innerHTML);

    // this.setState({ matches: [] });

    // window.setTimeout(function(){
    //   console.log(this.state.matches);
    // }.bind(this), 2000 )

    // window.setTimeout(function(){
    //   console.log(this.state.matches);
    // }.bind(this), 4000 )
  },
  componentDidMount: function() {
    axios.get('/api/tags')
      .then(function(res) {
        this.setState({ tags: res.data.data })
      }.bind(this))
  },
  componentWillReceiveProps: function(nextProps) {
    var term = nextProps.query.toLowerCase();
    if (term === "") {
      this.setState({ matches: [] });
      return;
    }
    var matches = this.state.tags.filter(function(tag) {
      if(tag !== null){
        return tag.slice(0, term.length) === term; //because indexOf is slow
      }
    });
    this.setState({ matches: matches });

    if(!nextProps.focussed) {
      this.setState({listName: 'autocomplete hide'});
    } else {
      this.setState({listName: 'autocomplete'});
    }
  },
  render: function() {
    var liMatches = this.state.matches.map(function(tag, i) {
      return <li className="autocomplete-result" key={i} onClick={this.handleClick}>{tag}</li>
    }.bind(this));
    return (
      <ul className={this.state.listName}>
        {liMatches}
      </ul>
    )
  }
})

module.exports = SearchBox;
