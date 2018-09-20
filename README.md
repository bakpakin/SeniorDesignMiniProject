# SeniorDesignMiniProject
A Web Application for monitoring sensors. Hosted at
[https://seniordesignminiproject.firebaseapp.com/](https://seniordesignminiproject.firebaseapp.com/).

## Design Description

This project is made using [Firebase](https://firebase.google.com), a cloud application platform
from google. The application is HTML5 web application, and is hosted from firebase's hosting functionality.
The database is Firestore, Firebase's noSQL database.

### Authentication

Users can authenticate with a Google account to use the application. Authentication
is done with Firebase's authentication code in the Firebase web sdk.

### Database

The Database is document based noSQL database. Every user has their own document
in the database that contains a list of all sensors and their current readings.

Example document in JSON format:
```json
{
  sensorData: [
    {
      sensorId: '12345abcdef',
      name: 'Living Room',
      temperature: 76,
      humidity: 0.23423
    },
    {
      sensorId: '9d123baplq',
      name: 'Kitchen',
      temperature: 68,
      humidity: 0.34245
    },
    {
      sensorId: 'jabdl16391',
      name: 'Bedroom',
      temperature: 71,
      humidity: 0.20381
    }
  ]
}
```

### (Mock) Sensors

The Mock sensor code is embedded in the HTML5 webclient. There is a function
the generates random sensor data on an interval and updates the database. The client
also listens for any changes to the user's document in the database and re-renders the
sensor list on any change.
One result of this simple mockup is that opening two tabs of the application with the same
account will cause the
sensors to update twice as often, proving they are both connected to the database.

### Client

The HTML5 client is a static web page served from firebase. No frameworks or external libraries
are used in the interest of keeping things easy besides firebase.

## Development

Use `npm` to install dependencies for development.

```sh
npm i
```

Run `npm run serve` to test locally.

## Deployment

Use `npm run deploy` to deploy changes.

## Testing

Use `npm test` to run nightwatch tests. Requires chrome to
run unit tests.
