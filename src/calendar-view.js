import $ from './dom';
import Calendar from './calendar';

export default class CalendarView {

    calendar = null;
    rootElement = null;
    yearSelect = null;
    monthSelect = null;
    prevMonthButton = null;
    nextMonthButton = null;
    tableHead = null;
    tableBody = null;
    table = null;
    onDateSelect = null;

    static NEXT_MONTH = 1;
    static PREV_MONTH = -1;

    handleMonthSelectChange = this.handleMonthSelectChange.bind(this);
    handleYearSelectChange = this.handleYearSelectChange.bind(this);
    handlePrevMonthButtonClick = this.handlePrevMonthButtonClick.bind(this);
    handleNextMonthButtonClick = this.handleNextMonthButtonClick.bind(this);

    constructor(calendar, rootElement, onDateSelect = Function.prototype) {
        this.init(calendar, rootElement, onDateSelect);
        this.render();
        this.update();
    }

    get selectedYear() {
        return Number(this.yearSelect.value);
    }

    get selectedMonth() {
        return Number(this.monthSelect.value);
    }

    handleMonthSelectChange() {
        this.update();
    }

    handleYearSelectChange() {
        this.update();
    }

    changeMonth(direction) {
        let month = this.selectedMonth;
        let year = this.selectedYear;

        month += direction;

        if (month < Calendar.MONTHS.JAN) {
            month = Calendar.MONTHS.DEC;
            year += direction;
            this.yearSelect.value = year;
        }

        if (month > Calendar.MONTHS.DEC) {
            month = Calendar.MONTHS.JAN;
            year += direction;
            this.yearSelect.value = year;
        }

        this.monthSelect.value = month;
    }

    handlePrevMonthButtonClick() {
        this.changeMonth(CalendarView.PREV_MONTH);
        this.update();
    }

    handleNextMonthButtonClick() {
        this.changeMonth(CalendarView.NEXT_MONTH);
        this.update();
    }

    init(calendar, rootElement, onDateSelect) {
        this.calendar = calendar;
        this.rootElement = rootElement;
        this.onDateSelect = onDateSelect;

        this.monthSelect = $('select', {
                onchange: this.handleMonthSelectChange
            },
            Calendar.MONTH_NAMES.map((name, index) =>
                $('option', {
                        value: index,
                        selected: index === this.calendar.currentMonth
                    },
                    name
                )
            )
        );

        this.yearSelect = $('select', {
                onchange: this.handleYearSelectChange
            },
            Calendar.YEAR.map((year) =>
                $('option', {
                        value: year,
                        selected: year === this.calendar.currentYear
                    },
                    year
                )
            )
        );

        this.prevMonthButton = $('button', {
                className: 'button',
                onclick: this.handlePrevMonthButtonClick
            },
            '❮'
        );

        this.nextMonthButton = $('button', {
                className: 'button',
                onclick: this.handleNextMonthButtonClick
            },
            '❯'
        );

        this.tableHead = $('thead', null,
            Calendar.WEEKDAY_NAMES.map(weekday =>
                $('th', null, weekday)
            )
        );

        this.tableBody = $('tbody', null);

        this.table = $('table', {
                className: 'table is-bordered'
            },
            this.tableHead,
            this.tableBody
        );
    }

    render() {
        this.rootElement.appendChild(
            $('div', {
                    id: 'calendar',
                    className: 'box'
                },
                $('header', null,
                    this.prevMonthButton,
                    $('div', {
                        className: 'select'
                    }, this.monthSelect),
                    $('div', {
                        className: 'select'
                    }, this.yearSelect),
                    this.nextMonthButton
                ),
                this.table
            )
        );
    }

    update() {
        const month = this.calendar.getMonthData(this.selectedYear, this.selectedMonth);

        const tableBody = $('tbody', null,
            month.map(week =>
                $('tr', null,
                    week.map((date) =>
                        $('td', {
                                className: date.isToday ? 'has-background-primary has-text-white' : undefined,
                                onclick: (date.day > 0) ? () => this.onDateSelect(date) : null
                            },
                            (date.day > 0) ? date.day : ''
                        )
                    )
                )
            )
        );

        this.table.removeChild(this.tableBody);
        this.tableBody = tableBody;
        this.table.appendChild(this.tableBody);
    }
}