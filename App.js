import React from 'react';
import { LogBox } from 'react-native'
import { StyleSheet, Text, View } from 'react-native';

import Navigation from './navigations/Navigation'

LogBox.ignoreAllLogs()

export default function App() {
  return (
    <Navigation/>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})