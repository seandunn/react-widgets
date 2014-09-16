'use strict';
var React = require('react')
  , cx = require('../util/cx')
  , _     =  require('lodash')
  , $     =  require('../util/dom')
  , directions = require('../util/constants').directions
  , mergeIntoProps = require('../util/transferProps').mergeIntoProps
  , SelectInput = require('./search-input.jsx')
  , TagList = require('./tag-list.jsx')
  , Popup = require('../popup/popup.jsx')
  , List  = require('../common/list.jsx')
  , ListItem;

var btn = require('../common/btn.jsx')
  , propTypes = {
      data:                 React.PropTypes.array,
      value:                React.PropTypes.array,
      onChange:             React.PropTypes.func,

      valueField:           React.PropTypes.string,
      textField:            React.PropTypes.string,

      itemComponent:        React.PropTypes.func,

      virtualScroll:        React.PropTypes.shape({
        initialItems:       React.PropTypes.number,
        itemHeight:         React.PropTypes.number,
      }),

      messages:             React.PropTypes.shape({
        emptyList:          React.PropTypes.string
      })
    };



module.exports = React.createClass({

  displayName: 'CheckboxList',
  
  mixins: [ 
    require('../mixins/PureRenderMixin'),
    require('../mixins/DataHelpersMixin'),
    require('../mixins/VirtualScrollMixin'),
    require('../mixins/RtlParentContextMixin')
  ],

  propTypes: propTypes,

  getDefaultProps: function(){
    return {
      messages: {
        emptyList:   "There are no items in this list"
      }
    }
  },

  getInitialState: function(){
    var initialIdx = this._dataIndexOf(this.props.data, this.props.value);

    return {
      open:  false,
      focused: false,
      focusedIndex:  initialIdx === -1 ? 0 : initialIdx
    }
  },

  render: function(){ 
    var self = this
      , items  = this._data();

    function listItem(props, children){
      return ListItem.call(this
        , _.extend(props, { 
            itemComponent: self.props.itemComponent, 
            onChange: self._onSelect,
            valueField: self.props.valueField,
            textField: self.props.textField,
            checked:   self._dataIndexOf(self.props.value, props.item) !== -1
          })
        , children)
    };


    return mergeIntoProps(
      _.omit(this.props, 'data', 'value', 'onChange'),
      <ul 
        ref='scrollable'
        onFocus={_.partial(this._focus, true)} 
        onBlur ={_.partial(this._focus, false)} 
        tabIndex="-1"
        onKeyDown={this._keyDown}
        className={cx({
          'rw-checkbox-list':  true,
          'rw-widget':         true,
          'rw-state-focus':    this.state.focused,
          'rw-rtl':            this.isRtl()
        })}>
        {this._eachVisible(this._data(), function(item, idx){
          return (<li>
            <label>
              <input type='checkbox' 
                checked={this.props.checked} 
                onChange={this._onChange} 
                value={this._dataValue(item)}/>
                { this.props.itemComponent 
                  ? this.props.itemComponent({ item: item }) 
                  : this._dataText(item)
                }
            </label>
          </li>)
        })}
      </ul>
    )
  },

  _data: function(){
    return this.props.data
  },

  _focus: function(focused){
    var self = this;

    clearTimeout(self.timer)
    self.timer = setTimeout(function(){
      if( focused !== self.state.focused)
        self.setState({ focused: focused })
    }, 0)
  },

  toggle: function(item){
    this._onSelect(item, !_.contains(this.props.value, item))
  },

  _onSelect: function(item, checked){
    this._focus(true)
    this.change(checked
      ? this.props.value.concat(item)
      : _.without(this.props.value, item))
  },

  // _keyDown: function(e){
  //   var key = e.key
  //     , items = this.getDOMNode().children;

  //   if (this.state.focused){
  //     e.preventDefault();


  //     else if ( key === 'End')
  //       items(this._data().length - 1).

  //     else if (  key === 'Home')
  //       this.setFocusedIndex(0)

  //     else if ( key === 'Enter' || key === ' ' )
  //       this.toggle( this._data()[this.state.focusedIndex])
  //   }
  // },

  change: function(data){
    var change = this.props.onChange 

    if ( change ) change(data)  
  },

})
