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
    todayButton = null
    selectDayButton = null;
    selectDayData = null;

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

    get selectedYear() {
        try {
            return Number(this.yearSelect.value);
        } catch {
            return this.data.currentYear;
        }
    }

    get selectedMonth() {
        try {
            return Number(this.monthSelect.value);
        } catch {
            return this.data.currentMonth;
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

    handleDayClick(selectDay, dayData) {
        this.changeSelectDay(selectDay, dayData);
    }

    changeSelectDay(selectDay, dayData) {
        if (selectDay.classList.contains('btn-light')) return;

        if (this.todayButton.classList.contains('btn-light')) {
            this.todayButton.classList.remove('btn-light');
            this.todayButton.classList.add('btn-dark');
        }

        selectDay.classList.remove('btn-dark');
        selectDay.classList.add('btn-light');

        if (this.selectDayButton === null) {
            this.selectDayButton = selectDay;
        }
        else {
            this.selectDayButton.classList.remove('btn-light');
            this.selectDayButton.classList.add('btn-dark');
            this.selectDayButton = selectDay;
        }

        this.selectDayData = dayData;

        
    }

    renderMonthSelect() {
        return (
            $('select',
                {
                    className: 'btn btn-dark border-light',
                    onchange: this.handleMonthSelectChange
                },
                Calendar.MONTH_NAMES.map((name, index) =>
                    $('option',
                        {
                            value: index,
                            selected: index === this.selectedMonth
                        },
                        name
                    )
                )
            )
        );
    }

    renderYearSelect() {
        return (
            $('select',
                {
                    className: 'btn btn-dark border-light',
                    onchange: this.handleYearSelectChange
                },
                Calendar.YEAR.map((year) =>
                    $('option',
                        {
                            value: year,
                            selected: year === this.selectedYear
                        },
                        year
                    )
                )
            )
        );
    }

    renderPrevMonthButton() {
        return (
            $('button',
                {
                    className: 'btn btn-dark border-light',
                    onclick: this.handlePrevMonthButtonClick,
                    title: 'Предыдущий месяц'
                },
                '❮'
            )
        );
    }

    renderNextMonthButton() {
        return (
            $('button',
                {
                    className: 'btn btn-dark border-light',
                    onclick: this.handleNextMonthButtonClick,
                    title: 'Следующий месяц'
                },
                '❯'
            )
        );
    }

    renderTableHead() {
        return (
            $('thead', null,
                Calendar.WEEKDAY_NAMES.map(({ name, title }) => $('th', { title }, name))
            )
        );
    }

    renderTableBody() {
        const month = this.data.getMonthData(this.selectedYear, this.selectedMonth);

        return (
            $('tbody', null,
                month.map(week =>
                    $('tr', null,
                        week.map((date) => {
                            return (
                                $('td', { className: 'p-1' },
                                    date.isToday ?
                                        (this.todayButton = $('button',
                                            {
                                                className: 'rounded-0 w-100 h-100 btn btn-light border-light',
                                                onclick: ({ target }) => {
                                                    this.handleDayClick(target);
                                                    this.onDateSelect(date);
                                                }
                                            },
                                            date.day
                                        )) :
                                        $('button',
                                            {
                                                className: `rounded-0 w-100 h-100 btn btn-dark${!date.isCurrentMonthDay ? ' text-muted' : ''}`,
                                                onclick: ({ target }) => {
                                                    this.handleDayClick(target, date);
                                                    this.onDateSelect(date);
                                                }
                                            },
                                            date.day
                                        )
                                )
                            );
                        })
                    )
                )
            )
        );
    }

    renderTable() {
        return (
            $('table', { className: 'table table-bordered table-dark m-0' },
                this.tableHead,
                this.tableBody
            )
        );
    }

    renderCalendar() {
        return (
            $('div',
                {
                    id: 'calendar',
                    className: 'card bg-dark'
                },
                $('header', { className: 'card-body pb-0 mb-0' },
                    $('div', { className: 'col-auto' },
                        this.prevMonthButton,
                    ),
                    $('div', { className: 'col-auto' },
                        this.monthSelect
                    ),
                    $('div', { className: 'col-auto' },
                        this.yearSelect
                    ),
                    $('div', { className: 'col-auto' },
                        this.nextMonthButton
                    ),
                ),
                $('section', { className: 'card-body' },
                    this.table
                )
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