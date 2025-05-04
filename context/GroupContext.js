import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка сохраненной группы при монтировании
  useEffect(() => {
    const loadGroup = async () => {
      try {
        const savedGroup = await AsyncStorage.getItem('selectedGroup');
        if (savedGroup) {
          setSelectedGroup(JSON.parse(savedGroup));
        }
      } catch (error) {
        console.error('Ошибка загрузки группы:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGroup();
  }, []);

  // Обновление и сохранение группы
  const updateGroup = async (group) => {
    try {
      if (group === null) {
        await AsyncStorage.removeItem('selectedGroup');
      } else {
        await AsyncStorage.setItem('selectedGroup', JSON.stringify(group));
      }
      setSelectedGroup(group);
    } catch (error) {
      console.error('Ошибка сохранения группы:', error);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        selectedGroup,
        updateGroup,
        isLoading
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup должен использоваться внутри GroupProvider');
  }
  return context;
};