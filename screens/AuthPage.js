import React, { useState, useRef, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';
import { Ionicons } from '@expo/vector-icons';

const AuthPage = () => { // Убрали navigation из пропсов
  const [userLogin, onChangeLogin] = useState('');
  const [userPass, onChangePass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const backgroundColor = useRef(new Animated.Value(0)).current;
  const { login } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(backgroundColor, {
      toValue: userLogin.trim() !== '' && userPass.trim() !== '' ? 1 : 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [userLogin, userPass]);

  const buttonBackgroundColor = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#99b6ff', '#5786ff'],
  });

  const buttonScale = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setAlert({ visible: false, type: '', message: '' });

    try {
      const response = await fetch('https://schapi.ru/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: userLogin,
          password: userPass,
        }),
      });

      const data = await response.json();

      if (data.code === 0) {
        const userData = {
          id: data.response.user.id,
          name: data.response.user.name,
          email: data.response.user.email,
          login: data.response.user.login,
        };
        await login(userData); // Навигация будет обработана в AuthNavigator
      } else {
        setAlert({ visible: true, type: 'error', message: 'Неправильный логин или пароль' });
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      setAlert({ visible: true, type: 'error', message: 'Проверьте соединение с интернетом.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.header}>
            <Ionicons name="school" size={48} color="#5786ff" />
            <Text style={styles.title}>Вход в систему</Text>
            <Text style={styles.subtitle}>Введите ваши учетные данные</Text>
          </View>
          
          <AlertMessage
            visible={alert.visible}
            type={alert.type}
            message={alert.message}
          />

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#5786ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Логин"
                placeholderTextColor="#999"
                value={userLogin}
                onChangeText={onChangeLogin}
                editable={!isLoading}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#5786ff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Пароль"
                placeholderTextColor="#999"
                value={userPass}
                onChangeText={onChangePass}
                secureTextEntry={secureTextEntry}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => setSecureTextEntry(!secureTextEntry)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={secureTextEntry ? 'eye-off' : 'eye'} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View 
            style={[
              styles.button, 
              { 
                backgroundColor: buttonBackgroundColor,
                transform: [{ scale: buttonScale }],
              }
            ]}
          >
            <TouchableOpacity
              onPress={handleLogin}
              disabled={userLogin.trim() === '' || userPass.trim() === '' || isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Войти</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </View>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

// Стили остаются теми же...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
    marginLeft: 8,
  },
  button: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#5786ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default AuthPage;