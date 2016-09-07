var React = require('react');
var SortableItemMixin = require('react-anything-sortable').SortableItemMixin;

export default React.createClass({
  mixins: [SortableItemMixin],

  render: function(){
    const { className, children } = this.props;
    return this.renderWithSortable(
      <div className={className}>
        {children}
      </div>
    );
  }
});
