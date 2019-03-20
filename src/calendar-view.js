import $ from './dom';
import Calendar from './calendar';

export default class CalendarView {

    data = null;
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
    handleDayClick = this.handleDayClick.bind(this);

    constructor(calendar, rootElement, onDateSelect = Function.prototype) {
        this.init(calendar, rootElement, onDateSelect);
        this.update();
    }

    get selectedYear() {
        try {
            return Number(this.yearSelect.value);
        } catch {
            return null;
        }
    }

    get selectedMonth() {
        try {
            return Number(this.monthSelect.value);
        } catch {
            return null;
        }
    }

    handleMonthSelectChange() {
        this.update();
    }

    handleYearSelectChange() {
        this.data.setYearList(this.selectedYear);
        this.update();
    }

    handlePrevMonthButtonClick() {
        this.changeMonth(CalendarView.PREV_MONTH);
        this.update();
    }

    handleNextMonthButtonClick() {
        this.changeMonth(CalendarView.NEXT_MONTH);
        this.update();
    }

    handleDayClick(selectDay) {
        this.changeSelectDay(selectDay);
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

    changeSelectDay(selectDay) {
        this.tableBody.querySelectorAll('td').forEach(day => {
            day.className = '';
        });

        selectDay.className = 'has-background-primary has-text-white';
    }

    init(data, rootElement, onDateSelect) {
        this.data = data;
        this.rootElement = rootElement;
        this.onDateSelect = onDateSelect;

        this.monthSelect = this.renderMonthSelect();
        this.yearSelect = this.renderYearSelect();
        this.prevMonthButton = this.renderPrevMonthButton();
        this.nextMonthButton = this.renderNextMonthButton();
        this.tableHead = this.renderTableHead();
        this.tableBody = this.renderTableBody();
        this.table = this.renderTable();
        this.calendar = this.renderCalendar();

        this.rootElement.appendChild(this.calendar);
    }

    renderMonthSelect() {
        const selectedMonth = this.selectedMonth !== null ? this.selectedMonth : this.data.currentMonth
        return (
            $('select', {
                    onchange: this.handleMonthSelectChange
                },
                Calendar.MONTH_NAMES.map((name, index) =>
                    $('option', {
                            value: index,
                            selected: index === selectedMonth
                        },
                        name
                    )
                )
            )
        );
    }

    renderYearSelect() {
        const selecterYear = this.selectedYear !== null ? this.selectedYear : this.data.currentYear;
        return (
            $('select', {
                    onchange: this.handleYearSelectChange
                },
                Calendar.YEAR.map((year) =>
                    $('option', {
                            value: year,
                            selected: year === selecterYear
                        },
                        year
                    )
                )
            )
        );
    }

    renderPrevMonthButton() {
        return (
            $('button', {
                    className: 'button',
                    onclick: this.handlePrevMonthButtonClick
                },
                '❮'
            )
        );
    }

    renderNextMonthButton() {
        return (
            $('button', {
                    className: 'button',
                    onclick: this.handleNextMonthButtonClick
                },
                '❯'
            )
        );
    }

    renderTableHead() {
        return (
            $('thead', null,
                Calendar.WEEKDAY_NAMES.map(weekday =>
                    $('th', null, weekday)
                )
            )
        );
    }

    renderTableBody() {
        const month = this.data.getMonthData(this.selectedYear, this.selectedMonth);

        return (
            $('tbody', null,
                month.map(week =>
                    $('tr', null,
                        week.map((date) =>
                            $('td', {
                                    className: date.isToday && 'has-background-primary has-text-white',
                                    style: date.isToday && 'border: 2px solid #00d1b2',
                                    onclick: (date.day > 0) ? ({ target }) => {
                                            this.handleDayClick(target);
                                            this.onDateSelect(date);
                                        } : null
                                },
                                (date.day > 0) ? date.day : ''
                            )
                        )
                    )
                )
            )
        );
    }

    renderTable() {
        return (
            $('table', {
                    className: 'table is-bordered'
                },
                this.tableHead,
                this.tableBody
            )
        );
    }

    renderCalendar() {
        return (
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
        this.monthSelect = this.renderMonthSelect();
        this.yearSelect = this.renderYearSelect();
        this.tableBody = this.renderTableBody();
        this.table = this.renderTable();
        const calendar = this.renderCalendar();

        this.rootElement.replaceChild(calendar, this.calendar);

        this.calendar = calendar;
    }
}