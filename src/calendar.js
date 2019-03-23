export default class Calendar {

    today = new Date();
    years = null;

    get currentYear() {
        return this.today.getFullYear();
    }

    get currentMonth() {
        return this.today.getMonth();
    }

    get currentDay() {
        return this.today.getDate();
    }

    static MONTH_NAMES = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    static WEEKDAY_NAMES = [
        {
            name: 'Пн',
            title: 'Понедельник'
        },
        {
            name: 'Вт',
            title: 'Вторник'
        },
        {
            name: 'Ср',
            title: 'Среда'
        },
        {
            name: 'Чт',
            title: 'Четверг'
        },
        {
            name: 'Пт',
            title: 'Пятница'
        },
        {
            name: 'Сб',
            title: 'Суббота'
        },
        {
            name: 'Вс',
            title: 'Воскресенье'
        },
    ];

    static DAYS_IN_MONTH = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    static MONTHS = {
        JAN: 0,
        FEB: 1,
        MAR: 2,
        APR: 3,
        MAY: 4,
        JUN: 5,
        JUL: 6,
        AUG: 7,
        SEP: 8,
        OCT: 9,
        NOV: 10,
        DEC: 11
    };

    static DAYS_IN_WEEK = 7;

    static WEEK_OF_MONTH = 6;

    static isLeepYear(year) {
        return !((year % 4) || (!(year % 100) && (year % 400)));
    }

    static getDaysInMonth(year, month) {
        const isLeepYear = Calendar.isLeepYear(year);

        if (month === Calendar.MONTHS.FEB && isLeepYear) {
            return Calendar.DAYS_IN_MONTH[month] + 1;
        }

        return Calendar.DAYS_IN_MONTH[month];
    }

    static getDayOfWeek(year, month, day) {
        let dayOfWeek = new Date(year, month, day).getDay();
        return dayOfWeek === 0 ? 6 : (dayOfWeek - 1);
    }

    static getWeekOfMonth(daysInMonth, monthStartsOn) {
        return Math.ceil((daysInMonth + monthStartsOn) / Calendar.DAYS_IN_WEEK);
    }
    
    static isEqualDate(date1, date2) {
        try {
            if (date1.year !== date2.year) return false;
            if (date1.month !== date2.month) return false;
            if (date1.day !== date2.day) return false;

            return true;
        } catch {
            return false;
        }
    }

    constructor() {
        this.setYearList();
    }

    setYearList(startingPoint) {
        const currentYear = startingPoint || this.currentYear;
        this.years = [];

        for (let year = currentYear - 50; year < currentYear + 50; year++) {
            this.years.push(year);
        }
    }

    isToday(year, month, day) {
        if (year != this.currentYear) return false;
        if (month != this.currentMonth) return false;
        if (day != this.currentDay) return false;

        return true;
    }

    getMonthData(year, month) {
        const daysInCurrentMonth = Calendar.getDaysInMonth(year, month);
        const currentMonthStartsOn = Calendar.getDayOfWeek(year, month, 1);

        let prevMonth = month - 1;
        let prevMonthYear = year;

        if (prevMonth < Calendar.MONTHS.JAN) {
            prevMonth = Calendar.MONTHS.DEC;
            prevMonthYear = year - 1;
        }

        let nextMonth = month + 1;
        let nextMonthYear = year;

        if (nextMonth > Calendar.MONTHS.DEC) {
            nextMonth = Calendar.MONTHS.JAN;
            nextMonthYear = year + 1;
        }

        const daysInPrevMonth = Calendar.getDaysInMonth(prevMonthYear, prevMonth);

        const data = [];

        let currentMonthDay = 1;
        let prevMonthDay = daysInPrevMonth - currentMonthStartsOn + 1;
        let nextMonthDay = 1;

        for (let i = 0; i < Calendar.WEEK_OF_MONTH; i++) {
            data[i] = [];

            for (let j = 0; j < Calendar.DAYS_IN_WEEK; j++) {
                if (i === 0 && j < currentMonthStartsOn) {
                    data[i][j] = {
                        year: prevMonthYear,
                        month: prevMonth,
                        day: prevMonthDay,
                        isToday: false,
                        isCurrentMonthDay: false
                    };
                    prevMonthDay += 1;
                }
                else if (currentMonthDay > daysInCurrentMonth) {
                    data[i][j] = {
                        year: nextMonthYear,
                        month: nextMonth,
                        day: nextMonthDay,
                        isToday: false,
                        isCurrentMonthDay: false
                    };
                    nextMonthDay += 1;
                }
                else {
                    data[i][j] = {
                        year: year,
                        month: month,
                        day: currentMonthDay,
                        isToday: this.isToday(year, month, currentMonthDay),
                        isCurrentMonthDay: true
                    };

                    currentMonthDay += 1;
                }
            }
        }

        return data;
    }
}