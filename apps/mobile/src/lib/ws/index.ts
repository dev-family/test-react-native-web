import {Manager} from 'socket.io-client';

export class WebSocket {
  private manager: Manager;

  constructor(private url: string) {
    this.url = url;
    this.manager = new Manager(url, {autoConnect: false});
  }

  socket(path: string) {
    return this.manager.socket(path);
  }
}
