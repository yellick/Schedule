import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, Platform } from 'react-native';
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
  const { selectedGroup, updateGroup } = useGroup();

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
          if (result.response.groups.length > 0) {
            const initialGroup = selectedGroup || result.response.groups[0];
            updateGroup(initialGroup);
          }
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
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedGroup?.id, user?.id]);

  const handleGroupSelect = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) updateGroup(group);
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
            selectedValue={selectedGroup?.id}
            onValueChange={handleGroupSelect}
            dropdownIconColor="#5786ff"
          >
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Загрузка расписания...</Text>
          </View>
        ) : data.length > 0 ? (
          data.map((day, index) => (
            <DaySchedule key={index} date={day.date} lessons={day.lessons} />
          ))
        ) : (
          <Text style={styles.noDataText}>Нет данных о расписании</Text>
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
});

export default SchedulePage;