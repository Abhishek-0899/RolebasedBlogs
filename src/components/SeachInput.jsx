import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchBar = ({value,onChange}) => {
  return (
    <div className="flex border-2 p-3 justify-center items-center gap-4 rounded-lg">
      <BsSearch className="ml-2" />
      <input
       className=" w-full outline-none"
       value={value}
       onChange={onChange}
        type="text" placeholder="Search posts..." />
    </div>
  );
};

export default SearchBar;
