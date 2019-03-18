const calendar = new Calendar();

const view = new CalendarView(
    calendar,
    document.querySelector('#root'),
    date => console.log(date)
);