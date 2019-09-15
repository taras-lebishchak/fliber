import Auth from './methods/auth';
import Profile from './methods/profile';
import Order from './methods/order';
import Point from './methods/point';
import User from './methods/user';

class Client {

  constructor({ baseURL }) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'role': 'client'
    };
    this.auth = new Auth(this.prefetch.bind(this), this.headers);
    this.profile = new Profile(this.prefetch.bind(this), this.headers);
    this.order = new Order(this.prefetch.bind(this));
    this.point = new Point(this.prefetch.bind(this));
    this.user = new User(this.prefetch.bind(this));
  }

  prefetch(url, options) {
    return fetch(this.baseURL + url, Object.assign(options, { headers: this.headers })).then(response => response.json());
  }
  ping() {
    return this.prefetch('/', {});
  }
  changeRole(role) {
    this.headers['role'] = role;
  }
}

export default new Client({ baseURL: 'http://192.168.43.57:3000' });