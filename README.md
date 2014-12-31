# calendar

Create a simple calendar.

## Installation

    component install --save nib-components/calendar

## Usage

    var Calendar = require('calendar');

    var calendar = new Calendar();
    document.body.appendChild(calendar.el);

## API

### .date() : String|null

Get the selected date formatted as per `Calendar.prototype.format`.

### .moment() : Moment|null

Get the selected date as a MomentJS object.

### .view(date : Moment)

Update the calendar to display the days in the month containing the specified date.

### .next()

Update the calendar to display the days in the month after the current month.

### .previous()

Update the calendar to display the days in the month before the current month.

### .select(date : Moment|null)

Select the specified date and update the calendar to display the days in the month containing the specified date.

### .isDayDisabled(date : Moment)

Check whether a date is disabled according to the calendar. Default implementation always returns `false`. Can be overridden to disable dates.

## Notes

 - requires shims for HTMLElement.classList in IE<9