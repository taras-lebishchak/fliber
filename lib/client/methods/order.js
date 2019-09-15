export default class Order {
  constructor(prefetch) {
    this.prefetch = prefetch;
  }

  findActive() {
    return this.prefetch('/order/active', { method: 'get' });
  }

  find(params) {
    return this.prefetch('/order', { method: 'get' });
  }

  get(id) {
    return this.prefetch('/order?id=' + id, { method: 'get' });
  }

  create(body) {
    return this.prefetch('/order', { method: 'post', body: JSON.stringify(body) });
  }

  acept(body) {
    return this.prefetch('/order', { method: 'put', body: JSON.stringify(body) });
  }

  done(body) {
    return this.prefetch('/order/done', { method: 'put', body: JSON.stringify(body) });
  }
  cancel(body) {
    return this.prefetch('/order/cancel', { method: 'put', body: JSON.stringify(body) });
  }



}