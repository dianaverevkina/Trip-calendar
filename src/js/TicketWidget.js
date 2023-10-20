import Calendar from './Calendar';

export default class TicketWidget {
  constructor(app, state) {
    this.app = app;
    this.state = state;
    this.form = app.form;
    this.depatureDateInput = this.form.querySelector('.depature__input');
    this.btnAddReturn = this.form.querySelector('.return__btn-add');

    this.showCalendar = this.showCalendar.bind(this);
    this.removeReturn = this.removeReturn.bind(this);

    this.calendar = new Calendar();

    this.addEvents();
  }

  addEvents() {
    this.depatureDateInput.addEventListener('focus', this.showCalendar);
    this.btnAddReturn.addEventListener('click', (e) => {
      e.preventDefault();
      const { currentTarget } = e;
      this.addReturnDate(currentTarget);
    });

    window.addEventListener('beforeunload', () => this.saveFormData());
    document.addEventListener('DOMContentLoaded', () => this.loadFormData());
    document.addEventListener('click', (e) => this.closeCalendar(e));
  }

  // Если клик по инпуту с выбором дат или календарю, выход. Иначе закрываем календарь
  closeCalendar(e) {
    if (!this.calendar.calendar) return;
    if (e.target.closest('.calendar') || e.target.closest('.datepicker')) return;

    this.calendar.hideCalendar();
  }

  showCalendar(e) {
    const { target } = e;
    const inputContainer = target.closest('.form__block');

    if (!this.calendar.calendar) {
      this.calendar.createCalendar();
    }

    this.calendar.currentInput = target;
    this.calendar.buildCalendar();
    inputContainer.append(this.calendar.calendar);
  }

  addReturnDate(el) {
    el.classList.add('return__btn-add_hidden');
    this.returnContainer = this.app.drawReturnInput();

    this.returnDateInput = this.form.querySelector('.return__input');
    this.btnRemoveReturn = this.form.querySelector('.return__btn-delete');

    this.returnDateInput.addEventListener('focus', this.showCalendar);
    this.btnRemoveReturn.addEventListener('click', this.removeReturn);
  }

  removeReturn(e) {
    e.preventDefault();
    this.returnContainer.remove();
    this.btnAddReturn.classList.remove('return__btn-add_hidden');
    this.calendar.removeReturnDate();
  }

  saveFormData() {
    const data = {};
    [...this.form.elements].forEach((el) => {
      if (!el.name) return;
      if (!el.value) return;
      data[el.name] = el.value;
    });

    this.state.save(data);
  }

  loadFormData() {
    const formData = this.state.load();

    if (formData) {
      Object.keys(formData).forEach((key) => {
        if (key === 'return-date') {
          this.addReturnDate(this.btnAddReturn);
        }
        const input = this.form.querySelector(`[name="${key}"]`);
        input.value = formData[key];

        this.calendar.loadSavedDates(input);
      });
    }
  }
}
