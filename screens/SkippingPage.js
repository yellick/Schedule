import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';

const SkippingPage = () => {
  const { user } = useAuth();
  const [skippingData, setSkippingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [monthsMap, setMonthsMap] = useState(new Map());
  const [filteredData, setFilteredData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);

  // Загрузка данных о пропусках
  useEffect(() => {
    const fetchSkippingData = async () => {
      try {
        if (!user?.id) {
          throw new Error('Данные пользователя не найдены');
        }

        setLoading(true);
        setError(null);

        const response = await fetch('https://schapi.ru/skipping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ u_id: user.id }),
        });

        const result = await response.json();

        if (result.code === 0) {
          const data = result.response.skipping || [];
          setSkippingData(data);
          processAvailableDates(data);
        } else {
          throw new Error('Ошибка загрузки данных');
        }
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkippingData();
  }, [user?.id]);

  // Фильтрация данных при изменении года или месяца
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const filtered = skippingData.filter(
        item => item.year.toString() === selectedYear && 
               item.month.toString() === selectedMonth
      );
      setFilteredData(filtered);
      
      // Подсчет общего количества часов
      const sum = filtered.reduce((acc, item) => acc + (item.hours || 0), 0);
      setTotalHours(sum);
    }
  }, [selectedYear, selectedMonth, skippingData]);

  // Обработка доступных дат
  const processAvailableDates = (data) => {
    const yearsSet = new Set();
    const newMonthsMap = new Map();

    data.forEach((item) => {
      yearsSet.add(item.year);
      
      if (!newMonthsMap.has(item.year)) {
        newMonthsMap.set(item.year, new Set());
      }
      newMonthsMap.get(item.year).add(item.month);
    });

    // Сортируем года по убыванию
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
    setAvailableYears(sortedYears);
    setMonthsMap(newMonthsMap);

    // Устанавливаем первый год по умолчанию
    if (sortedYears.length > 0) {
      const firstYear = sortedYears[0].toString();
      setSelectedYear(firstYear);
      updateAvailableMonths(firstYear, newMonthsMap);
    }
  };

  // Обновление доступных месяцев для выбранного года
  const updateAvailableMonths = (year, map) => {
    if (map.has(Number(year))) {
      const months = Array.from(map.get(Number(year))).sort((a, b) => b - a);
      const monthsStrings = months.map(m => m.toString());
      setAvailableMonths(monthsStrings);
      
      if (monthsStrings.length > 0) {
        setSelectedMonth(monthsStrings[0]);
      } else {
        setSelectedMonth('');
      }
    } else {
      setAvailableMonths([]);
      setSelectedMonth('');
    }
  };

  // Обработчик изменения года
  const handleYearChange = (year) => {
    setSelectedYear(year);
    updateAvailableMonths(year, monthsMap);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5786ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Выбор года и месяца */}
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Год:</Text>
        {Platform.OS === 'web' ? (
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            style={styles.webSelect}
          >
            {availableYears.map((year) => (
              <option key={`year-${year}`} value={year}>
                {year.toString()}
              </option>
            ))}
          </select>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              onValueChange={handleYearChange}
              dropdownIconColor="#5786ff"
              style={styles.picker}
            >
              {availableYears.map((year) => (
                <Picker.Item key={`year-${year}`} label={year.toString()} value={year.toString()} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={[styles.label, { marginTop: 16 }]}>Месяц:</Text>
        {Platform.OS === 'web' ? (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={styles.webSelect}
            disabled={availableMonths.length === 0}
          >
            {availableMonths.length > 0 ? (
              availableMonths.map((month) => (
                <option key={`month-${month}`} value={month}>
                  {getMonthName(Number(month))}
                </option>
              ))
            ) : (
              <option value="">Нет данных</option>
            )}
          </select>
        ) : (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(month) => setSelectedMonth(month)}
              dropdownIconColor="#5786ff"
              enabled={availableMonths.length > 0}
              style={styles.picker}
            >
              {availableMonths.length > 0 ? (
                availableMonths.map((month) => (
                  <Picker.Item 
                    key={`month-${month}`} 
                    label={getMonthName(Number(month))} 
                    value={month} 
                  />
                ))
              ) : (
                <Picker.Item label="Нет данных" value="" enabled={false} />
              )}
            </Picker>
          </View>
        )}
      </View>

      {/* Таблица с равными колонками */}
      <ScrollView style={styles.content}>
        {filteredData.length > 0 ? (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, {flex: 1}]}>Дата</Text>
              <Text style={[styles.headerCell, {flex: 1}]}>Пропущено часов</Text>
            </View>
            
            {filteredData.map((item, index) => (
              <View key={`row-${index}`} style={[
                styles.tableRow,
                index % 2 === 0 ? styles.evenRow : styles.oddRow
              ]}>
                <Text style={[styles.cell, {flex: 1}]}>
                  {formatDate(item.day, item.month, item.year)}
                </Text>
                <Text style={[styles.cell, {flex: 1}]}>
                  {item.hours || '-'}
                </Text>
              </View>
            ))}
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalCell, {flex: 1}]}>Всего</Text>
              <Text style={[styles.totalCell, {flex: 1}]}>{totalHours}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedYear && selectedMonth ? 'Нет данных за выбранный период' : 'Выберите год и месяц'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Вспомогательные функции
const getMonthName = (month) => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[month - 1] || month;
};

const formatDate = (day, month, year) => {
  return `${day} ${getMonthName(month).toLowerCase()} ${year} г.`;
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
  // Стиль для мобильных Picker'ов
  pickerWrapper: {
    // Убираем только границу, сохраняя фон
    backgroundColor: '#fff',
  },
  picker: {
    // Убираем только границу
    borderWidth: 0,
  },
  // Стиль для веб-версии (select)
  webSelect: {
    width: '100%',
    fontSize: 16,
    padding: 8,
    border: 'none', // Убираем только границу
    backgroundColor: '#fff', // Сохраняем фон
    // Сохраняем стандартные стрелочки
    appearance: 'menulist',
    outline: 'none',
  },
  content: {
    flex: 1,
  },
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#5786ff',
    paddingVertical: 14,
  },
  headerCell: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 15,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
  cell: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
    paddingHorizontal: 8,
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f6ff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalCell: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default SkippingPage;