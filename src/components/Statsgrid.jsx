import React from "react";
import StatsCards from "./StatsCards";

const Statsgrid = ({ stats }) => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {stats.map((card) => (
        <StatsCards key={card.title} {...card} />
      ))}
    </div>
  );
};

export default Statsgrid;
