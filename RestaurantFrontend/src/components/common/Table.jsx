import React, { useState } from "react";
import Pagination from "./Pagination";
import "./Table.css";

const Table = ({ columns, data, actions, pageSize = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = data.slice(startIndex, startIndex + pageSize);

  return (
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
            {actions?.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={col.header}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {actions?.length > 0 && (
                <td>
                  {actions.map((Action, idx) => (
                    <span key={idx} style={{ marginRight: "8px" }}>
                      {Action(row)}
                    </span>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Table;
