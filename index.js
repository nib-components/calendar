var moment = require('moment');
var domify = require('domify');
var delegate = require('delegate');
var emitter = require('emitter');
var template = require('./template.html');

/**
 * Create a calendar object
 * @constructor
 * @param   {Object} options
 * @returns {Calendar}
 */
function Calendar(options) {

  if (!(this instanceof Calendar)) {
    return new Calendar(options);
  }

  options = options || {};

  //override defaults from options
  this.monthFormat        = options.monthFormat || this.monthFormat;
  this.dayOfWeekFormat    = options.dayOfWeekFormat || this.dayOfWeekFormat;
  this.prevMonthNavClass  = options.prevMonthNavClass || this.prevMonthNavClass;
  this.nextMonthNavClass  = options.nextMonthNavClass || this.nextMonthNavClass;

  this.el = domify(options.template || template);
  delegate.bind(this.el, '.js-next', 'click', this.next.bind(this));
  delegate.bind(this.el, '.js-previous', 'click', this.previous.bind(this));
  delegate.bind(this.el, '.js-today', 'click', this.today.bind(this));
  delegate.bind(this.el, '.js-select', 'click', this.onSelect.bind(this));

  this.prevNavElement     = this.el.querySelector('.js-previous');
  this.nextNavElement     = this.el.querySelector('.js-next');

  this.monthElement       = this.el.querySelector(this.monthSelector);
  this.dayOfWeekElements  = this.el.querySelectorAll('.js-day-of-week');
  this.body               = this.el.querySelector(this.bodySelector);

  if (typeof(options.selectTodayByDefault) === 'undefined' || options.selectTodayByDefault) {
    this.current = this.selected = moment();
  } else {
    this.current = moment();
  }

  this.render();
}

/**
 * Allows the calendar to trigger events
 */
emitter(Calendar.prototype);

/**
 * Class given to the selected day element
 * @type {String}
 */
Calendar.prototype.selectedClass = 'is-selected';

/**
 * Test class given to the selected day element
 * @type {String}
 */
Calendar.prototype.selectedTestClass = 't-is-selected';

/**
 * Class given to the element for today
 * @type {String}
 */
Calendar.prototype.todayClass = 'is-today';

Calendar.prototype.dayTestClassFormat = 't-calendar-day-';

/**
 * Class given to disabled days. These are days
 * that are rendered on calendar but aren't in
 * the current month.
 * @type {String}
 */
Calendar.prototype.disabledClass = 'is-disabled';

Calendar.prototype.prevMonthClass = 'is-prev-month';
Calendar.prototype.nextMonthClass = 'is-next-month';

Calendar.prototype.prevMonthNavClass = 'icon-circle-arrow icon--light icon--left';
Calendar.prototype.nextMonthNavClass = 'icon-circle-arrow icon--light icon--right';

/**
 * Format for the month of the calendar
 * @type {String}
 */
Calendar.prototype.monthFormat = 'MMMM YYYY';

/**
 * Format for the day-of-week of the calendar
 * @type {String}
 */
Calendar.prototype.dayOfWeekFormat = null;

/**
 * Format of the day returned when calling this.date()
 * @type {String}
 */
Calendar.prototype.format = null;

/**
 * Selector that matches the element for the calendar month
 * @type {String}
 */
Calendar.prototype.monthSelector = '.js-month';

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

//-------------------------------------------------------------------------------

/**
 * Check whether the user can navigate to the previous month
 * @returns {Boolean}
 */
Calendar.prototype.canNavigateToPreviousMonth = function() {
  return true;
};

/**
 * Check whether the user can navigate to the previous month
 * @returns {Boolean}
 */
Calendar.prototype.canNavigateToNextMonth = function() {
  return true;
};

/**
 * Render the previous month
 * @return {Calendar}
 */
Calendar.prototype.previous = function() {

  if (!this.canNavigateToPreviousMonth()) {
    return this;
  }

  this.view(moment(this.current).subtract(1, 'months'));
  this.emit('previous');

  return this;
};

/**
 * Render the next month
 * @return {Calendar}
 */
Calendar.prototype.next = function() {

  if (!this.canNavigateToNextMonth()) {
    return this;
  }

  this.view(moment(this.current).add(1, 'months'));
  this.emit('next');

  return this;
};

/**
 * Update the visual state of the calendar navigation
 */
Calendar.prototype.renderNavigation = function() {
  var self = this;

  this.prevMonthNavClass.split(' ').forEach(function(className) {
    self.prevNavElement.classList.add(className);
  });

  this.nextMonthNavClass.split(' ').forEach(function(className) {
    self.nextNavElement.classList.add(className);
  });

  if (this.canNavigateToPreviousMonth()) {
    this.prevNavElement.classList.remove('is-disabled');
  } else {
    this.prevNavElement.classList.add('is-disabled');
  }

  if (this.canNavigateToNextMonth()) {
    this.nextNavElement.classList.remove('is-disabled');
  } else {
    this.nextNavElement.classList.add('is-disabled');
  }

};

//-------------------------------------------------------------------------------

/**
 * Select today and render todays month
 * @return {Calendar}
 */
Calendar.prototype.today = function() {
  this.view();
  this.select(moment());
  return this;
};

/**
 * Select a date on the calendar
 * @param  {Moment} date Moment instance
 * @return {Calendar}
 */
Calendar.prototype.select = function(date, silent) {

  //handle null dates
  if (date !== null) {

    date = moment(date);

    if (this.isDayDisabled(date)) {
      return this;
    }

  }

  this.selected = date;

  if(!silent){
    this.emit('select', this.date(), this.moment());
  }

  this.view(date || this.current);
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
  return this.selected ? this.selected.format(this.format) : this.selected;
};

/**
 * Get the current selected date as a moment object
 * @return {Moment}
 */
Calendar.prototype.moment = function() {
  return this.selected;
};

/**
 * Get the currently viewed month as a moment object
 * @return {Moment}
 */
Calendar.prototype.getCurrent = function() {
  return this.current;
};

/**
 * Check if 2 dates are actually the same day
 * @param  {Moment}  a
 * @param  {Moment}  b
 * @return {Boolean}
 */
Calendar.prototype.isSameDay = function(a, b) {
  return moment(a).format('DD-MM-YYYY') === moment(b).format('DD-MM-YYYY');
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
  var lastMonth = moment(date).subtract(1, 'months');
  var daysInLastMonth = lastMonth.daysInMonth();
  var inactiveBeforeDays = moment(date).date(1).day() - 1;

  if( inactiveBeforeDays >= 0 ) {
    return moment(lastMonth).date( daysInLastMonth - inactiveBeforeDays );
  } else {
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
  var day = domify('<span></span>');
  day.classList.add('calendar__day');
  day.classList.add(this.dayTestClassFormat + data.day);

  if (data.isSelected) {
    day.classList.add(this.selectedClass);
    day.classList.add(this.selectedTestClass);
  }

  if (data.isDisabled) day.classList.add(this.disabledClass);
  if (data.isToday) day.classList.add(this.todayClass);
  if (data.isInPrevMonth) day.classList.add(this.prevMonthClass);
  if (data.isInNextMonth) day.classList.add(this.nextMonthClass);

  day.setAttribute('data-date', data.date);
  day.classList.add('js-select');
  day.textContent = data.day;
  return day;
};

/**
 * Render the calendar header
 */
Calendar.prototype.renderTitle = function() {
  var month = this.current.format(this.monthFormat);
  this.monthElement.textContent = month;
  this.monthElement.classList.add('t-calendar-month');

  if (this.dayOfWeekFormat) {

    var currentDay = moment();
    currentDay.startOf('week');

    for (var i = 0; i < 7; i++) {
      this.dayOfWeekElements[i].innerHTML = currentDay.format(this.dayOfWeekFormat);
      currentDay.add(1, 'day');
    }

  }

  return this;
};

/**
 * Return whether the a day is selected
 * @param   {Moment} day
 * @returns {Boolean}
 */
Calendar.prototype.isDaySelected = function(day) {
  if (this.selected) {
    return this.isSameDay(day, this.selected);
  } else {
    return false;
  }
};

/**
 * Return whether the a day is disabled
 * @param   {Moment} day
 * @returns {Boolean}
 */
Calendar.prototype.isDayDisabled = function(day) {
  return false;
};

/**
 * Return whether the day is in the previous month
 * @param   {Moment} day
 * @returns {Boolean}
 */
Calendar.prototype.isDayInPrevMonth = function(day) {
  var
    cyear   = moment(this.current).year(),
    cmonth  = moment(this.current).month(),
    dyear   = moment(day).year(),
    dmonth  = moment(day).month()
    ;

  if (dyear === (cyear-1) && dmonth === 11 && cmonth === 0) {
    return true;
  } else {
    return dmonth === (cmonth-1);
  }

};

/**
 * Return whether the day is in the next month
 * @param   {Moment} day
 * @returns {Boolean}
 */
Calendar.prototype.isDayInNextMonth = function(day) {
  var
    cyear   = moment(this.current).year(),
    cmonth  = moment(this.current).month(),
    dyear   = moment(day).year(),
    dmonth  = moment(day).month()
    ;

  //check the year
  if (dyear-cyear < 0 || dyear-cyear > 1) {
    return false;
  }

  return dmonth === (cmonth+1) % 12;
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
      day:            current.date(),
      date:           current.startOf('day').format(),
      isToday:        this.isSameDay(current, today),
      isInPrevMonth:  this.isDayInPrevMonth(current),
      isInNextMonth:  this.isDayInNextMonth(current),
      isSelected:     this.isDaySelected(current),
      isDisabled:     this.isDayDisabled(current)
    }));
    current.add(1, 'days');
  }

  while (this.body.childNodes.length>0) {
    this.body.removeChild(this.body.childNodes[0]);
  }
  this.body.appendChild(fragment);

  return this;
};

/**
 * Update the calendar
 * @return {Calendar}
 */
Calendar.prototype.render = function() {
  this.renderNavigation();
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
  this.off();
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
  this.select(event.delegateTarget.getAttribute('data-date'));
};

module.exports = Calendar;
