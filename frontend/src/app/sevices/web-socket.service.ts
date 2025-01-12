import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private client: Client;
  public notifications: Subject<{ id: string, message: string, downloadLink: string }> = new Subject<{ id: string, message: string, downloadLink: string }>();


  constructor() {
    this.client = new Client();
    this.client.webSocketFactory = () => new SockJS('http://localhost:8086/ws');
    this.client.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      this.client.subscribe('/topic/notifications', message => {
        console.log('Received notification:', message.body);
        try {
          const notification = JSON.parse(message.body);
          if (notification.id && notification.message) {
            this.notifications.next(notification);
          } else {
            console.error('Invalid notification format:', notification);
          }
        } catch (error) {
          console.error('Failed to parse notification:', error);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.client.activate();
  }
}
