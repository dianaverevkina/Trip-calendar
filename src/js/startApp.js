import TicketWidget from './TicketWidget';
import App from './App';
import FormState from './FormState';

const container = document.querySelector('.widget__container');
const app = new App(container);

app.bindToDOM();

const formState = new FormState(localStorage);

const ticketWidget = new TicketWidget(app, formState);
console.log(ticketWidget);
