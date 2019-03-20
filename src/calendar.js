export default class Calendar {

    today = new Date();

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
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб',
        'Вс'
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

    static YEAR = null;

    constructor() {
        this.setYearList();
    }

    setYearList(startingPoint) {
        const currentYear = startingPoint || this.currentYear;
        Calendar.YEAR = [];
        
        for (let year = currentYear - 50; year < currentYear + 50; year++) {
            Calendar.YEAR.push(year);
        }
    }

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

    static getDaysOfWeek(year, month, day) {
        let daysOfWeek = new Date(year, month, day).getDay();
        return daysOfWeek === 0 ? 6 : (daysOfWeek - 1);
    }

    static getWeekOfMonth(daysInMonth, monthStartsOn) {
        return Math.ceil((daysInMonth + monthStartsOn) / Calendar.DAYS_IN_WEEK);
    }

    isToday(year, month, day) {
        if (year != this.currentYear) return false;
        if (month != this.currentMonth) return false;
        if (day != this.currentDay) return false;

        return true;
    }

    getMonthData(year, month) {
        const daysInMonth = Calendar.getDaysInMonth(year, month);
        const monthStartsOn = Calendar.getDaysOfWeek(year, month, 1);

        const data = [];
        const weekOfMonth = Calendar.getWeekOfMonth(daysInMonth, monthStartsOn);

        let day = 1;

        for (let i = 0; i < weekOfMonth; i++) {
            data[i] = [];

            for (let j = 0; j < Calendar.DAYS_IN_WEEK; j++) {
                if (i === 0 && j < monthStartsOn || day > daysInMonth) {
                    data[i][j] = 0;
                }
                else {
                    data[i][j] = {
                        year,
                        month,
                        day,
                        isToday: this.isToday(year, month, day)
                    };

                    day += 1;
                }
            }
        }

        return data;
    }
}