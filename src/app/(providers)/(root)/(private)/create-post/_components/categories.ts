export const majorCategories = [
  {value: '', label: '대분류'},
  {value: 'IT', label: 'IT'},
  {value: 'Medi', label: '메디컬'},
  {value: 'Beauty', label: '뷰티'},
];

export const minorCategories: Record<string, {value: string; label: string}[]> = {
  IT: [
    {value: '', label: '소분류'},
    {value: 'Frontend', label: '프론트엔드'},
    {value: 'Backend', label: '백엔드'},
    {value: 'Java', label: '자바'},
    {value: 'Pyhton', label: '파이썬'},
    {value: 'DataEngineer', label: '데이터 엔지니어'},
    {value: 'MachineLearningEngineer', label: '머신러닝 엔지니어'},
    {value: 'SystemNetworkAdministrator', label: '시스템, 네트워크 관리자'},
  ],
};
