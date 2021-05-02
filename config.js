import * as firebase from 'firebase'
require('@firebase/firestore')
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCkpCu09Ukb9oQHyUM6cdyiVzqBFtKD6hY",
    authDomain: "wily-82518.firebaseapp.com",
    databaseURL : "https://wily-82518.firebaseio.com",
    projectId: "wily-82518",
    storageBucket: "wily-82518.appspot.com",
    messagingSenderId: "824614125734",
    appId: "1:824614125734:web:88c40bf91c169dd6aeb467"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  export default firebase.firestore()