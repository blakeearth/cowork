import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  socketService: SocketService;

  constructor(socketService: SocketService) {
    this.socketService = socketService;
  }

  ngOnInit(): void {
    this.socketService.reply.subscribe(msg => this.onResponseReceived(msg));
    if (this.socketService.token != null) {
      this.socketService.sendMessage({channel: "auth", type: "validate_session", token: this.socketService.token});
    }
    else {
      document.location.href = "/auth/sign-in";
    }
  }

  onResponseReceived(msg: any): void {
    if (msg["password_correct"] != null) {
      if (msg["password_correct"] == false) {
        document.location.href = "/auth/sign-in";
      }
    }
  }

}