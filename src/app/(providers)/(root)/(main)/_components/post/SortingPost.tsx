import React from 'react';

export default function SortingPost() {
  return (
    <div className="w-72 flex justify-end gap-2">
      <select className="border-2 border-[#eee] h-10 text-sm p-2 rounded-lg">
        <option>정렬1</option>
      </select>
      <select className="border-2 border-[#eee] h-10 text-sm p-2 rounded-lg">
        <option>정렬2</option>
      </select>
      <select className="border-2 border-[#eee] h-10 text-sm p-2 rounded-lg">
        <option>정렬3</option>
      </select>
    </div>
  );
}
