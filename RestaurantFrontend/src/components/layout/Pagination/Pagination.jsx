import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${
            currentPage === 1
              ? 'bg-slate-800/50 text-slate-500 border-slate-600/30 cursor-not-allowed'
              : 'bg-slate-700/60 text-slate-300 border-slate-500/40 hover:bg-slate-600/60 hover:text-white hover:border-slate-400/60 hover:shadow-lg hover:shadow-slate-900/20'
          }
        `}
        disabled={currentPage === 1}
        onClick={() => handleClick(currentPage - 1)}
      >
        <ChevronLeft size={16} />
        <span>Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-slate-400 text-sm font-medium">...</span>
            ) : (
              <button
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 border
                  ${
                    currentPage === page
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white border-primary-400/50 shadow-lg shadow-primary-500/20'
                      : 'bg-slate-700/60 text-slate-300 border-slate-500/40 hover:bg-slate-600/60 hover:text-white hover:border-slate-400/60 hover:shadow-lg hover:shadow-slate-900/20'
                  }
                `}
                onClick={() => handleClick(page)}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${
            currentPage === totalPages
              ? 'bg-slate-800/50 text-slate-500 border-slate-600/30 cursor-not-allowed'
              : 'bg-slate-700/60 text-slate-300 border-slate-500/40 hover:bg-slate-600/60 hover:text-white hover:border-slate-400/60 hover:shadow-lg hover:shadow-slate-900/20'
          }
        `}
        disabled={currentPage === totalPages}
        onClick={() => handleClick(currentPage + 1)}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
