A Mini Universiy Assessment
===========================

## Introduction
This application is used for backend for a mini University system
## Dependencies
 - Nodejs >=16.x.x or above
 - Mongodb >=4.x.x or above

## How to install Node and Mongodb
This application requires node and mongo to be installed on your system. Please check [upstream documentation](https://nodejs.org/en/download/) & [docs.mongodb.com](https://docs.mongodb.com/manual/administration/install-community)
for how to install node & mongo on your system.

## Install PM2
```bash
  npm install pm2 -g
  ````

## Development build
In application root path run following commands
```bash
cd ROOT-DIR
npm install
````
## Start mongo db
After installing mongo you should start mongo
 - Linux: sudo service mongod start
 - Window: 
    - Create a folder in any drive i.e. D:\\data
    - Open command prompt
    - Go C:\Program Files\MongoDB\Server\4.0\bin
    - mongod.exe --dbpath="D:\data" and then enter. You may see running status

## Start Application
```bash
cd ROOT-DIR
pm2 start ecosystem.config.js --env development
````

## Restart Application
```bash
cd ROOT-DIR
pm2 restart ecosystem.config.js --env development
````

## Environment variables
Environment variables is the main mechanism of manipulating application settings. Currently application recognizes
following environment variables: ecosystem.config.js

| Variable           | Default value                     | Description             |
| ------------------ | ----------------------------------| ----------------------- |
| HOST               | localhost                         | Address to listen on    |
| PORT               | 3500                              | Port to listen on       |
| DB_CONNECTION      | mongodb://localhost:27017/udb     |                         |
| -------------------| ----------------------------------| ------------------------|

http://localhost:3500/graphql

<h1>Setup required data</h1>

We have created fixture mutation that will install required data into database as shown below:

```
mutation{
  fixture{
    error{
      key
      value
    }
    message
    severity
  }
}
```

### Show Academic Users including DEANS, STUDENTS
```
query{
  academicList{
    message
    response{
      uid
      name
      type
    }
  }
}
```

### Reponse

```
{
  "data": {
    "academicList": {
      "message": "Academic list",
      "response": [
        {
          "uid": 41790,
          "name": "Hubert Jakubowski",
          "type": "STUDENT"
        },
        {
          "uid": 68983,
          "name": "Marion Nitzsche",
          "type": "STUDENT"
        },
        {
          "uid": 21907,
          "name": "Annie Will",
          "type": "DEAN"
        }
      ]
    }
  }
}
```

#### Note: I have set default password for all users `Welcome1!`. So, User can logged In using his/she uid and password(`Welcome1!`)

### Login
```
query {
  login(input: { uid: 41790, password: "Welcome1!" }) {
    error {
      key
      value
    }
    severity
    message
    token
  }
}
```

### Response
```
{
  "data": {
    "login": {
      "error": null,
      "severity": "success",
      "message": "Logged In successfully.",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQxNzkwLCJ0eXBlIjoiU1RVREVOVCIsImlhdCI6MTY5MjA3OTUzM30.8uZjWobYstMvPsGlt0vIXTZS6p0AxmndCm_B8cve9jE"
    }
  }
}
```

Now Student can see the Dean availability as shown below `Query`

### Dean Availability

```
query{
  availableSession(input:{
    deanUID:21907
  }){
    message
    availablity{
      date
      slots{
        _id
        from
        to
      }
    }
  }
}
```

### Bearer
```
{
  "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQxNzkwLCJ0eXBlIjoiU1RVREVOVCIsImlhdCI6MTY5MjA3OTUzM30.8uZjWobYstMvPsGlt0vIXTZS6p0AxmndCm_B8cve9jE"
}
```

#### Note: It will display dean availability.

### Book a slot with Dean
```
mutation{
  bookSession(input:{
    deanUID:21907,
    slotId:"64db10351f7696099ef5623c"
  }){
    message
    severity
  }
}
```

### Dean can see his/her meetings as shown Query

```
query{
  meetings{
    message
    availablity{
      date
      slots{
        _id
        from
        to
        fkAcademicUID
        fkStudentName
      }
    }
  }
}
```

### Bearer

```
{
  "authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIxOTA3LCJ0eXBlIjoiREVBTiIsImlhdCI6MTY5MjA4MDE3M30.rMxN9dhXfIfW5Hu3rJi9aDA_FNFm6EkZZ7wjvWt_KhE"
}
```

### Response

```
{
  "data": {
    "meetings": {
      "message": "Slots are available",
      "availablity": [
        {
          "date": "Thursday, 2023-08-17",
          "slots": [
            {
              "_id": "64db10351f7696099ef5623c",
              "from": "11:00",
              "to": "12:00",
              "fkAcademicUID": 41790,
              "fkStudentName": "Hubert Jakubowski"
            }
          ]
        }
      ]
    }
  }
}
```

#### Dean can put schedules meeting in backlog/new date

### Reschedule meeting

```
mutation{
  updateBookedSession(input:{
    studentUID:41790,
    currentSlotId:"64db10351f7696099ef5623c",
    targetSlotId:"64db10351f7696099ef5623e"
  }){
    error{
      key
      value
    }
    message
    severity
  }
}

```




