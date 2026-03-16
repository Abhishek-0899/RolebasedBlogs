import { FcEmptyFilter } from "react-icons/fc";
import React, { useState } from "react";

const Filter = ({ onfilterChange }) => {
  const [filterData, setFilterData] = useState([]);
  const [showDropDown, setShowDropDown] = useState(false);

  const filterPost = ["Latest", "A-Z", "Oldest"];

  const handleFilterPost = (filter) => {
    setFilterData(filterData);
    setShowDropDown(false);
    onfilterChange(filter);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropDown((prev) => !prev)}
        className="flex items-center gap-1 rounded-xl border-2 p-2 cursor-pointer"
      >
        <FcEmptyFilter className="w-8 h-8" />
        <h1 className="text-2xl">Filter</h1>
      </button>

      {showDropDown && (
        <div className="absolute mt-2 w-32 shadow-xl bg-white rounded-lg z-10">
          {filterPost.map((filter) => (
            <div
              className="px-4 py-2 cursor-pointer hover:bg-blue-400 hover:text-black font-bold"
              key={filter}
              onClick={() => handleFilterPost(filter)}
            >
              {filter}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
