# calendar

Create a simple calendar.

## Installation

    component install --save nib-components/calendar

## Usage

    var Calendar = require('calendar');

    var calendar = new Calendar();
    document.body.appendChild(calendar.el);

## API

### Methods

#### new Calendar(options)

Options:

 - monthFormat - Format of the month displayed to the user in the header
 - dayOfWeekFormat - Format of the day-of-the week displayed to the user in the header

 - prevMonthNavClass
 - nextMonthNavClass

#### .previous()

Update the calendar to display the days in the month before the current month.

#### .next()

Update the calendar to display the days in the month after the current month.

#### .canNavigateToPreviousMonth() : Boolean

Check whether the user can navigate to the previous month. Default implementation always returns `true`. Can be overridden to prevent navigation.

#### .canNavigateToNextMonth() : Boolean

Check whether the user can navigate to the next month. Default implementation always returns `true`. Can be overridden to prevent navigation.

#### .view(date : Moment)

Update the calendar to display the days in the month containing the specified date.

#### .select(date : Moment|null)

Select the specified date and update the calendar to display the days in the month containing the specified date.

#### .date() : String|null

Get the selected date formatted as per `Calendar.prototype.format`.

#### .moment() : Moment|null

Get the selected date as a MomentJS object.

#### .isDayDisabled(date : Moment)

Check whether a date is disabled according to the calendar. Default implementation always returns `false`. Can be overridden to disable dates.

### Events

#### previous
#### next
#### select

## Notes

 - requires shims for HTMLElement.classList in IE<9