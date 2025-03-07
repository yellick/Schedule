import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Lesson = ({ lesson }) => (
  <View style={styles.lessonContainer}>
    <View style={styles.column}>
      <Text style={styles.lessonPair}>{lesson.pair}</Text>
      <Text style={styles.lessonTime}>{lesson.time.split(' - ')[0]}</Text>
      <Text style={styles.lessonTime}>{lesson.time.split(' - ')[1]}</Text>
    </View>
    <View style={styles.column}>
      <Text style={styles.lessonSubject}>{lesson.subject}</Text>
      <Text style={styles.lessonTeacher}>{lesson.teacher}</Text>
      <Text style={styles.lessonRoom}>{lesson.room}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  lessonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  column: {
    flex: 1,
  },
  lessonPair: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lessonSubject: {
    fontSize: 16,
    color: '#555',
  },
  lessonTime: {
    fontSize: 14,
    color: '#777',
  },
  lessonTeacher: {
    fontSize: 14,
    color: '#777',
  },
  lessonRoom: {
    fontSize: 14,
    color: '#777',
  },
});

export default Lesson;
