import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Text, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DaySchedule from './DaySchedule';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const SchedulePage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const navigation = useNavigation();

  const [data, setData] = useState([
    {
      date: "ПН. 20.01.2025",
      lessons: [
        {
          pair: "4 пара",
          time: "13:50 - 15:20",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        },
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        },
        {
          pair: "6 пара",
          time: "17:10 - 18:20",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        }
      ]
    },
    {
      date: "ВТ. 21.01.2025",
      lessons: [
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        },
        {
          pair: "6 пара",
          time: "17:10 - 18:20",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        }
      ]
    },
    {
      date: "ЧТ. 23.01.2025",
      lessons: [
        {
          pair: "3 пара",
          time: "12:00 - 13:30",
          subject: "Ин.яз",
          teacher: "А Ещеркина Л.В.",
          room: "422"
        },
        {
          pair: "4 пара",
          time: "13:50 - 15:20",
          subject: "Физ-ра",
          teacher: "А Тютин А.А.",
          room: "Спортзал"
        },
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.01.04",
          teacher: "А Гапчук",
          room: "А.А. 217"
        },
        {
          pair: "6 пара",
          time: "17:10 - 18:20",
          subject: "МДК.01.04",
          teacher: "А Гапчук",
          room: "А.А. 217"
        }
      ]
    },
    {
      date: "ПТ. 24.01.2025",
      lessons: [
        {
          pair: "2 пара",
          time: "10:10 - 11:40",
          subject: "МДК.01.03",
          teacher: "А Гапчук",
          room: "А.А. 217"
        },
        {
          pair: "3 пара",
          time: "12:00 - 13:30",
          subject: "МДК.01.03",
          teacher: "А Гапчук",
          room: "А.А. 217"
        },
        {
          pair: "4 пара",
          time: "13:50 - 15:20",
          subject: "МДК.01.04",
          teacher: "А Гапчук",
          room: "А.А. 217"
        },
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.01.04",
          teacher: "А Гапчук",
          room: "А.А. 217"
        }
      ]
    },
    {
      date: "СБ. 25.01.2025",
      lessons: [
        {
          pair: "4 пара",
          time: "13:50 - 15:20",
          subject: "МДК.01.03",
          teacher: "А Гапчук",
          room: "А.А. 419"
        },
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.01.03",
          teacher: "А Гапчук",
          room: "А.А. 419"
        }
      ]
    },
    {
      date: "ПН. 27.01.2025",
      lessons: [
        {
          pair: "4 пара",
          time: "13:50 - 15:20",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        },
        {
          pair: "5 пара",
          time: "15:30 - 17:00",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        },
        {
          pair: "6 пара",
          time: "17:10 - 18:20",
          subject: "МДК.02.02",
          teacher: "А Блинов А.",
          room: "В. 217"
        }
      ]
    }
  ]); // Ваши тестовые данные

  // Загрузка списка групп
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
            setSelectedGroupId(result.response.groups[0].id);
          }
        } else if (result.code === 1) {
          await logout();
          navigation.navigate('Auth');
        }
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);
  
  
  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
    console.log('Выбрана группа:', groupId);
  };

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Рендер выбора группы (универсальный)
  const renderGroupSelector = () => {
    if (isLoading) return <Text>Загрузка...</Text>;

    if (groups.length === 0) return <Text>Нет доступных групп</Text>;

    if (Platform.OS === 'web') {
      return (
        <select
          value={selectedGroupId || ''}
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
            selectedValue={selectedGroupId}
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
      {/* Универсальный селектор групп */}
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Выберите группу:</Text>
        {renderGroupSelector()}
      </View>

      {/* Расписание */}
      <ScrollView style={styles.scheduleContainer}>
        {data.map((day, index) => (
          <DaySchedule key={index} date={day.date} lessons={day.lessons} />
        ))}
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
    overflow: 'hidden', // Для скругления углов на Android
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
});

export default SchedulePage;