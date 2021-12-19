import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import { Navigation } from '../types';
import { Snackbar } from 'react-native-paper';
import { nameValidator, passwordValidator } from '../core/utils';
import { firebase, db, addDoc, auth, collection, doc, getDocs, setDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../firebase/config'
import ReactMapGL, { Marker, GeolocateControl } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import '../assets/css/map.css';
import data from '../assets/data/food_bank.json';

type Props = {
  navigation: Navigation;
};

const computeDistance = ([prevLat, prevLong], [lat, long]) => {
  const prevLatInRad = toRad(prevLat);
  const prevLongInRad = toRad(prevLong);
  const latInRad = toRad(lat);
  const longInRad = toRad(long);

  return (
    // In kilometers
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
      Math.cos(prevLatInRad) *
      Math.cos(latInRad) *
      Math.cos(longInRad - prevLongInRad)
    )
  );
};

const toRad = angle => {
  return (angle * Math.PI) / 180;
};

const Dashboard = ({ navigation }) => {

  const [visible, setVisible] = useState(false);
  const [notificationMessage, setnotificationMessage] = useState('');

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const userSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigation.navigate('LoginScreen')
    }).catch((error) => {
      // An error happened.
    });
  }
  const [distances, setDistances] = useState([]);
  const [popupInfo, setPopupInfo] = useState(null);
  const [viewport, setViewport] = useState({
    width: 400,
    height: 300,
    latitude: 24.914,
    longitude: 67.082,
    zoom: 3.5,
  });

  const MAPBOX_TOKEN =
    'pk.eyJ1IjoidGtha2h0ZXIiLCJhIjoiY2t4YnVrcHB2MGJzZzJybzNvNzI1Nm9leSJ9.PNC4g_66kmqRrv77g4HXUQ';

  const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

  const SIZE = 20;
  const geolocateStyle = {
    top: 0,
    left: 0,
    margin: 10,
  };

  const positionOptions = { enableHighAccuracy: true };

  const [branch, setBranch] = useState({ value: '', error: '' });
  const [name, setName] = useState({ value: '', error: '' });
  const [fatherName, setFatherName] = useState({ value: '', error: '' });
  const [cnic, setCnic] = useState({ value: '', error: '' });
  const [dob, setDob] = useState({ value: '', error: '' });
  const [familyMembers, setFamilyMembers] = useState({ value: '', error: '' });
  const [category, setCategory] = useState({ value: '', error: '' });
  const [monthlyIncome, setMonthlyIncome] = useState({ value: '', error: '' });

  // console.log(distances);
  const sendRequest = () => {
    const data = {
      branch: branch.value,
      name: name.value,
      fatherName: fatherName.value,
      cnic: cnic.value,
      dob: dob.value,
      familyMembers: familyMembers.value,
      monthlyIncome: monthlyIncome.value,
      category: category.value,
      status: 'pending'
    };

    addDoc(collection(db, "requests",), data);
    setnotificationMessage('Request Created Successfully');
    onToggleSnackBar();
    setTimeout(function () {
      navigation.navigate('QRScreen')
    }, 2000);
  };

  return (
    <Background>
      <Logo />
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'X',
        }}>
        {notificationMessage ? notificationMessage : null}
      </Snackbar>
      <View style={styles.header}>
        <Button mode="outlined" onPress={userSignOut}>
          Logout
        </Button>
        <Header>Let’s start</Header>
      </View>
      <ScrollView>
        <ReactMapGL
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={nextViewport => setViewport(nextViewport)}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          {data.map((city, index) => (
            <Marker
              key={`marker-${index}`}
              longitude={city.longitude}
              latitude={city.latitude}
            >
              <svg
                height={SIZE}
                viewBox="0 0 24 24"
                style={{
                  cursor: 'pointer',
                  fill: '#d00',
                  stroke: 'none',
                  transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
                }}
                onClick={() => {
                  setnotificationMessage(city.branch_name);
                  onToggleSnackBar();
                }
                }
              >
                <path d={ICON} />
              </svg>
            </Marker>
          ))}
          <GeolocateControl
            style={geolocateStyle}
            positionOptions={positionOptions}
            trackUserLocation
            auto
            onViewportChange={v => {
              // console.log(v);
              setViewport(v);
              {
                data.map((city, index) => {
                  setDistances(distances => [
                    ...distances, {
                      branch: city.branch_name, distance:
                        computeDistance(
                          [city.latitude, city.longitude],
                          [v.latitude, v.longitude]
                        ),
                    }]);
                });
              }
            }}
          />
        </ReactMapGL>

        <TextInput
          label="Nearest Branch"
          returnKeyType="next"
          value={branch.value}
          onChangeText={text => setBranch({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />

        <TextInput
          label="Name"
          returnKeyType="next"
          value={name.value}
          onChangeText={text => setName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          autoCompleteType="name"
        />

        <TextInput
          label="Father Name"
          returnKeyType="next"
          value={fatherName.value}
          onChangeText={text => setFatherName({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
        />

        <TextInput
          label="CNIC Number"
          returnKeyType="next"
          value={cnic.value}
          onChangeText={text => setCnic({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          keyboardType="number-pad"
        />

        <TextInput
          label="Date Of Birth"
          returnKeyType="next"
          value={dob.value}
          onChangeText={text => setDob({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          keyboardType="number-pad"
        />

        <TextInput
          label="Number Of Family Members"
          returnKeyType="next"
          value={familyMembers.value}
          onChangeText={text => setFamilyMembers({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          keyboardType="number-pad"
        />

        <TextInput
          label="Category"
          returnKeyType="next"
          value={category.value}
          onChangeText={text => setCategory({ value: text, error: '' })}
          error={!!name.error}
          errorText={name.error}
          keyboardType="number-pad"
        />

        <TextInput
          label="Enter monthly income"
          returnKeyType="next"
          value={monthlyIncome.value}
          onChangeText={text => setmonthlyIncome({ value: text, error: '' })}
          keyboardType="number-pad"
        />

        <Button mode="contained" textColor='white' onPress={sendRequest}>
          Submit
        </Button>
      </ScrollView>
    </Background>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    height: 300,
    width: 300,
    backgroundColor: 'tomato',
  },
  map: {
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%'
  }
});

export default memo(Dashboard);
