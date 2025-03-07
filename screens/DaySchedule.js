import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Lesson from './Lesson'; // Импортируем компонент Lesson

const DaySchedule = ({ date, lessons }) => (
  <View style={styles.dayContainer}>
    <Text style={styles.dateText}>{date}</Text>
    {lessons.map((lesson, index) => (
      <Lesson key={index} lesson={lesson} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  dayContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default DaySchedule;
