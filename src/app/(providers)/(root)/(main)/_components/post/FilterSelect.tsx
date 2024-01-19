import React from 'react';

export default function FilterSelect({
  label,
  options,
  onChange,
}: {
  label: string;
  options: string[];
  onChange?: (selectedOption: string) => void;
}) {
  return (
    <select
      className="border-1 border-[#818490] w-[100px] h-8 text-sm text-[#545760] gap-2 font-semibold px-2 rounded-full "
      onChange={e => onChange && onChange(e.target.value)}
    >
      <option>{label}</option>
      {options.map(option => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
