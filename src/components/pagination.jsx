import React from "react";

const Pagination = ({ page, totalpage, setPage }) => {
  if (totalpage <= 1) return null;

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

        {[...Array(totalpage)].map((_, i) => {
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
          disabled={page === totalpage}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalpage))}
          className="rounded-lg border-2 px-3 py-1 disabled:opacity-40"
        >
          Next
        </button>

        <button
          onClick={() => setPage(totalpage)}
          className="rounded-lg border-2 px-3 py-1"
        >
          Last
        </button>

      </div>
    </div>
  );
};

export default Pagination;