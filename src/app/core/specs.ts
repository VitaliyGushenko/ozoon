export type SpecType = 'text' | 'number' | 'select';

export interface SpecDef {
  key: string;
  label: string;
  type: SpecType;
  options?: string[];
}

export interface CategoryDef {
  value: 'phone' | 'laptop';
  label: string;
}

export const CATEGORIES: CategoryDef[] = [
  { value: 'phone', label: 'Телефоны' },
  { value: 'laptop', label: 'Ноутбуки' },
];

export const SPEC_TEMPLATES: Record<CategoryDef['value'], SpecDef[]> = {
  phone: [
    { key: 'brand', label: 'Бренд', type: 'text' },
    { key: 'model', label: 'Модель', type: 'text' },
    {
      key: 'year',
      label: 'Год выпуска',
      type: 'select',
      options: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    },
    {
      key: 'os',
      label: 'Операционная система',
      type: 'select',
      options: ['Android', 'iOS', 'HarmonyOS'],
    },
    {
      key: 'screen',
      label: 'Диагональ экрана',
      type: 'select',
      options: ['5.4"', '5.8"', '6.1"', '6.4"', '6.7"', '6.9"'],
    },
    {
      key: 'resolution',
      label: 'Разрешение экрана',
      type: 'select',
      options: ['HD+', 'Full HD+', 'QHD+', '2556×1179', '2868×1320'],
    },
    {
      key: 'matrix',
      label: 'Тип матрицы',
      type: 'select',
      options: ['IPS', 'TFT', 'OLED', 'AMOLED', 'LTPO AMOLED'],
    },
    { key: 'cpu', label: 'Процессор', type: 'text' },
    {
      key: 'ram',
      label: 'Оперативная память',
      type: 'select',
      options: ['4 ГБ', '6 ГБ', '8 ГБ', '12 ГБ', '16 ГБ'],
    },
    {
      key: 'storage',
      label: 'Встроенная память',
      type: 'select',
      options: ['64 ГБ', '128 ГБ', '256 ГБ', '512 ГБ', '1 ТБ'],
    },
    {
      key: 'mainCamera',
      label: 'Основная камера',
      type: 'select',
      options: ['12 Мп', '48 Мп', '50 Мп', '64 Мп', '108 Мп', '200 Мп'],
    },
    {
      key: 'frontCamera',
      label: 'Фронтальная камера',
      type: 'select',
      options: ['5 Мп', '8 Мп', '10 Мп', '12 Мп', '32 Мп'],
    },
    {
      key: 'battery',
      label: 'Ёмкость аккумулятора',
      type: 'select',
      options: ['3000 мА·ч', '3500 мА·ч', '4000 мА·ч', '4500 мА·ч', '5000 мА·ч', '6000 мА·ч'],
    },
    {
      key: 'charging',
      label: 'Быстрая зарядка',
      type: 'select',
      options: ['Нет', '18 Вт', '25 Вт', '33 Вт', '45 Вт', '65 Вт', '120 Вт'],
    },
    {
      key: 'sim',
      label: 'SIM-карты',
      type: 'select',
      options: ['1 nano-SIM', '2 nano-SIM', 'nano-SIM + eSIM', '2 nano-SIM + eSIM'],
    },
    {
      key: 'waterProtection',
      label: 'Защита от воды',
      type: 'select',
      options: ['Нет', 'IP53', 'IP65', 'IP67', 'IP68'],
    },
    { key: 'color', label: 'Цвет', type: 'text' },
    { key: 'weight', label: 'Вес, г', type: 'number' },
  ],
  laptop: [
    { key: 'brand', label: 'Бренд', type: 'text' },
    { key: 'model', label: 'Модель', type: 'text' },
    {
      key: 'year',
      label: 'Год выпуска',
      type: 'select',
      options: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    },
    {
      key: 'os',
      label: 'Операционная система',
      type: 'select',
      options: ['Windows 11', 'Windows 11 Pro', 'macOS', 'Linux', 'Без ОС'],
    },
    {
      key: 'screen',
      label: 'Диагональ экрана',
      type: 'select',
      options: ['13.3"', '14"', '15.6"', '16"', '17.3"'],
    },
    {
      key: 'resolution',
      label: 'Разрешение экрана',
      type: 'select',
      options: ['Full HD (1920×1080)', 'QHD (2560×1440)', '4K UHD (3840×2160)'],
    },
    {
      key: 'matrix',
      label: 'Тип матрицы',
      type: 'select',
      options: ['TN', 'IPS', 'OLED', 'mini-LED'],
    },
    { key: 'cpu', label: 'Процессор', type: 'text' },
    {
      key: 'ram',
      label: 'Оперативная память',
      type: 'select',
      options: ['8 ГБ', '16 ГБ', '24 ГБ', '32 ГБ', '64 ГБ'],
    },
    {
      key: 'ramType',
      label: 'Тип памяти',
      type: 'select',
      options: ['DDR4', 'DDR5', 'LPDDR4X', 'LPDDR5'],
    },
    {
      key: 'storage',
      label: 'Накопитель',
      type: 'select',
      options: ['256 ГБ', '512 ГБ', '1 ТБ', '2 ТБ'],
    },
    {
      key: 'storageType',
      label: 'Тип накопителя',
      type: 'select',
      options: ['SSD NVMe', 'SSD SATA', 'HDD', 'HDD + SSD'],
    },
    { key: 'gpu', label: 'Видеокарта', type: 'text' },
    {
      key: 'battery',
      label: 'Работа от батареи',
      type: 'select',
      options: ['до 5 ч', '5–8 ч', '8–12 ч', '12–18 ч', 'более 18 ч'],
    },
    {
      key: 'ports',
      label: 'Порты',
      type: 'text',
    },
    {
      key: 'keyboard',
      label: 'Подсветка клавиатуры',
      type: 'select',
      options: ['Есть', 'Нет'],
    },
    {
      key: 'weight',
      label: 'Вес',
      type: 'select',
      options: ['до 1 кг', '1–1.5 кг', '1.5–2 кг', '2–2.5 кг', 'более 2.5 кг'],
    },
    { key: 'color', label: 'Цвет', type: 'text' },
  ],
};
