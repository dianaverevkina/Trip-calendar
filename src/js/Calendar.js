import moment from 'moment';
import 'moment/locale/ru';
import App from './App';

export default class Calendar {
  constructor() {
    this.currentInput = null;
    this.depatureDate = null;
    this.returnDate = null;

    this.now = moment();
    this.currentDate = this.now.format('YYYY-MM-DD');

    this.chooseDate = this.chooseDate.bind(this);
    this.flipCalendarLeft = this.flipCalendarLeft.bind(this);
    this.flipCalendarRight = this.flipCalendarRight.bind(this);

    moment.locale('ru');
  }

  // Создаем календарь
  createCalendar() {
    this.calendar = App.drawCalendar();
    this.calendarHeader = this.calendar.querySelector('.calendar__title');
    this.datesContainer = this.calendar.querySelector('.calendar__dates');
    this.arrowLeft = this.calendar.querySelector('.calendar__arrow-left');
    this.arrowRight = this.calendar.querySelector('.calendar__arrow-right');

    this.getCurrentMonthAndYear();
    this.addEvents();
  }

  // Загружаем сохраненные даты
  loadSavedDates(input) {
    const date = input.value.slice(0, 8).split('.');
    const [day, month, year] = date;
    if (input.name === 'depature-date') {
      this.depatureDate = moment(`20${year}-${month}-${day}`);
      this.now = moment().month(month - 1);
    }
    if (input.name === 'return-date') {
      this.returnDate = moment(`20${year}-${month}-${day}`);
    }
  }

  getCurrentMonthAndYear() {
    this.calendarHeader.textContent = `${this.now.format('MMMM YYYY')}`;
  }

  // Добавляем обработчики событий
  addEvents() {
    this.datesContainer.addEventListener('click', this.chooseDate);
    this.arrowLeft.addEventListener('click', this.flipCalendarLeft);
    this.arrowRight.addEventListener('click', this.flipCalendarRight);
  }

  // Выбираем дату при клике по клетке с датой, заполняем инпут и обновляем календарь
  chooseDate(e) {
    e.preventDefault();
    const { target } = e;

    if (target.classList.contains('calendar__dates')) return;

    const block = target.closest('.form__block');
    const input = block.querySelector('.form__input');
    const day = +target.textContent;
    const fulldate = target.getAttribute('data-fulldate');

    if (moment(fulldate).isBefore(this.currentDate)) return;

    if (input.name === 'depature-date') {
      if (this.returnDate && moment(fulldate).isAfter(this.returnDate)) {
        this.returnDate = null;
        const form = target.closest('.form');
        const returnInput = form.querySelector('.return__input');
        returnInput.value = '';
      }

      this.depatureDate = moment(fulldate);
    }

    if (input.name === 'return-date') {
      if (this.depatureDate && moment(fulldate).isBefore(this.depatureDate)) return;
      this.returnDate = moment(fulldate);
    }

    input.value = this.now.date(day).format('DD.MM.YY, dd');
    this.buildCalendar();
  }

  // При клике по стрелке перелистываем календарь и обновляем дни
  flipCalendarLeft(e) {
    e.preventDefault();

    this.nextMonth = this.now.subtract(1, 'month');
    this.newMonth = +this.nextMonth.format('M');
    this.calendarHeader.textContent = `${this.nextMonth.format('MMMM YYYY')}`;

    this.buildCalendar();
  }

  // При клике по стрелке перелистываем календарь и обновляем дни
  flipCalendarRight(e) {
    e.preventDefault();

    this.nextMonth = this.now.add(1, 'months');
    this.newMonth = +this.nextMonth.format('M');
    this.calendarHeader.textContent = `${this.nextMonth.format('MMMM YYYY')}`;

    this.buildCalendar();
  }

  // Создаем даты календаря
  buildCalendar() {
    this.calendar.classList.remove('calendar_hidden');
    this.datesContainer.innerHTML = '';

    const daysInCurrentMonth = this.now.daysInMonth();
    const nowCopy = this.now;
    const firstWeekdayOfMonth = nowCopy.startOf('month').weekday();

    let dateCount = 1;

    // создаем ячейки для каждого дня в месяце
    for (let i = 0; i < 42; i++) {
      const cell = document.createElement('div');
      cell.classList.add('calendar__cell', 'cell');

      this.datesContainer.append(cell);

      if (i < firstWeekdayOfMonth) continue; //eslint-disable-line

      const date = this.now.date(dateCount);
      cell.setAttribute('data-fullDate', `${date.format('YYYY-MM-DD')}`);

      if (date.isBefore(this.currentDate)) {
        cell.classList.add('cell_forbidden');
      }

      if (this.currentInput.name === 'return-date' && this.depatureDate && date.isBefore(this.depatureDate)) {
        cell.classList.add('cell_forbidden');
      }

      const haveTwoDates = this.depatureDate && this.returnDate;
      if (haveTwoDates && date.isBetween(this.depatureDate, this.returnDate)) {
        cell.classList.add('cell_middle');
      }

      if (date.isSame(this.currentDate)) {
        cell.classList.add('cell_current');
      }

      if (date.isSame(this.depatureDate)) {
        cell.classList.add('cell_selected-depature');
      }

      if (date.isSame(this.returnDate)) {
        cell.classList.add('cell_selected-return');
      }

      cell.textContent = dateCount;

      if (dateCount === daysInCurrentMonth) break;
      dateCount++;
    }
  }

  // Удалить дату обратно и спрятать календарь
  removeReturnDate() {
    this.hideCalendar();
    this.returnDay = null;
    this.days = this.datesContainer.querySelectorAll('.cell__selected-return');
    this.days.forEach((day) => day.classList.remove('cell__selected-return'));
    this.returnDate = null;
  }

  // Скрыть календарь
  hideCalendar() {
    this.calendar.classList.add('calendar_hidden');
  }
}
