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
    var bufferSize = props.initialItems || (props.data.length - 1)

    return {
      bufferSize: bufferSize * 2.5,

      scrollTop: 0,
      visibleStart: 0,
      visibleEnd: bufferSize,

      displayStart: 0,
      displayEnd: Math.min(bufferSize * 2, props.data.length - 1)
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
        bufferSize: visibleItemsCount * 2 
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
      , visibleEnd   = Math.min(visibleStart + this.state.visibleItems, props.data.length - 1)
      , displayStart = Math.max(0, Math.floor(scrollTop / props.itemHeight) - Math.floor(this.state.bufferSize / 2))
      , displayEnd   = Math.min(displayStart + this.state.bufferSize, props.data.length - 1)
      , outOfRange   = !(visibleStart >= this.state.displayStart && visibleEnd <= this.state.displayEnd);

    //console.log('scroll: ', outOfRange)
    if( this.props.itemHeight && (update || outOfRange) )
      this.setState({
        bufferSize: this.state.visibleItems * 2,
        visibleStart: visibleStart,
        visibleEnd: visibleEnd,
        displayStart: displayStart,
        displayEnd: displayEnd,
        scrollTop: scrollTop,
        outOfRange: outOfRange
      });
  },

  _itemHeight: function(){

  },

  onScroll: function(event) {
    this.scrollState(this.refs.scrollable.getDOMNode().scrollTop, this.props)
  }

}

function outOfRange(current, visibleEnd, visibleStart){
  return ;
}