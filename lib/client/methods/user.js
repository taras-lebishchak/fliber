export default class User {
  constructor(prefetch) {
    this.prefetch = prefetch;
  }
  get(id) {
    return this.prefetch('/profile?id=' + id, { method: 'get' });
  }

}