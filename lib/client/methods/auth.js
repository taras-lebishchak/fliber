export default class Auth {
  constructor(prefetch, headers) {
    this.prefetch = prefetch;
    this.headers = headers;
  }


  signout() {
    return new Promise((resolve) => {
      if (this.headers.hasOwnProperty('authorization')) {
        delete this.headers['authorization'];
      }
      resolve(true)
    })
  }

  signinWithToken(token) {
    return new Promise((resolve) => {
      this.headers['authorization'] = token;
      resolve(token)
    })
  }

  signin(body) {
    return this.prefetch('/signin', {
      method: 'post',
      body: JSON.stringify(body),
    }).then(({ token }) => {
      this.headers['authorization'] = token;
      return token;
    })
  }

  signup(body) {
    return this.prefetch('/signup', {
      method: 'post',
      body: JSON.stringify(body),
    }).then(({ token }) => {
      this.headers['authorization'] = token;
      return token;
    })
  }
}