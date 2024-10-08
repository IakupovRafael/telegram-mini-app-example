import React, { useEffect, useState } from 'react';

import api from './api';
import type { RESPONSE_DATA } from './api';

import './App.css';

// Новый массив с данными о рейсах
const predefinedRoutes = [
  { from: 'New York', to: 'Los Angeles', departure: '10:00', arrival: '16:00' },
  { from: 'Chicago', to: 'Houston', departure: '11:00', arrival: '15:00' },
  { from: 'Boston', to: 'Seattle', departure: '09:00', arrival: '14:00' },
  { from: 'Miami', to: 'Dallas', departure: '13:00', arrival: '17:00' },
  { from: 'San Francisco', to: 'Denver', departure: '08:00', arrival: '12:00' }
];

// Функция для извлечения всех уникальных станций из массива
const getAllStations = (routes: typeof predefinedRoutes) => {
  const stations = new Set<string>();
  routes.forEach(route => {
    stations.add(route.from);
    stations.add(route.to);
  });
  return Array.from(stations);
};

const allStations = getAllStations(predefinedRoutes);

function App() {
  const [departureValue, setDepartureValue] = useState(''); // Поле для станции отправления
  const [arrivalValue, setArrivalValue] = useState(''); // Поле для станции прибытия
  const [isDepartureValid, setIsDepartureValid] = useState(true); // Валидация станции отправления
  const [isArrivalValid, setIsArrivalValid] = useState(true); // Валидация станции прибытия

  const [filteredDepartureSuggestions, setFilteredDepartureSuggestions] = useState<null | string[]>(null); // Подсказки для станции отправления
  const [filteredArrivalSuggestions, setFilteredArrivalSuggestions] = useState<null | string[]>(null); // Подсказки для станции прибытия

  // Обработчик изменения ввода для станции отправления
  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setDepartureValue(userInput);

    if (userInput) {
      const suggestions = allStations.filter(station =>
        station.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredDepartureSuggestions(suggestions);
      setIsDepartureValid(allStations.includes(userInput)); // Проверяем, введена ли корректная станция
    } else {
      setFilteredDepartureSuggestions(null); // Скрыть подсказки, если нет ввода
      setIsDepartureValid(true); // Если поле пустое, оно считается корректным
    }
  };

  // Обработчик изменения ввода для станции прибытия
  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setArrivalValue(userInput);

    if (userInput) {
      const suggestions = allStations.filter(station =>
        station.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredArrivalSuggestions(suggestions);
      setIsArrivalValid(allStations.includes(userInput)); // Проверяем, введена ли корректная станция
    } else {
      setFilteredArrivalSuggestions(null); // Скрыть подсказки, если нет ввода
      setIsArrivalValid(true); // Если поле пустое, оно считается корректным
    }
  };

  // Обработчик клика по подсказке для станции отправления
  const handleDepartureSuggestionClick = (station: string) => {
    setDepartureValue(station); // Устанавливаем выбранную станцию
    setFilteredDepartureSuggestions(null); // Скрываем список подсказок
    setIsDepartureValid(true); // Сбрасываем ошибку
  };

  // Обработчик клика по подсказке для станции прибытия
  const handleArrivalSuggestionClick = (station: string) => {
    setArrivalValue(station); // Устанавливаем выбранную станцию
    setFilteredArrivalSuggestions(null); // Скрываем список подсказок
    setIsArrivalValid(true); // Сбрасываем ошибку
  };

  // Проверяем, корректны ли обе станции для активации кнопки
  const isSearchEnabled = departureValue && arrivalValue && isDepartureValid && isArrivalValid;

  // Обработчик клика вне поля ввода и подсказок
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInputField = target.closest('.input-container');
    if (!isInputField) {
      setFilteredDepartureSuggestions(null);
      setFilteredArrivalSuggestions(null);
    }
  };

  // Добавляем обработчик события при монтировании компонента
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className='App'>
      <div className='input-container'>
        <input
          type='text'
          value={departureValue}
          onChange={handleDepartureChange}
          placeholder='Станция отправления...'
          className={`input-field ${!isDepartureValid && departureValue ? 'input-error' : ''}`}
        />
        {filteredDepartureSuggestions && filteredDepartureSuggestions.length > 0 && (
          <ul className='suggestions-list'>
            {filteredDepartureSuggestions.map((suggestion) => (
              <li key={suggestion} onClick={() => handleDepartureSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='input-container'>
        <input
          type='text'
          value={arrivalValue}
          onChange={handleArrivalChange}
          placeholder='Станция прибытия...'
          className={`input-field ${!isArrivalValid && arrivalValue ? 'input-error' : ''}`}
        />
        {filteredArrivalSuggestions && filteredArrivalSuggestions.length > 0 && (
          <ul className='suggestions-list'>
            {filteredArrivalSuggestions.map((suggestion) => (
              <li key={suggestion} onClick={() => handleArrivalSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className='search-button' disabled={!isSearchEnabled}>
        Поиск
      </button>
    </div>
  );
}

export default App;
