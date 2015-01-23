# calendar

Create a simple calendar.

## Installation

    component install --save nib-components/calendar

## Usage

    var Calendar = require('calendar');

    var calendar = new Calendar();
    document.body.appendChild(calendar.el);

## Notes

 - requires shims for HTMLElement.classList in IE<9