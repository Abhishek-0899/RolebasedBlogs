import React from "react";

const Header = () => {
  return (
    <div className="w-full text-center px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Latest Posts
      </h1>

      <p className="mt-2 text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
        Discover the newest content from our authors
      </p>

      <hr className="mt-6 border-gray-200" />
    </div>
  );
};

export default Header;