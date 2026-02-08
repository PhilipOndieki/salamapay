import { initializeApp } from 'firebase/app';
import { getAuth} from 'firebase/auth';
import { writeBatch, doc, serverTimestamp, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAXSv_HnvNYA55g8WVlIg6hi5ewqZLwC60",
  authDomain: "salamapay-89893.firebaseapp.com",
  projectId: "salamapay-89893",
  storageBucket: "salamapay-89893.firebasestorage.app",
  messagingSenderId: "750010983095",
  appId: "1:750010983095:web:bacaa789351966ed882332",
  measurementId: "G-NEKTVDCEWN" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics (only in production, not with emulators)
// const analytics = import.meta.env.PROD ? getAnalytics(app) : null;

export { auth, db, storage };

// Export to window for browser console access
window.db = db;
window.firebaseFirestore = { writeBatch, doc, serverTimestamp, collection };