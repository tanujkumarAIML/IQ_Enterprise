import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATQiPPr9EJIqiJdz6wdlfkNJgaLFigvdE",
  authDomain: "interviewiqenterprise.firebaseapp.com",
  projectId: "interviewiqenterprise",
  storageBucket: "interviewiqenterprise.firebasestorage.app",
  messagingSenderId: "705029000930",
  appId: "1:705029000930:web:6dc77fc55767fbeee698bb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;