import React from "react";

const StatsCards = ({ title, count, icon: Icon }) => {
  return (
    // <div className="bg-green-300 w-40 h-40 rounded-lg">

    <div 
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md
    transition flex flex-col justify-between w-80 h-24 
     border border-gray-200 mt-4
    "
    >
      <div className="p-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium">{title}</h1>
          <Icon />
        </div>
        <h1 className="mt-auto font-bold text-lg">{count}</h1>
      </div>
    </div>
  );
};

export default StatsCards;
