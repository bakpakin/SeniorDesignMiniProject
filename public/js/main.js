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

// Used for automated tests to log in
function hiddenLogin() {
  const e = 'example@example.com';
  const p = 'password1234';
  firebase.auth().signInWithEmailAndPassword(e, p)
    .catch(_ => firebase.auth().createUserWithEmailAndPassword(e, p))
    .then(_ => {
      window.location.href = '/';
    });
}

// Generate some random data
function genRandomData() {
  return {
    sensorData: [
      {
        sensorId: '12345abcdef',
        name: 'Living Room',
        temperature: Math.floor(Math.random() * 80),
        humidity: Number(Math.random().toPrecision(1))
      },
      {
        sensorId: '9d123baplq',
        name: 'Kitchen',
        temperature: Math.floor(Math.random() * 80),
        humidity: Number(Math.random().toPrecision(1))
      },
      {
        sensorId: 'jabdl16391',
        name: 'Bedroom',
        temperature: Math.floor(Math.random() * 80),
        humidity: Number(Math.random().toPrecision(1))
      }
    ]
  };
}

/* Generate initial data (fake sensors for new users) */
function getInitialData(myData) {
  return myData.get()
    .then(result => {
      console.log(result);
      if (result.exists) {
        return result.data();
      } else {
        const initialData = genRandomData();
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

      // Simulate random data
      setInterval(() => {
        myData.set(genRandomData());
      }, 4000);

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

  document.getElementById("insert1").innerHTML =  "Room: " + data.sensorData[1].name;
  document.getElementById("insert2").innerHTML =  "Humidity: " + data.sensorData[1].humidity;
  document.getElementById("insert3").innerHTML =  "Temperature: " + data.sensorData[1].temperature;

  document.getElementById("insert4").innerHTML =  "Room: " + data.sensorData[0].name;
  document.getElementById("insert5").innerHTML =  "Humidity: " + data.sensorData[0].humidity;
  document.getElementById("insert6").innerHTML =  "Temperature: " + data.sensorData[0].temperature;

  document.getElementById("insert7").innerHTML =  "Room: " + data.sensorData[2].name;
  document.getElementById("insert8").innerHTML =  "Humidity: " + data.sensorData[2].humidity;
  document.getElementById("insert9").innerHTML =  "Temperature: " + data.sensorData[2].temperature;
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
