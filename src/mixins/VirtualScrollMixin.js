var React = require('react')
  , _ =  require('lodash')
  , $ = require('../util/dom')

module.exports = {
  
    
  // shouldComponentUpdate: function(nextProps, nextState) {
  //   var dataChanged = (nextProps.data.length !== this.props.data.length);

  //   console.log('update: ', dataChanged || nextState.outOfRange)
  //   return dataChanged || nextState.outOfRange
  // },
  propTypes: {
    itemHeight:    React.PropTypes.number,
    initialItems:  React.PropTypes.number,
  },

  getDefaultState: function(props) {
    var bufferSize = props.initialItems || (this._data().length - 1)

    return {
      bufferSize: bufferSize * 2.5,

      scrollTop: 0,
      visibleStart: 0,
      visibleEnd: bufferSize,

      displayStart: 0,
      displayEnd: Math.min(bufferSize * 2, this._data().length - 1)
    };
  },

  getInitialState: function() {
    return this.getDefaultState(this.props);
  },

  componentDidMount: function(){
    var visibleItemsCount = Math.floor($.height(this.refs.scrollable.getDOMNode()) / this.props.itemHeight)

    if( !isNaN(visibleItemsCount) && visibleItemsCount !== this.state.visibleEnd)
      this.setState({ 
        visibleItems: visibleItemsCount,
        visibleEnd: visibleItemsCount, 
        bufferSize: visibleItemsCount * 4
      })
  },

  componentWillReceiveProps: function(nextProps){
    //console.log('update: ', this.props.data.length !== nextProps.data.length)
    this.scrollState(
        this.state.scrollTop
      , nextProps
      , this.props.data.length !== nextProps.data.length)
  },

  scrollState: function(scrollTop, props, update) {
    var visibleStart = Math.floor(scrollTop / props.itemHeight)
      , visibleEnd   = Math.min(visibleStart + this.state.visibleItems, this._data().length - 1)
      , displayStart = Math.max(0, Math.floor(scrollTop / props.itemHeight) - Math.floor(this.state.bufferSize / 2))
      , displayEnd   = Math.min(displayStart + this.state.bufferSize, this._data().length - 1)
      , outOfRange   = !(visibleStart >= this.state.displayStart && visibleEnd <= this.state.displayEnd);

    //console.log('scroll: ', outOfRange)
    if( this.props.itemHeight && (update || outOfRange) )
      this.setState({
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        displayStart: displayStart,
        displayEnd: displayEnd,
        scrollTop: scrollTop,
        outOfRange: outOfRange
      });
  },

  onScroll: function(event) {
    this.scrollState(this.refs.scrollable.getDOMNode().scrollTop, this.props)
  },

  _eachVisible: function(items, cb, component){
    var result = []
      , len = Math.min(this.state.displayEnd, items.length - 1)
      , pl = component = component || React.DOM.li

    for (var idx = this.state.displayStart; idx <= len; ++idx)
      result[result.length] = cb.call(this, items[idx], idx, items) ;
    
    if ( this.state.displayStart !== 0)
      result.unshift(pl({ 
        key: 'top_pl',
        style: { height: this.state.displayStart * this.props.itemHeight}
      }));

    if ( this.state.displayEnd !== (this.props.data.length - 1))
      result.push(pl({
        key: 'bottom_pl', 
        style: { 
          height: (items.length - this.state.displayEnd) * this.props.itemHeight
        }
      }));

    return result
  }

}

function outOfRange(current, visibleEnd, visibleStart){
  return ;
}