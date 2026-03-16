import React from "react";

const Pager = ({ page, totalpage = 1, setPage }) => {
  if (totalpage <= 1) return null;

  const totalPages = Math.max(1, totalpage); // always >=1

  return (
    <div className="flex justify-center items-center mt-6">
      <div className="flex gap-3">

        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="rounded-lg border-2 px-3 py-1 disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`rounded-lg border-2 px-3 py-1 ${
                page === pageNumber ? "bg-blue-500 text-white" : ""
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="rounded-lg border-2 px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>

        <button
          onClick={() => setPage(totalPages)}
          className="rounded-lg border-2 px-3 py-1"
        >
          Last
        </button>

      </div>
    </div>
  );
};

export default Pager;