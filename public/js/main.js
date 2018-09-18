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

function randomNum(){
  var temperaturerandom=Math.floor(Math.random()*80);
  var humidityrandom=Math.random();
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
              temperature: temperaturerandom // farenheight
            },
            {
              sensorId: '9d123baplq',
              name: 'Kitchen',
              type: 'temperature',
              temperature: temperaturerandom // farenheight
            }
          ],
          humiditySensors: [
            {
              sensorId: 'jabdl16391',
              name: 'Bedroom',
              type: 'humidity',
              humidity: humidityrandom // fraction from 0 to 1
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
    var li = createElement('li', myData.tempSensors.name + ':' + myData.tempSensors.temperature);
    li.parent(dispinfo);
    var li2 = createElement('li2', myData.humiditySensors.name + ':' + myData.humiditySensors.humidity);
    li.parent(dispinfo)
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
