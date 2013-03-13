var template = require('./template');

function Calendar(options) {
  _.bindAll(this, 'next', 'previous', 'today', 'onSelect');
  this.el = $(template);
  this.el.on('click', '.js-next', this.next);
  this.el.on('click', '.js-previous', this.previous);
  this.el.on('click', '.js-today', this.today);
  this.el.on('click', '.js-select', this.onSelect);
  this.title = this.el.find(this.titleSelector);
  this.body = this.el.find(this.bodySelector);
  this.current = this.selected = moment();
  this.render();
}

/**
 * Allows the calendar to trigger events
 */
_.extend(Calendar.prototype, Backbone.Events);

/**
 * Class given to the selected day element
 * @type {String}
 */
Calendar.prototype.selectedClass = 'is-selected';

/**
 * Class given to the element for today
 * @type {String}
 */
Calendar.prototype.todayClass = 'is-today';

/**
 * Class given to disabled days. These are days
 * that are rendered on calendar but aren't in
 * the current month.
 * @type {String}
 */
Calendar.prototype.disabledClass = 'is-disabled';

/**
 * Format for the title of the calendar
 * @type {String}
 */
Calendar.prototype.titleFormat = 'MMMM YYYY';

/**
 * Format of the day returned when calling this.date()
 * @type {String}
 */
Calendar.prototype.format = null;

/**
 * Selector that matches the element for the calendar title
 * @type {String}
 */
Calendar.prototype.titleSelector = '.js-title';

/**
 * Selector that matches the body of the calendar
 * @type {String}
 */
Calendar.prototype.bodySelector = '.js-body';

/**
 * The current selected date
 * @type {Moment}
 */
Calendar.prototype.selected = null;

/**
 * The current rendered date
 * @type {Moment}
 */
Calendar.prototype.current = null;

/**
 * Select today and render todays month
 * @return {Calendar}
 */
Calendar.prototype.today = function() {
  this.view();
  this.select();
  return this;
};

/**
 * Render the previous month
 * @return {Calendar}
 */
Calendar.prototype.previous = function() {
  this.view(moment(this.current).subtract('months', 1));
  return this;
};

/**
 * Render the next month
 * @return {Calendar}
 */
Calendar.prototype.next = function() {
  this.view(moment(this.current).add('months', 1));
  return this;
};

/**
 * Select a date on the calendar
 * @param  {Moment} date Moment instance
 * @return {Calendar}
 */
Calendar.prototype.select = function(date, silent) {
  this.selected = moment(date);

  if( !silent ){
    this.trigger('select', this.date(), this.moment());
  }
  
  this.view(date);
  return this;
};

/**
 * View a date on the calendar but don't select it
 * @param  {String} date Any date format understood by Moment
 * @return {Calendar}
 */
Calendar.prototype.view = function(date) {
  this.current = moment(date);
  this.render();
  return this;
};

/**
 * Get the current selected date. Uses this.format
 * to determine the format to return the date by
 * default. If this is null, it will uses Moment's
 * default date format
 * @return {Moment}
 */
Calendar.prototype.date = function() {
  return this.selected.format(this.format);
};

/**
 * Get the current selected date as a moment object
 * @return {Moment}
 */
Calendar.prototype.moment = function() {
  return this.selected;
};

/**
 * Check if 2 dates are actually the same day
 * @param  {Moment}  a
 * @param  {Moment}  b
 * @return {Boolean}
 */
Calendar.prototype.isSameDay = function(a, b) {
  return a.diff(b,'days') === 0;
};

/**
 * See if two dates are in the same month
 * @param  {Moment}  a
 * @param  {Moment}  b
 * @return {Boolean}
 */
Calendar.prototype.isSameMonth = function(a, b) {
  return this.isSameDay(moment(a).date(1), moment(b).date(1));
};
  
/**
 * Get the date that the calendar needs to start rendering
 * from. This will include the previous month if this month
 * starts on any day other than Sunday
 * @param  {Moment} date
 * @return {Moment}
 */
Calendar.prototype.getStartDate = function(date) {
  var lastMonth = moment(date).subtract('months', 1);
  var daysInLastMonth = lastMonth.daysInMonth();
  var inactiveBeforeDays = moment(date).date(1).day() - 1;

  if( inactiveBeforeDays > 0 ) {
    return moment(lastMonth).date( daysInLastMonth - inactiveBeforeDays );
  }
  else {
    return moment(date).date(1);
  }
};

/**
 * Gets the element for a single day given the data
 * for a the day
 * @param  {Object} data Data describing that day
 * @return {Element}
 */
Calendar.prototype.renderDay = function(data) {
  var day = $('<span />');
  day.toggleClass(this.selectedClass, data.isSelected);
  day.toggleClass(this.disabledClass, data.isDisabled);
  day.toggleClass(this.todayClass, data.isToday);
  day.attr('data-date', data.date);
  day.addClass('js-select');
  day.text(data.day);
  return day[0];
};

/**
 * Get the calendar title
 * @return {[type]} [description]
 */
Calendar.prototype.renderTitle = function() {
  var title = this.current.format(this.titleFormat);
  this.title.text(title);
  return this;
};

/**
 * Get the calendar body by looping over each
 * day within that month and creating an element
 * for it. This method should return an element
 * that can be placed inside the body of the calendar
 * @return {Calendar}
 */
Calendar.prototype.renderBody = function() {
  var fragment = document.createDocumentFragment();
  var current = this.getStartDate(this.current);
  var today = moment();

  for (var i = 0; i <= 41; i++) {
    fragment.appendChild(this.renderDay({
      day: current.date(),
      date: current.format(),
      isSelected: this.isSameDay(current, this.selected),
      isDisabled: !this.isSameMonth(current, this.current),
      isToday: this.isSameDay(current, today)
    }));
    current.add('days', 1);
  }

  this.body.empty().append(fragment);
  return this;
};

/**
 * Update the calendar
 * @return {Calendar}
 */
Calendar.prototype.render = function() {
  this.renderBody();
  this.renderTitle();
  return this;
};

/**
 * Remove the calendar from the DOM and remove all events
 * @return {Calendar}
 */
Calendar.prototype.remove = function() {
  this.el.off();
  this.el.remove();
  this._callbacks = {};
  return this;
};

/**
 * When a day element is clicked, select that day using data attributes
 * This could have been done with views and whatnot, but since we only
 * need this one bit of data, this is the easiest way
 * @param  {Event} event
 * @return {void}
 */
Calendar.prototype.onSelect = function(event) {
  this.select(event.currentTarget.getAttribute('data-date'));
};

module.exports = Calendar;