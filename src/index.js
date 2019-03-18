import './styles/bulma.min.css';
import './styles/calendar.css';
import './styles/styles.css';

import Calendar from './calendar';
import CalendarView from './calendar-view';

const calendar = new Calendar();
const view = new CalendarView(calendar, document.querySelector('#root'));