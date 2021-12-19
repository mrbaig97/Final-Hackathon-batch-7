import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import { Snackbar } from 'react-native-paper';
import { firebase, db, addDoc, auth, collection, doc, getDocs, setDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase/config'
import QRCode from 'react-native-qrcode-svg';
type Props = {
    navigation: Navigation;
};

const LoginScreen = ({ navigation }: Props) => {
    const [visible, setVisible] = useState(false);
    const [notificationMessage, setnotificationMessage] = useState('');

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    const [QRCodeGenerated, setQRCodeGenerated] = useState('');
    auth.currentUser ? setQRCodeGenerated(auth.currentUser.uid + '&&' + auth.currentUser.email) : '';

    return (
        <Background>
            <BackButton goBack={() => navigation.navigate('HomeScreen')} />
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'X',
                }}>
                {notificationMessage ? notificationMessage : null}
            </Snackbar>
            <Logo />

            <Header>Request Submitted</Header>
            <Paragraph>
                Thank you for submitting. Our Representative will connect with you soon.
            </Paragraph>

            <QRCode
                value={QRCodeGenerated ? QRCodeGenerated : 'This is QR Code'}
            />
            <Button mode="contained" textColor='white' onPress={() => navigation.navigate('Dashboard')}>
                Dashboard
            </Button>
        </Background>
    );
};

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});

export default memo(LoginScreen);
