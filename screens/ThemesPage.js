import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ThemesPage = () => {
  return (
    <View style={styles.container}>
      <Text>Themes Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemesPage;
