import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const AuthPage = ({ navigation }) => {
  const [userLogin, onChangeLogin] = useState('');
  const [userPass, onChangePass] = useState('');
  const backgroundColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: userLogin.trim() !== '' && userPass.trim() !== '' ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [userLogin, userPass]);

  const buttonBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#99b6ff', '#5786ff'], // Цвет кнопки авторизации
  });

  function login() {
    alert(`Login: ${userLogin}\nPassword: ${userPass}`);
    navigation.navigate('BottomTab');
  }

  const sendPostRequest = async () => {
    try {
      const response = await fetch('http://localhost:52703/user_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: 'value' }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Button title="Send POST Request" onPress={sendPostRequest} />
        <Text style={styles.title}>Вход</Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder='Логин'
            value={userLogin}
            onChangeText={onChangeLogin}
          />
          <TextInput
            style={styles.input}
            placeholder='Пароль'
            value={userPass}
            onChangeText={onChangePass}
            secureTextEntry
          />
        </View>
        <Animated.View style={[styles.button, { backgroundColor: buttonBackgroundColor }]}>
          <TouchableOpacity onPress={login} disabled={userLogin.trim() === '' || userPass.trim() === ''}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 50,
  },
  form: {
    width: '80%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 8,
  },
  button: {
    padding: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AuthPage;
