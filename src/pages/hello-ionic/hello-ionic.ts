import { Component } from '@angular/core';


declare var $:any;
declare var ReconnectingWebSocket:any;

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor() {
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    //var ws_path = ws_scheme + '://' + window.location.host + '/';
    var ws_path = ws_scheme + '://192.168.1.38:8000/';
    console.log("Connecting to " + ws_path)
    var socket = new ReconnectingWebSocket(ws_path);
    socket.debug = true;
    socket.reconnectInterval = 100;
    socket.maxReconnectInterval = 3000;

    socket.onmessage = function(message) {
        console.log("Got message: " + message.data);
        var data = JSON.parse(message.data);
        // if action is started, add new item to table
        if (data.action == "initial") {
            var task_status = $("#task_status");
            $('#pregunta1')
            .css('background-color', '');
            $('#pregunta2')
            .css('background-color', '');
            $('#pregunta3')
            .css('background-color', '');
            $('#pregunta' + data.pregunta)
            .css('background-color', '')
            .css('background-color', 'blue');
            $("#pregunta").val(data.pregunta);
        }
        // if action is completed, just update the status
        else if (data.action == "completed"){
            $('#pregunta1')
            .css('background-color', '');
            $('#pregunta2')
            .css('background-color', '');
            $('#pregunta3')
            .css('background-color', '');
            $('#pregunta' + data.pregunta)
            .css('background-color', '')
            .css('background-color', 'blue');
            $("#pregunta").val(data.pregunta);
        }
    };
    $("#taskform").on("submit", function(event) {
        var message = {
            pregunta: $('#pregunta').val() ,
            votos: $('#task_name').val()
        };
        socket.send(JSON.stringify(message));
        return false;
    });


  }
}
