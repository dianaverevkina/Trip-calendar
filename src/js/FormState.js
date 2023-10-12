export default class FormState {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('formData', JSON.stringify(state));
  }

  load() {
    try {
      return JSON.parse(this.storage.getItem('formData'));
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
