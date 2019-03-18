class Calendar {
    static isLeapYear(year) {
        return !((year % 4) || (!(year % 100) && (year % 400)));
    }

    static getDaysInMonth(year, month) {
        const isLeapYear = Calendar.isLeapYear(year);

        if (month === Calendar.MONTHS.FEB && isLeapYear) return Calendar.DAYS_IN_MONTH[month] + 1;

        return Calendar.DAYS_IN_MONTH[month];
    }

    static getDayOfWeek(year, month, day) {
        switch (new Date(year, month, day).getDay()) {
            case 0: return 6;
            case 1: return 0;
            case 2: return 1;
            case 3: return 2;
            case 4: return 3;
            case 5: return 4;
            case 6: return 5;
        }
    }

    constructor() {
        this.today = new Date();
    }

    get currentYear() {
        return this.today.getFullYear();
    }

    get currentMonth() {
        return this.today.getMonth();
    }

    get currentDay() {
        return this.today.getDate();
    }

    isToday(year, month, day) {
        if (year != this.currentYear) return false;
        if (month != this.currentMonth) return false;
        if (day != this.currentDay) return false;

        return true;
    }

    getMonthData(year, month) {
        const daysInMonth = Calendar.getDaysInMonth(year, month);
        const monthStartsOn = Calendar.getDayOfWeek(year, month, 1);
        const data = [];
        let day = 1;

        for (let i = 0; i < (daysInMonth + monthStartsOn) / Calendar.DAYS_IN_WEEK; i++) {
            data[i] = [];

            for (let j = 0; j < Calendar.DAYS_IN_WEEK; j++) {
                if ((i === 0 && j < monthStartsOn) || day > daysInMonth) {
                    data[i][j] = undefined;
                } else {
                    data[i][j] = {
                        year,
                        month,
                        day,
                        isToday: this.isToday(year, month, day)
                    };

                    day++;
                }
            }
        }

        return data;
    }
}

Calendar.DAYS_IN_WEEK = 7;

Calendar.MONTHS = {
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

Calendar.MONTH_NAMES = [
    'Январь',
    'Феварль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];

Calendar.DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];