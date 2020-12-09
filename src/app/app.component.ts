import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    let firebaseConfig = {
      apiKey: "AIzaSyDL8_b0CV7BQkn4xzljEkOzJvuXeMIj2oQ",
      authDomain: "jta-instagram-clone-de9ee.firebaseapp.com",
      databaseURL: "https://jta-instagram-clone-de9ee-default-rtdb.firebaseio.com/",
      projectId: "jta-instagram-clone-de9ee",
      storageBucket: "jta-instagram-clone-de9ee.appspot.com",
      messagingSenderId: "875551680230",
      appId: "1:875551680230:web:10bf511171671c417c3d27",
      measurementId: "G-JG27CH75XT"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  }
}
