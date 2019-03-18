class CalendarView {
    constructor(calendar, rootElement, onDateSelect = Function.prototype) {
        this.calendar = calendar;
        this.rootElement = rootElement;
        this.onDateSelect = onDateSelect;
        this.yearSelect = null;
        this.monthSelect = null;
        this.prevMonthButton = null;
        this.nextMonthButton = null;
        this.table = null;
        this.tableHead = null;
        this.tableBody = null;

        this.handleMonthSelectChange = this.handleMonthSelectChange.bind(this);
        this.handleYearSelectChange = this.handleYearSelectChange.bind(this);
        this.handlePrevMonthButtonClick = this.handlePrevMonthButtonClick.bind(this);
        this.handleNextMonthButtonClick = this.handleNextMonthButtonClick.bind(this);

        this.init();
        this.render();
        this.update();
    }

    get year() {
        return Number(this.yearSelect.value);
    }

    get month() {
        return Number(this.monthSelect.value);
    }

    handleMonthSelectChange() {
        this.update();
    }

    handleYearSelectChange() {
        this.update();
    }

    handlePrevMonthButtonClick() {
        let month = this.month - 1;

        if (month === -1) {
            month = 11;
            this.yearSelect.value = this.year - 1;
        }

        this.monthSelect.value = month;

        this.update();
    }

    handleNextMonthButtonClick() {
        let month = this.month + 1;

        if (month === 12) {
            month = 0;
            this.yearSelect.value = this.year + 1;
        }

        this.monthSelect.value = month;

        this.update();
    }

    init() {
        this.monthSelect = createElement('select', {
            onchange: this.handleMonthSelectChange
        },
            Calendar.MONTH_NAMES.map((name, index) =>
                createElement('option', {
                    value: index,
                    selected: index === this.calendar.currentMonth
                }, name)
            )
        );

        this.yearSelect = createElement('select', {
            onchange: this.handleMonthSelectChange
        },
            [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020].map(year =>
                createElement('option', {
                    value: year,
                    selected: year === this.calendar.currentYear
                }, year)
            )
        );

        this.prevMonthButton = createElement('button', {
            className: 'button',
            onclick: this.handlePrevMonthButtonClick
        }, '<');

        this.nextMonthButton = createElement('button', {
            className: 'button',
            onclick: this.handleNextMonthButtonClick
        }, '>');

        this.tableHead = createElement('thead', null,
            ['Пн', 'Вт', 'Ср', 'Чт' , 'Пт', 'Сб', 'Вс'].map(weekday =>
                createElement('th', null, weekday)
            )
        );

        this.tableBody = createElement('tbody', null);

        this.table = createElement('table', { className: 'table is-bordered' },
            this.tableHead,
            this.tableBody
        );
    }

    render() {
        const element = createElement('div', { id: 'calendar' },
            createElement('header', null,
                this.prevMonthButton,
                createElement('div', { className: 'select' }, this.monthSelect),
                createElement('div', { className: 'select' }, this.yearSelect),
                this.nextMonthButton
            ),

            this.table
        );

        this.rootElement.appendChild(element);
    }

    update() {
        const month = this.calendar.getMonthData(this.year, this.month);
        
        const tableBody = createElement('tbody', null,
            month.map(week =>
                createElement('tr', null,
                    week.map(date =>
                        createElement('td', {
                            className: date && date.isToday ? 'has-background-primary has-text-white' : undefined,
                            onclick: date ? () => this.onDateSelect(date) : undefined
                        }, date ? date.day : '')
                    )
                )
            )
        );

        this.table.removeChild(this.tableBody);
        this.tableBody = tableBody;
        this.table.appendChild(this.tableBody);
    }
}