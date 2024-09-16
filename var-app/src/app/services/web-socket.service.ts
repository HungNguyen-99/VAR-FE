import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  private messagesSubject: Subject<any> = new Subject();
  public messages: Observable<any> = this.messagesSubject.asObservable();
  constructor() {
    this.socket$ = webSocket('ws://localhost:3000'); // Your WebSocket server URL
    this.socket$.subscribe(
      (message) => {
        try {
          // Attempt to parse the message as JSON
          const parsedMessage = JSON.parse(message.data);
          this.messagesSubject.next(parsedMessage);
        } catch (e) {
          if (e instanceof SyntaxError) {
            // If it's not JSON, handle the raw message
            this.messagesSubject.next(message.data);
          } else {
            throw e;
          }
        }
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }
  sendMessage(msg: Object): void {
    let msgStr = JSON.stringify(msg)
    this.socket$.next(msgStr);
  }
}
