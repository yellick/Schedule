import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Загрузка сохраненной группы при монтировании
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const savedGroup = await AsyncStorage.getItem('selectedGroup');
        if (savedGroup) setSelectedGroup(JSON.parse(savedGroup));
      } catch (error) {
        console.error('Ошибка загрузки группы:', error);
      }
    };
    loadGroup();
  }, []);

  // Сохранение группы при изменении
  const updateGroup = async (group) => {
    try {
      await AsyncStorage.setItem('selectedGroup', JSON.stringify(group));
      setSelectedGroup(group);
    } catch (error) {
      console.error('Ошибка сохранения группы:', error);
    }
  };

  return (
    <GroupContext.Provider value={{ selectedGroup, updateGroup }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);