import TicketWidget from '../TicketWidget';
import App from '../App';
import FormState from '../FormState';

const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
});

// Глобальные переменные, которые вы хотите использовать в тестах
global.window = dom.window;
global.document = window.document;
global.localStorage = {
  setItem: jest.fn(),
};

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

test('widget should render', () => {
  const expected = app.drawWidget();

  expect(container.innerHTML).toEqual(expected);
});

const state = new FormState(localStorage);
const ticketWidget = new TicketWidget(app, state);

test('Calendar should be shown after focusing on input', () => {
  ticketWidget.depatureDateInput.focus();

  const result = ticketWidget.calendar.calendar;
  const expected = container.querySelector('.calendar');

  expect(result).toEqual(expected);
});

test('Return input should be shown after clicking on button "add returnDate"', () => {
  ticketWidget.btnAddReturn.click();

  const result = ticketWidget.returnDateInput;
  const expected = container.querySelector('.return__input');

  expect(result).toEqual(expected);
});

test('Return input should be deleted after clicking on button "delete returnDate"', () => {
  ticketWidget.btnAddReturn.click();

  const deleteBtn = ticketWidget.btnRemoveReturn;
  deleteBtn.click();
  const result = container.returnDateInput;

  expect(result).toBeUndefined();
});

test('saveFormData should be called on beforeunload event', () => {
  const testData = { depatureDate: '25.10.23, ср' };

  state.save(testData);

  expect(localStorage.setItem).toHaveBeenCalledWith('formData', JSON.stringify(testData));
});
