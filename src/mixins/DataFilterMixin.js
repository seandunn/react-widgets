var React   = require('react')
  , filters = require('../util/filter')
  , helper  = require('../mixins/DataHelpersMixin')
  , _      = require('lodash');


var filterTypes = _.without(_.keys(filters), 'filter')


module.exports = {
  
    propTypes: {
      data:           React.PropTypes.array,
      value:          React.PropTypes.any,
      filter:         React.PropTypes.oneOfType([
                        React.PropTypes.func,
                        React.PropTypes.oneOf(filterTypes.concat(false))
                      ]),
      caseSensitive:  React.PropTypes.bool,
      minLength:      React.PropTypes.number,
    },

    getDefaultProps: function(){
      return {
        caseSensitive: false,
        minLength: 1
      }
    },

    matcher: function(searchTerm){
      var self = this
        , matches = typeof this.props.filter === 'string'
            ? filters[this.props.filter]
            : this.props.filter;

      if ( !matches || !searchTerm || !searchTerm.trim() || searchTerm.length < (this.props.minLength || 1))
        return function(){ return true }

      if ( !this.props.caseSensitive)
        searchTerm = searchTerm.toLowerCase();
      
      return function matcher(item){
        item = helper._dataText.call(self, item);

        if ( !self.props.caseSensitive)
          item = item.toLowerCase();

        return matches(item, searchTerm)
      }
    }
  }
