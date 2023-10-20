export default class App {
  constructor(container) {
    this.container = container;
  }

  drawWidget() {
    return `
      <form class="widget__form form">
        <h2 class="form__header">Поиск билетов</h2>

        <div class="form__container">
          <div class="form__block">
            <label class="form__datepicker datepicker depature">
              <input readonly="" name="depature-date" class="form__input depature__input" placeholder="Туда">
              <button type="button" class="depature__btn-calendar">
                <img src="./images/calendar.jpg" alt="">
              </button>
            </label>
          </div>
          <div class="form__block">
            <div class="form__datepicker return">
              <button type="button" class="return__btn-add">
                <span class="return__btn-icon">
                  <img src="./images/add.svg" alt="">
                </span>
                <span class="return__btn-text">Обратно</span>
              </button>
            </div>
          </div>
          <button class="form__btn btn-submit">Найти билеты</button>
        </div>
      </form>
    `;
  }

  bindToDOM() {
    this.container.innerHTML = this.drawWidget();

    this.form = this.container.querySelector('.form');
    this.returnBlock = this.form.querySelector('.return');
  }

  // Создаем HTML-элемент popover
  static drawCalendar() {
    const calendar = document.createElement('div');
    calendar.classList.add('calendar');

    calendar.innerHTML = `
      <div class="calendar__container">
        <div class="calendar__header">
          <div class="calendar__arrow calendar__arrow-left">
            <img src="./images/left-arrow.svg" alt="left arrow" class="calendar__arrow-icon">
          </div>
          <div class="calendar__title"></div>
          <div class="calendar__arrow calendar__arrow-right">
            <img src="./images/right-arrow.svg" alt="right arrow" class="calendar__arrow-icon">
          </div>
        </div>
        <div class="calendar__weekdays">
          <div class="calendar__day">ПН</div>
          <div class="calendar__day">ВТ</div>
          <div class="calendar__day">СР</div>
          <div class="calendar__day">ЧТ</div>
          <div class="calendar__day">ПТ</div>
          <div class="calendar__day">СБ</div>
          <div class="calendar__day">ВС</div>
        </div>
        <div class="calendar__dates"></div>
      </div>
    `;

    return calendar;
  }

  drawReturnInput() {
    const returnContainer = document.createElement('div');
    returnContainer.classList.add('return__container', 'datepicker');
    returnContainer.innerHTML = `
      <input readonly name="return-date" class="form__input return__input" placeholder="Обратно">
      <button type="button" class="return__btn-delete">
        <img src="./images/remove-icon.svg" alt="">
      </button>
    `;

    this.returnBlock.append(returnContainer);

    return returnContainer;
  }
}
