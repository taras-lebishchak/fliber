export default class Profile {
  constructor(prefetch, headers) {
    this.prefetch = prefetch;
    this.headers = headers;
  }
  get(body) {
    return this.prefetch('/profile', { method: 'get', body: JSON.stringify(body) }).then(profile => Object.assign(profile, { role: this.headers['role'] }));
  }

  update(body) {
    return this.prefetch('/profile', { method: 'put', body: JSON.stringify(body) }).then(profile => Object.assign(profile, { role: this.headers['role'] }));
  }

}