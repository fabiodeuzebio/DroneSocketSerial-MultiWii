# Angular DroneSocketSerial

Interface para comunicar com o Drone utilizando AngularJS no Front-End, SerialPort + Socket.io + Express + Node no BackEnd.
Este projeto é uma interface de comunicação com um Drone do tipo Quadricóptero que utiliza o prtocolo MSP MultiWii.

## Como Utilizar

Clonar o repositório DroneSocketSerial-MultiWii e esta pronto para Rodar.

### Rodando o Aplicativo 

Roda como um simples app Express.

```shell
node app.js
```

### Atualizando o `angular.js`

Periodicamente, você pode atualizar AngularJS com [Bower](http://bower.io): :

```shell
bower update angular
```

## Estrutura da aplicação
    
    app.js                   --> app config
    bower.json               --> for bower
    package.json             --> for npm
    public/                  --> os arquivos que serão utilizados no Client
      css/                   --> css files
        app.css              --> stylesheet
      js/                    --> javascript files
        app.js               --> declare top-level app module
        controllers.js       --> application controllers
        directives.js        --> angular directives
        filters.js           --> angular filters
        protocoloservices.js --> angular filters
        services.js          --> angular services
      bower_components/
        angular/             --> angular.js
        angular-socket-io/   --> socket.io adapter for angular
    routes/
      sockets.js             --> route sockets
      msp.js                 --> protocolo MultiWii
      serial.js              --> route serial 
      gps.js                 --> route gps
    views/
      index.ejs              --> main page for app
      
      
## Contato
Para mais informações sobre AngularJS confira http://angularjs.org/ 
Para mais informações sobre Express, http://expressjs.com/ são seus amigos.
