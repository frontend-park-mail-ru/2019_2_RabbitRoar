# 2019_2_RabbitRoar [![Build Status](https://travis-ci.org/frontend-park-mail-ru/2019_2_RabbitRoar.svg?branch=dev)](https://travis-ci.org/frontend-park-mail-ru/2019_2_RabbitRoar)
Frontend-repository for project Swoyak [Project link](https://svoyak.fun/)

# About

Project dashboard on [notion](https://www.notion.so/f53af7312b784f2bafa785c65e8d81a9).


# Rules

“Swoyak” is an online quiz game. 

It is an analogue of the American television game Jeopardy!.

Play cool and level up.

Play with your friends and create custom themed rooms.

# How to start project?

## Development:

* ```cd frontend```
* ```npm install```
* ```npm run dev-server```

dev-server: watch files with live-reload browser

## Prod: 

You can ```npm run start``` this command installs dependecies, builds dist, runs server.

Or run via Dockerfile included (```run_container.sh``` can be used).

# Code structure

```
└── frontend
    ├── Dockerfile // docker for prod server
    ├── frontend
    │   ├── dist  // compiled files
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── src // source files
    │   ├── webpack.config.js
    │   └── webserver.js  // http server source
    ├── README.md
    └── run_container.sh  // build&run container
```

# TODO:
 * compilation of html files
