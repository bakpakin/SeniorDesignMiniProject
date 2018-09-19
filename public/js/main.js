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

  var temperaturerandom= Math.floor(Math.random()*80);
  var humidityrandom= Math.random();


/* Generate initial data (fake sensors for new users) */
function getInitialData(myData) {
  return myData.get()
    .then(result => {
      console.log(result);
      if (result.exists) {
        return result.data();
      } else {
        const initialData = {
          sensorData: [
            {
              sensorId: '12345abcdef',
              name: 'Living Room',
              temperature: temperaturerandom, //fahrenheit
              humidity: humidityrandom
            },
            {
              sensorId: '9d123baplq',
              name: 'Kitchen',
              temperature: temperaturerandom+24,
              humidity: humidityrandom*.12
            },
            {
              sensorId: 'jabdl16391',
              name: 'Bedroom',
              temperature: temperaturerandom+34,
              humidity: humidityrandom*.54
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
  console.log(data.sensorData[1].humidity, data.sensorData[1].name, data.sensorData[1].temperature);
  document.getElementById("insert").innerHTML = "Room: " + data.sensorData[1].name;
  document.getElementById("insert2").innerHTML =  "Humidity: " + data.sensorData[1].humidity;
  document.getElementById("insert3").innerHTML =  "Temperature: " + data.sensorData[1].temperature;
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
