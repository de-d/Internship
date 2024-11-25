import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import styles from "./Table.module.scss";

export interface GameResult {
  date: string;
  time: number;
  errors: number;
  level: string;
  score: number;
}

function ResultsTable() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof GameResult>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useContext(AppContext)!;

  useEffect(() => {
    const storedResults = JSON.parse(sessionStorage.getItem("gameResults") || "[]");
    const sortedResults = [...storedResults].sort((a, b) => (a.date < b.date ? 1 : -1));
    setResults(sortedResults);
  }, []);

  const sortResults = (column: keyof GameResult) => {
    const order = column === sortColumn && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...results].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });
    setSortColumn(column);
    setSortOrder(order);
    setResults(sorted);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const filteredResults = results.filter(
    (result) =>
      result.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.time.toString().includes(searchQuery) ||
      result.errors.toString().includes(searchQuery) ||
      result.score.toString().includes(searchQuery)
  );

  const determineHighlightedColumn = () => {
    if (!searchQuery.trim()) return "";
    const matchedColumns = Object.keys(results[0] || {}).filter((key) =>
      results.some((result) => result[key as keyof GameResult]?.toString().toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchedColumns.length === 1 ? (matchedColumns[0] as keyof GameResult) : "";
  };

  const highlightedColumn = determineHighlightedColumn();
  const paginatedResults = filteredResults.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className={`${styles.results} ${theme === "Dark" ? styles.results__darkMode : ""}`}>
      <div className={styles.results__search}>
        <label>
          Поиск:
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по дате, уровню, времени, ошибкам, счету"
            title="Поиск по дате, уровню, времени, ошибкам, счету"
          />
        </label>
      </div>
      <table className={styles.results__table}>
        <thead>
          <tr>
            <th onClick={() => sortResults("date")} className={sortColumn === "date" || highlightedColumn === "date" ? styles.active : ""}>
              Дата и время {sortColumn === "date" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => sortResults("level")} className={sortColumn === "level" || highlightedColumn === "level" ? styles.active : ""}>
              Уровень {sortColumn === "level" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => sortResults("time")} className={sortColumn === "time" || highlightedColumn === "time" ? styles.active : ""}>
              Время прохождения {sortColumn === "time" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => sortResults("errors")} className={sortColumn === "errors" || highlightedColumn === "errors" ? styles.active : ""}>
              Ошибки {sortColumn === "errors" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th onClick={() => sortResults("score")} className={sortColumn === "score" || highlightedColumn === "score" ? styles.active : ""}>
              Счет {sortColumn === "score" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedResults.length > 0 ? (
            paginatedResults.map((result, index) => (
              <tr key={index}>
                <td>{result.date}</td>
                <td>{result.level}</td>
                <td>{result.time} сек</td>
                <td>{result.errors}</td>
                <td>{result.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Нет результатов</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.results__pagination}>
        {Array.from({ length: Math.ceil(filteredResults.length / rowsPerPage) }, (_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)} className={currentPage === i + 1 ? styles.active : ""}>
            {i + 1}
          </button>
        ))}
      </div>
      <div className={styles.results__rowsPerPage}>
        <label>
          Строк на странице:
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default ResultsTable;
