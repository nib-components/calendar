var moment = require('moment');
var assert = require('assert');
var Calendar = require('calendar');

describe('Calendar', function() {

  describe('.isDayInNextMonth()', function() {

    it('should always be false', function() {
      assert(!Calendar().isDayDisabled('2012-09-29'));
    });

  });

  describe('.isDayInPrevMonth()', function() {

    it('should be true when the day is less than the currently viewed month', function() {
      assert(Calendar().view('2012-10-12').isDayInPrevMonth('2012-09-29'));
    });

    it('should be false when the day is equal to the currently viewed month', function() {
      assert(!Calendar().view('2012-10-12').isDayInPrevMonth('2012-10-29'));
    });

    it('should be false when the day is greater than the currently viewed month', function() {
      assert(!Calendar().view('2012-10-12').isDayInPrevMonth('2012-11-01'));
    });

  });

  describe('.isDayInNextMonth()', function() {

    it('should be false when the day is less than the currently viewed month', function() {
      assert(!Calendar().view('2012-10-12').isDayInNextMonth('2012-09-29'));
    });

    it('should be false when the day is equal to the currently viewed month', function() {
      assert(!Calendar().view('2012-10-12').isDayInNextMonth('2012-10-29'));
    });

    it('should be true when the day is greater than the currently viewed month', function() {
      assert(Calendar().view('2012-10-12').isDayInNextMonth('2012-11-01'));
    });

  });

  describe('.next()', function() {

    it('should navigate to next month', function() {
      var calendar  = new Calendar();
      var title     = calendar.el.querySelector('.js-title');

      var day = calendar.el.querySelector('.calendar__day:nth-child(14)');
      assert.equal(title.textContent, moment().format(calendar.monthFormat)); //title
      assert.equal(moment(day.getAttribute('data-date'), calendar.format).date(1).format('YYYY-MM-DD'), moment().date(1).format('YYYY-MM-DD')); //day

      calendar.next();

      var day = calendar.el.querySelector('.calendar__day:nth-child(14)');
      assert.equal(title.textContent, moment().date(1).add(1, 'month').format(calendar.monthFormat)); //title
      assert.equal(moment(day.getAttribute('data-date'), calendar.format).date(1).format('YYYY-MM-DD'), moment().date(1).add(1, 'month').format('YYYY-MM-DD')); //day

    });

  });

  describe('.previous()', function() {

    it('should navigate to previous month', function() {
      var calendar  = new Calendar();
      var title     = calendar.el.querySelector('.js-title');

      var day = calendar.el.querySelector('.calendar__day:nth-child(14)');
      assert.equal(title.textContent, moment().format(calendar.monthFormat)); //title
      assert.equal(moment(day.getAttribute('data-date'), calendar.format).date(1).format('YYYY-MM-DD'), moment().date(1).format('YYYY-MM-DD')); //day

      calendar.previous();

      var day = calendar.el.querySelector('.calendar__day:nth-child(14)');
      assert.equal(title.textContent, moment().date(1).subtract(1, 'month').format(calendar.monthFormat)); //title
      assert.equal(moment(day.getAttribute('data-date'), calendar.format).date(1).format('YYYY-MM-DD'), moment().date(1).subtract(1, 'month').format('YYYY-MM-DD')); //day

    });

  });

  describe('.renderNavigation()', function() {

    it('when I can navigate next the calendar should not remain on the same month', function() {

    });

    it('when I can not navigate next the calendar should remain on the same month', function() {

    });

    it('when I can navigate previous the calendar should not remain on the same month', function() {

    });

    it('when I can not navigate previous the calendar should remain on the same month', function() {

    });

  });

  describe('.renderBody()', function() {

    it('should add .is-disabled class when I override the .isDayDisabled() method', function() {
      var calendar = Calendar();

      calendar.isDayDisabled = function(day) {
        return day.day() === 0; //disable Sundays
      };

      calendar.render();

      //check that a Sunday is disabled but a Monday is not
      assert(calendar.el.querySelector('.js-select:nth-child(15)').classList.contains('is-disabled'))
      assert(!calendar.el.querySelector('.js-select:nth-child(17)').classList.contains('is-disabled'))

    });

    it('should add .is-prev-month class', function() {
      var calendar = Calendar();
      calendar.view('2015/04/09');

      //check that a 29th is in the previous month but the 1st isn't
      assert(calendar.el.querySelector('.js-select:nth-child(1)').classList.contains('is-prev-month'))
      assert(!calendar.el.querySelector('.js-select:nth-child(5)').classList.contains('is-prev-month'))

    });

    it('should add .is-next-month class', function() {
      var calendar = Calendar();
      calendar.view('2015/04/09');

      //check that a 9th is in the next month but the 30th isn't
      assert(calendar.el.querySelector('.js-select:nth-child(42)').classList.contains('is-next-month'))
      assert(!calendar.el.querySelector('.js-select:nth-child(33)').classList.contains('is-next-month'))
    });

  });

});