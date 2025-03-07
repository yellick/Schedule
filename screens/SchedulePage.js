import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import DaySchedule from './DaySchedule'; // Импортируем компонент DaySchedule

const SchedulePage = () => {
  const data = [
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
  ];

  return (
    <ScrollView style={styles.container}>
      {data.map((day, index) => (
        <DaySchedule key={index} date={day.date} lessons={day.lessons} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default SchedulePage;
