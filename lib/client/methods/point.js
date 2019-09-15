export default class Point {
  constructor(prefetch) {
    this.prefetch = prefetch;
  }

  find() {
    return this.prefetch('/point', { method: 'get' });
  }

  get(id) {
    return this.prefetch('/point?id=' + id, { method: 'get' });
  }

  create(body) {
    return this.prefetch('/point', { method: 'post', body: JSON.stringify(body) });
  }

}