import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServicePayslip {

  private client: Client;
  public notifications: Subject<{ message: string, downloadLink: string }> = new Subject<{ message: string, downloadLink: string }>();

  constructor(private userAuthService: UserAuthService) {
    this.client = new Client();
    this.client.webSocketFactory = () => new SockJS('http://localhost:8086/ws');
    this.client.onConnect = () => {
      console.log('Connected to WebSocket');

      const username = this.userAuthService.getusername(); // Ensure this method returns the logged-in username
      this.client.subscribe(`/topic/user/${username}/notifications`, message => {
        console.log('Received notification:', message.body);
        try {
          const notification = JSON.parse(message.body);
          if (notification.message) {
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
