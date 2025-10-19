import React, { useState, useEffect } from 'react';
import Pagination from '../../layout/Pagination/Pagination';

const Table = ({ columns, data, actions, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);

  const totalPages = Math.ceil(data.length / currentPageSize);

  // ✅ Ensure currentPage is valid when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages); // Go back to last available page
    }
    if (totalPages === 0) {
      setCurrentPage(1); // Reset if no data
    }
  }, [data.length, currentPageSize, totalPages, currentPage]);

  // Reset to page 1 when page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentPageSize]);

  const startIndex = (currentPage - 1) * currentPageSize;
  const currentData = data.slice(startIndex, startIndex + currentPageSize);

  // Generate page size options (5, 10, 15, 20, 25, 30, 35, 40, 45, 50)
  const pageSizeOptions = Array.from({ length: 10 }, (_, i) => (i + 1) * 5);

  const handlePageSizeChange = (newPageSize) => {
    setCurrentPageSize(parseInt(newPageSize));
  };

  return (
    <div className="w-full mt-6 flex flex-col max-h-[75vh] rounded-xl relative overflow-visible bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 shadow-2xl shadow-black/20">
      {/* Scrollable container */}
      <div className="overflow-x-auto overflow-y-visible flex-1 max-h-inherit rounded-xl relative z-10">
        <table className="w-full border-collapse border-spacing-0 bg-transparent relative overflow-visible z-10">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className="sticky top-0 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-sm z-20 px-6 py-5 text-left border-b border-slate-600/40 font-semibold text-white !text-white text-base tracking-normal"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
                    {col.header}
                  </div>
                </th>
              ))}
              {actions?.length > 0 && (
                <th className="sticky top-0 bg-gradient-to-b from-slate-800 to-slate-900 backdrop-blur-sm z-20 px-6 py-5 text-left border-b border-slate-600/40 font-semibold text-white !text-white text-base tracking-normal">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-red-400 to-red-600 rounded-full"></div>
                    Actions
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="group transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-700/40 hover:to-slate-600/40 border-b border-slate-700/20 last:border-b-0 hover:shadow-lg hover:shadow-slate-900/20"
              >
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className="px-6 py-5 border-0 text-slate-300 font-medium relative group-hover:text-white transition-colors duration-200"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {actions?.length > 0 && (
                  <td className="px-6 py-5 border-0 text-slate-300 font-medium relative group-hover:text-white transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      {actions.map((Action, idx) => (
                        <div
                          key={idx}
                          className="transform group-hover:scale-105 transition-transform duration-200"
                        >
                          {Action(row)}
                        </div>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-0 flex flex-col gap-4 bg-gradient-to-r from-slate-900/60 to-slate-800/60 backdrop-blur-sm px-6 py-4 border-t border-slate-600/40 rounded-b-2xl relative z-10">
        <div className="flex justify-between items-center">
          <div className="text-slate-400 text-sm">
            Showing {startIndex + 1} to {Math.min(startIndex + currentPageSize, data.length)} of{' '}
            {data.length} users
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Show:</span>
            <select
              value={currentPageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="bg-slate-700/60 border border-slate-500/40 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-400/50 transition-all duration-200"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size} className="bg-slate-700 text-white">
                  {size}
                </option>
              ))}
            </select>
            <span className="text-slate-400 text-sm">per page</span>
          </div>
        </div>
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Table;
