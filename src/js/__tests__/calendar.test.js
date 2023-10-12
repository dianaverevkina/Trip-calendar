import moment from 'moment';
import Calendar from '../Calendar';
import TicketWidget from '../TicketWidget';
import App from '../App';
import FormState from '../FormState';

const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Глобальные переменные, которые вы хотите использовать в тестах
global.window = dom;
global.document = dom.window.document;

document.body.innerHTML = `
  <div class="wrapper">
    <div class="widget">
      <div class="widget__container"></div>
    </div>
  </div>
`;

const container = document.querySelector('.widget__container');
const app = new App(container);
app.bindToDOM();

const state = new FormState();
const ticketWidget = new TicketWidget(app, state);

const calendar = new Calendar();
const depatureInput = container.querySelector('.depature__input');
calendar.currentInput = depatureInput;
calendar.createCalendar();
calendar.buildCalendar();

test('Calendar should be opened selected and current date should have class "cell_current"', () => {
  const inputContainer = depatureInput.closest('.form__block');
  inputContainer.append(calendar.calendar);
  const cellWithCurrentDate = calendar.calendar.querySelector(`[data-fulldate="${moment().format('YYYY-MM-DD')}"]`);

  expect(calendar.calendar).toBeTruthy();
  expect(cellWithCurrentDate.classList.contains('cell_current')).toBeTruthy();
});

test(`Calendar cell before current date should not be selected and depature input value 
  should not be filled out after clicking on date`, () => {
  const inputContainer = depatureInput.closest('.form__block');
  inputContainer.append(calendar.calendar);

  const newDate = moment().subtract(3, 'days');
  const selectedCell = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  selectedCell.click();

  const result = depatureInput.value;
  const selectedCellAfterClick = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  const haveClass = selectedCellAfterClick.classList.contains('cell_selected-depature');

  expect(result).toEqual('');
  expect(haveClass).toBeFalsy();
});

test('Calendar cell should be selected and depature input value should be filled out after clicking on date', () => {
  const inputContainer = depatureInput.closest('.form__block');
  inputContainer.append(calendar.calendar);
  const newDate = moment().add(2, 'days');
  const selectedCell = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  selectedCell.click();

  const result = depatureInput.value;
  const selectedCellAfterClick = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  const haveClass = selectedCellAfterClick.classList.contains('cell_selected-depature');
  expect(result).toEqual(newDate.format('DD.MM.YY, dd'));
  expect(haveClass).toBeTruthy();
});

ticketWidget.addReturnDate(ticketWidget.btnAddReturn);
const returnInput = container.querySelector('.return__input');

test('Calendar cell should be selected and depature input value should be filled out after clicking on date', () => {
  const inputContainer = returnInput.closest('.form__block');
  inputContainer.append(calendar.calendar);
  calendar.currentInput = returnInput;
  const newDate = moment(calendar.depatureDate).add(7, 'days');
  const selectedCell = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  selectedCell.click();

  const result = returnInput.value;
  const selectedCellAfterClick = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  const haveClass = selectedCellAfterClick.classList.contains('cell_selected-return');

  expect(result).toEqual(newDate.format('DD.MM.YY, dd'));
  expect(haveClass).toBeTruthy();
});

test(`Middle cell should have class "cell_middle" and cells before depature date - "cell_forbidden"
  when we have depature date and return date`, () => {
  const dateBetweenDepatureAndReturn = moment(calendar.depatureDate).add(2, 'days');
  const dataAtrMiddleDate = `[data-fulldate="${dateBetweenDepatureAndReturn.format('YYYY-MM-DD')}"]`;

  const dateBeforeDepature = moment(calendar.depatureDate).subtract(1, 'days');
  const dataAtrDateBeforeDep = `[data-fulldate="${dateBeforeDepature.format('YYYY-MM-DD')}"]`;

  const middleCell = calendar.calendar.querySelector(dataAtrMiddleDate);
  const cellBeforeDepatureDate = calendar.calendar.querySelector(dataAtrDateBeforeDep);

  expect(middleCell.classList.contains('cell_middle')).toBeTruthy();
  expect(cellBeforeDepatureDate.classList.contains('cell_forbidden')).toBeTruthy();
});

test('When we have depature and return date and choose date depature date after return date return date is deleted', () => {
  const inputContainer = depatureInput.closest('.form__block');
  inputContainer.append(calendar.calendar);

  calendar.currentInput = depatureInput;
  const newDate = moment(calendar.returnDate).add(3, 'days');
  const selectedCell = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);
  selectedCell.click();

  const selectedCellAfterClick = calendar.calendar.querySelector(`[data-fulldate="${newDate.format('YYYY-MM-DD')}"]`);

  expect(calendar.returnDate).toBeNull();
  expect(selectedCellAfterClick.classList.contains('cell_selected-depature')).toBeTruthy();
});

test('Next month should be opened after clicking right arrow', () => {
  const inputContainer = depatureInput.closest('.form__block');
  inputContainer.append(calendar.calendar);

  calendar.arrowRight.click();
  const newMonthAndYear = calendar.calendarHeader.textContent;

  expect(newMonthAndYear).toEqual(moment().add(1, 'month').format('MMMM YYYY'));
});

test('Previous month should be opened after clicking left arrow', () => {
  const timetable = new Calendar();
  const input = container.querySelector('.depature__input');

  timetable.currentInput = input;
  timetable.createCalendar();
  timetable.buildCalendar();

  const inputContainer = input.closest('.form__block');
  inputContainer.append(timetable.calendar);

  timetable.arrowLeft.click();

  const newMonthAndYear = timetable.calendarHeader.textContent;

  expect(newMonthAndYear).toEqual(moment().subtract(1, 'month').format('MMMM YYYY'));
});
