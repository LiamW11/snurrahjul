// ============================================================================
// FIREBASE KONFIGURATION
// ============================================================================
// INSTRUKTION: Ersätt värdena nedan med din faktiska Firebase-config
// Hämta från: Firebase Console > Project Settings > Your apps > Web app

  const firebaseConfig = {
    apiKey: "AIzaSyBeQl1AroaqERPM8qp7eZL0FN2pn2YeWBI",
    authDomain: "authspin-e433d.firebaseapp.com",
    projectId: "authspin-e433d",
    storageBucket: "authspin-e433d.firebasestorage.app",
    messagingSenderId: "762692694041",
    appId: "1:762692694041:web:450ee8622a061f20fafa88",
    measurementId: "G-4X3GRKDG1J"
  };

// Initiera Firebase
firebase.initializeApp(firebaseConfig);

// Exportera Firebase-tjänster som vi behöver
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();