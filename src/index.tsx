import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  Dashboard,
  QRScreen,
} from './screens';

import { firebase, db, addDoc, auth, collection, doc, getDocs, setDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from './firebase/config';

const Router = createStackNavigator(
  {
    HomeScreen,
    LoginScreen,
    RegisterScreen,
    ForgotPasswordScreen,
    Dashboard,
    QRScreen,
  },
  {
    initialRouteName: !auth.currentUser ? 'QRScreen' : 'HomeScreen',
    headerMode: 'none',
  }
);

export default createAppContainer(Router);
