const redis = require('socket.io-redis');
const Emitter = require('socket.io-emitter');
const redisConfig = require('../config/redis');

class SocketModule {
  constructor (io) {
    this.io = io;
    this.io.adapter(redis(redisConfig));
    this.emitter = new Emitter(redisConfig);

    this.io.on('connection', this._onConnection.bind(this));
  }

  emit (eventName, dataToSend, receiver) {
    if (!receiver) {
      this.emitter.emit(eventName, dataToSend);
    } else {
      this.emitter.to(receiver).emit(eventName, dataToSend);
    }
  }

  _onConnection (socket) {
    console.log(`${socket.id} just connected.`);
    this.socket = socket;

    this.socket.on('message', message => {
      console.log('Got a message', message);
    });

    this.socket.on('disconnect', () => {
      this._onDisconnect();
    });

    this.emit('message', `Welcome ${this.socket.id} from ${process.pid}`);
  }

  _onDisconnect () {
    console.log(`${this.socket.id} disconnected.`);
  }
}

module.exports = SocketModule;
