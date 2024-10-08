import React, { useEffect, useState } from 'react';

import api from './api';
import type { RESPONSE_DATA } from './api';

import './App.css';
// Заранее объявленный список данных
const predefinedData = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Michael Johnson' },
  { id: '4', name: 'Emily Davis' },
  { id: '5', name: 'David Wilson' }
];

function App1() {
  const [inputValue, setInputValue] = useState(''); // Состояние для отслеживания ввода пользователя
  const [filteredSuggestions, setFilteredSuggestions] = useState<null | { id: string; name: string }[]>(null); // Подсказки (null - скрыт)
  const [selectedValue, setSelectedValue] = useState(''); // Выбранное значение

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setInputValue(userInput);

    // Показать подсказки только при наличии ввода
    if (userInput) {
      const suggestions = predefinedData.filter(item =>
        item.name.toLowerCase().includes(userInput.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(null); // Скрыть подсказки, если нет ввода
    }
  };

  // Обработчик выбора значения из списка
  const handleSuggestionClick = (name: string) => {
    setSelectedValue(name); // Установить выбранное значение
    setInputValue(name); // Заполнить поле выбранным значением
    setFilteredSuggestions(null); // Скрыть список подсказок после выбора
  };

  return (
    <div className='App'>
      <div className='input-container'>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Введите имя...'
          className='input-field'
        />
        {/* Отображаем список подсказок, если есть введённый текст и фильтрованные результаты */}
        {filteredSuggestions && filteredSuggestions.length > 0 && (
          <ul className='suggestions-list'>
            {filteredSuggestions.map((suggestion) => (
              <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.name)}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Отображаем выбранное значение */}
      {selectedValue && <p>Вы выбрали: {selectedValue}</p>}
    </div>
  );
}


function App() {
  const [data, setData] = useState<RESPONSE_DATA>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get.data();
      setData(response);
    };

    fetchData();
  }, []);

  return <div className='App'>{data ? <p>{data.greeting}</p> : 'no data'}</div>;
}

export default App1;