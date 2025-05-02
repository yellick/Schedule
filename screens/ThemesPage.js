import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ThemesPage = () => {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!user?.id) {
          throw new Error('Данные пользователя не найдены');
        }

        const response = await fetch('https://schapi.ru/themes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ u_id: user.id }),
        });

        const result = await response.json();
        console.log('Ответ сервера:', result);

        if (result.code === 0) {
          setThemes(result.response.themes || []);
        } else if (result.code === 1) {
          await logout();
          navigation.navigate('Auth');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemes();
  }, [user?.id]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5786ff" />
        <Text style={styles.loadingText}>Загрузка тем...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning" size={48} color="#f66" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {themes.length > 0 ? (
        themes.map((item, index) => (
          <View key={`${item.theme}-${index}`} style={styles.themeCard}>
            <Text style={styles.themeType}>{item.type}</Text>
            <Text style={styles.themeTitle}>{item.theme}</Text>
            <View style={styles.curatorContainer}>
              <Ionicons name="person" size={16} color="#5786ff" />
              <Text style={styles.curatorText}>{item.curator}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.centerContainer}>
          <Ionicons name="book" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Нет доступных тем</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#5786ff',
  },
  errorText: {
    marginTop: 16,
    color: '#f66',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    color: '#999',
    fontSize: 16,
  },
  themeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeType: {
    color: '#5786ff',
    fontWeight: '600',
    marginBottom: 8,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  curatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  curatorText: {
    marginLeft: 8,
    color: '#666',
  },
});

export default ThemesPage;