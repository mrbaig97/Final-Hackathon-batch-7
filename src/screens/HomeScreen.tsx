import React, { memo, useState } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import { Navigation } from '../types';

type Props = {
  navigation: Navigation;
};

const HomeScreen = ({ navigation }: Props) => {
  return (
    <Background>
      <Logo />
      <Header>Welcome Back!</Header>
      <Paragraph>
        We endeavor to provide the best quality services in areas including
        food, education, medical and social welfare free of cost to people
        living in the dark.
      </Paragraph>
      <Button
        mode="contained"
        textColor="white"
        onPress={() => navigation.navigate('Dashboard')}
      >
        Dashboard
      </Button>
    </Background>
  );
};

export default memo(HomeScreen);
