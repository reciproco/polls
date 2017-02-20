import { Component, ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';


declare var $:any;
declare var ReconnectingWebSocket:any;

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  private socket;
  @ViewChild(Content) content: Content;
  p1: number;
  p2: number;
  p3: number;
  p4: number;
  p5: number;
  selected: number;

  constructor() {
      this.p1 = 0;
      this.p2 = 0;
      this.p3 = 0;
      this.p4 = 0;
      this.p5 = 0;
      this.selected  = 0;

  }
  ionViewWillEnter() { 
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    //var ws_path = ws_scheme + '://' + window.location.host + '/';
    var ws_path = ws_scheme + '://192.168.1.81:8000/';
    console.log("Connecting to " + ws_path)
    this.socket = new ReconnectingWebSocket(ws_path);
    this.socket.debug = true;
    this.socket.reconnectInterval = 1000;
    this.socket.maxReconnectInterval = 3000;

    this.socket.onmessage = (message) => {
        console.log("Got message: " + message.data);
        var data = JSON.parse(message.data);
        // if action is started, add new item to table
        if (data.action == "estadisticas") {
            if(data.pregunta == 1) {
                this.p1 = data.votos;
            }
            if(data.pregunta == 2) {
                this.p2 = data.votos;
            }
            if(data.pregunta == 3) {
                this.p3 = data.votos;
            }
            if(data.pregunta == 4) {
                this.p3 = data.votos;
            }
            if(data.pregunta == 5) {
                this.p3 = data.votos;
            }
        }

        if (data.action == "initial") {
            this.selected = data.pregunta;
            $('.card')
            .hide();
            $('#card' + data.pregunta)
            .slideDown();

        }
        // if action is completed, just update the status
        else if (data.action == "completed"){
            this.selected = data.pregunta;
            $('.card')
            .hide();
            $('#card' + data.pregunta)
            .slideDown();
        }
    };
  }

  vote(arg) {
        if(arg == this.selected)
        {
            console.log("votando")
            var message = {
                pregunta: arg ,
                votos: 1
            };
            this.socket.send(JSON.stringify(message));
            return false;
        }
  }
}
