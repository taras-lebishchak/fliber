import io from 'socket.io-client'


class SocketClient {
  constructor(url) {
    this.socket = io.connect(url);
  }
  init(user) {
    this.socket.emit('init', user);
  }

  watchPosition(position) {
    this.socket.emit('change_position', position);
  }

  onWatchPosition(handler) {
    this.socket.on('change_position', handler)
  }

  acceptOrder(order_id) {
    this.socket.emit('accept_order', { order_id });
  }
  onAcceptOrder(handler) {
    this.socket.on('accept_order', handler)
  }
}

export default new SocketClient('http://192.168.43.57:1337');