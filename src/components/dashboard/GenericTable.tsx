// src\components\dashboard\GenericTable.tsx
import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";

interface ColumnWithAccessor<T> {
  title: string;
  accessor: keyof T;
}

interface ColumnWithRender<T> {
  title: string;
  render: (item: T) => React.ReactNode;
}

export type Column<T> = ColumnWithAccessor<T> | ColumnWithRender<T>;

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  rowsPerPage?: number; // Number of rows per page
}

const GenericTable = <T extends Record<string, unknown>>({
  data,
  columns,
  isLoading = false,
  rowsPerPage = 5, // Default to 10 rows per page
}: GenericTableProps<T>) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sortedData, setSortedData] = useState<T[]>(data);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error("Expected 'data' to be an array but received:", data);
      setSortedData([]);
      return;
    }

    const filteredData = data.filter((item) =>
      columns.some((column) =>
        "accessor" in column && typeof column.accessor === "string"
          ? (item[column.accessor]?.toString()?.toLowerCase() || "").includes(
              searchValue.toLowerCase()
            )
          : false
      )
    );

    setSortedData(filteredData);
    setCurrentPage(1); // Reset to page 1 after filtering
  }, [data, searchValue, columns]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const getValueByAccessorOrRender = (
    column: Column<T>,
    item: T
  ): React.ReactNode => {
    if ("render" in column && typeof column.render === "function") {
      return column.render(item);
    }

    if ("accessor" in column && typeof column.accessor === "string") {
      const keys = column.accessor.split(".");
      let result: unknown = item;

      for (const key of keys) {
        if (
          result &&
          typeof result === "object" &&
          key in (result as Record<string, unknown>)
        ) {
          result = (result as Record<string, unknown>)[key];
        } else {
          return "-";
        }
      }

      if (
        result !== undefined &&
        (typeof result === "string" || typeof result === "number")
      ) {
        return result.toString();
      }
    }

    return "N/A";
  };

  const handleSort = (accessor: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === accessor &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    const sorted = [...sortedData].sort((a, b) => {
      const aValue = a[accessor];
      const bValue = b[accessor];
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
    setSortConfig({ key: accessor, direction });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-start">
        <input
          type="text"
          placeholder="بحث"
          value={searchValue}
          onChange={handleSearchChange}
          className={`p-2 border rounded-lg outline-none  ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-gray-200 text-black border-gray-300"
          }`}
        />
      </div>

      <table
        className={`min-w-full border border-transparent ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } rounded-xl shadow-xl overflow-hidden`}
      >
        <thead>
          <tr
            className={`${
              isDarkMode
                ? "bg-gradient-to-r from-gray-700 to-gray-800 text-white"
                : "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900"
            }`}
          >
            {columns.map((column, index) => (
              <th
                key={index}
                onClick={() =>
                  "accessor" in column && handleSort(column.accessor)
                }
                className={`py-3 px-6 text-center text-sm font-medium uppercase tracking-wider cursor-pointer 
            transition-all duration-300 ease-in-out transform hover:bg-gray-300 dark:hover:bg-gray-700 
            hover:scale-105`}
              >
                {column.title}
                {"accessor" in column &&
                  sortConfig?.key === column.accessor &&
                  (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-gray-500"
              >
                جارٍ التحميل...
              </td>
            </tr>
          ) : paginatedData.length > 0 ? (
            paginatedData.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={`${
                  rowIndex % 2 === 0
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-gradient-to-r from-gray-50 to-gray-100"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-white"
                } hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-105`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-4 px-6 border-b border-gray-200 text-center text-sm ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {getValueByAccessorOrRender(column, item)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-sm text-gray-500"
              >
                لا توجد بيانات لعرضها
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          السابق
        </button>
        <span className="text-sm">
          صفحة {currentPage} من {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default GenericTable;
