import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertMessage = ({ type, message, visible }) => {
  if (!visible) return null;

  const backgroundColor = type === 'error' ? '#ff6b6b' : '#4CAF50';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    width: '80%',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default AlertMessage;