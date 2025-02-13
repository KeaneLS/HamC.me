import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB85XwkM2QKGX8KUYqqJoJWC5HygBClq9E",
  authDomain: "spyware-64ce0.firebaseapp.com",
  projectId: "spyware-64ce0",
  storageBucket: "spyware-64ce0.appspot.com",
  messagingSenderId: "62433866308",
  appId: "1:62433866308:web:c001a55fb9e61c3c460211",
  measurementId: "G-514N77BEV4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
export default app;