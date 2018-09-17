// Show sign in wdiget for firebase.
function pageLogin() {
  var uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  ui.start('#firebaseui-auth-container', uiConfig);
}

/* Generate initial data (fake sensors for new users) */
function getInitialData(myData) {
  return myData.get()
    .then(result => {
      console.log(result);
      if (result.exists) {
        return result.data();
      } else {
        const initialData = {
          tempSensors: [
            {
              sensorId: '12345abcdef',
              name: 'Living Room',
              type: 'temperature',
              temperature: 66 // farenheight
            },
            {
              sensorId: '9d123baplq',
              name: 'Kitchen',
              type: 'temperature',
              temperature: 74 // farenheight
            }
          ],
          humiditySensors: [
            {
              sensorId: 'jabdl16391',
              name: 'Bedroom',
              type: 'humidity',
              humidity: 0.73 // fraction from 0 to 1
            }
          ],
        };
        return myData.set(initialData)
          .then(() => {
            return myData.get()
          })
          .then(result => {
            return result.data();
          });
      }
    });
}

// Show root functionality
function pageApp() {
  try {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        window.location.pathname = '/login';
      } else {
        document.getElementById('app-container').style.display = 'block';
      }

      // connect to database
      var db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      const myData = db.collection('users').doc(user.uid);

      // Get data.
      const datap = getInitialData(myData);
      datap.then(() => {
        // We have set up initial data
        myData.onSnapshot(doc => {
          const data = doc.data();
          if (data) {
            onNewData(data);
          }
        });
      });
    });
  } catch (e) {
    console.error(e);
  }
}

// Called when we get new sensor data. Update the display in this function.
function onNewData(data) {
  console.log('got data: ' + JSON.stringify(data));
}

// When the page finishes loading, show different content based on the path
document.addEventListener('DOMContentLoaded', function() {
  switch (window.location.pathname) {
    case '/':
      pageApp();
      break;
    case '/login':
      pageLogin();
      break;
    default:
      break;
  }
});
