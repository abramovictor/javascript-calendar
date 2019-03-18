export default class CalendarView {

    calendar = null;
    rootElement = null;
    yearSelect = null;
    monthSelect = null;
    prevMonthSelect = null;
    nextMonthSelect = null;
    table = null;

    constructor(calendar, rootElement) {
        this.calendar = calendar;
        this.rootElement = rootElement;

        this.init();
    }

    init() {

    }
}