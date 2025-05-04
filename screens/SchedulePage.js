import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DaySchedule from './DaySchedule';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useGroup } from '../context/GroupContext';

const SchedulePage = () => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { selectedGroup, updateGroup, isLoading: groupLoading } = useGroup();
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
  const timeoutRef = useRef(null);

  const transformScheduleData = (apiData) => {
    return apiData.map(day => ({
      date: day.date,
      lessons: day.lessons.map(lesson => ({
        pair: `${lesson.lesson_num} пара`,
        time: `${lesson.time_from} - ${lesson.time_to}`,
        subject: lesson.lesson_name,
        teacher: lesson.teacher,
        room: lesson.room
      }))
    }));
  };

  const showError = (message) => {
    if (Platform.OS === 'web') {
      console.error('Ошибка:', message);
      alert(`Ошибка: ${message}`);
    } else {
      Alert.alert('Ошибка', message);
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://schapi.ru/groups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        const result = await response.json();

        if (result.code === 0) {
          setGroups(result.response.groups);
        } else if (result.code === 1) {
          showError(result.message || 'Ошибка при загрузке групп');
          await logout();
          navigation.navigate('Auth');
        }
      } catch (error) {
        console.error('Ошибка:', error);
        showError('Ошибка сети при загрузке групп');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!selectedGroup?.id || !user?.id) return;

    const fetchSchedule = async () => {
      try {
        setIsLoading(true);
        setShowDelayedLoading(false);
        
        // Запускаем таймер для отложенного сообщения
        timeoutRef.current = setTimeout(() => {
          setShowDelayedLoading(true);
        }, 3000);

        const response = await fetch('https://schapi.ru/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            u_id: user.id,
            group_id: selectedGroup.id
          })
        });

        const result = await response.json();

        if (result.code === 0) {
          const transformedData = transformScheduleData(result.response.schedule);
          setData(transformedData);
        } else if (result.code === 1) {
          showError(result.message || 'Ошибка при загрузке расписания');
          await logout();
          navigation.navigate('Auth');
        }
      } catch (error) {
        console.error('Ошибка загрузки расписания:', error);
        showError('Ошибка сети при загрузке расписания');
      } finally {
        clearTimeout(timeoutRef.current);
        setIsLoading(false);
        setShowDelayedLoading(false);
      }
    };

    fetchSchedule();

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [selectedGroup?.id, user?.id]);

  const handleGroupSelect = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group && group.id !== selectedGroup?.id) {
      updateGroup(group);
    }
  };

  const renderGroupSelector = () => {
    if (isLoading) return <Text>Загрузка...</Text>;
    if (groups.length === 0) return <Text>Нет доступных групп</Text>;

    if (Platform.OS === 'web') {
      return (
        <select
          value={selectedGroup?.id || ''}
          onChange={(e) => handleGroupSelect(Number(e.target.value))}
          style={styles.webSelect}
        >
          <option value="" disabled hidden>
            {selectedGroup ? selectedGroup.name : 'Выберите группу'}
          </option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedGroup?.id || ''}
            onValueChange={handleGroupSelect}
            dropdownIconColor="#5786ff"
          >
            <Picker.Item
              label={selectedGroup ? selectedGroup.name : 'Выберите группу'}
              value=""
              enabled={false}
              style={styles.placeholderText}
            />
            {groups.map((group) => (
              <Picker.Item
                key={group.id}
                label={group.name}
                value={group.id}
              />
            ))}
          </Picker>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Выберите группу:</Text>
        {renderGroupSelector()}
      </View>

      <ScrollView style={styles.scheduleContainer}>
        {groupLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5786ff" />
          </View>
        ) : !selectedGroup ? (
          <Text style={styles.noDataText}>Пожалуйста, выберите группу</Text>
        ) : (
          <>
            {isLoading && showDelayedLoading && (
              <View style={styles.loadingMessage}>
                <Text style={styles.loadingText}>
                  Данные загружаются, пожалуйста подождите...
                </Text>
                <ActivityIndicator size="small" color="#5786ff" />
              </View>
            )}

            {!isLoading && data.length > 0 ? (
              data.map((day, index) => (
                <DaySchedule key={index} date={day.date} lessons={day.lessons} />
              ))
            ) : (
              <Text style={styles.noDataText}>Нет данных о расписании</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  placeholderText: {
    color: '#999',
  },
  selectorContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  webSelect: {
    width: '100%',
    padding: 10,
    fontSize: 16,
    border: '1px solid #ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  scheduleContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    margin: 10,
  },
  loadingText: {
    color: '#5786ff',
    marginRight: 10,
    fontSize: 14,
  },
});

export default SchedulePage;