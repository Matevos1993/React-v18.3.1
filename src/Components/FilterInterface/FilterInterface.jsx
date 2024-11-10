import React, { useState, useEffect, useCallback, memo } from "react";

import "./FilterInterface.scss";

const FilterInterface = () => {
  const initialData = [
    { id: 1, name: "John Doe", selected: true },
    { id: 2, name: "John Doe", selected: true },
    { id: 3, name: "John Doe", selected: true },
    { id: 4, name: "John Doe", selected: true },
    { id: 5, name: "Jane Smith", selected: true },
    { id: 6, name: "Alice Johnson", selected: true },
    { id: 7, name: "Bob Brown", selected: true },
  ];

  const [data, setData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [isSelectAll, setIsSelectAll] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [sortOrder, setSortOrder] = useState("unsorted");

  useEffect(() => {
    const sortedData = [...data]
      .filter((row) => row.name.toLowerCase().includes(query.toLowerCase()))
      .map((row) => ({ ...row, visible: row.selected }))
      .sort((a, b) => {
        if (sortOrder === "unsorted") return 0;
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });

    setFilteredData(sortedData);
  }, [data, query, sortOrder]);

  const handleSearch = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleSelectAll = useCallback((e) => {
    const checked = e.target.checked;
    setIsSelectAll(checked);
    setData((prevData) =>
      prevData.map((row) => ({
        ...row,
        selected: checked,
        visible: checked,
      }))
    );
  }, []);

  const handleSelectRow = useCallback((id) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.id === id
          ? {
              ...row,
              selected: !row.selected,
              visible: row.selected,
            }
          : row
      )
    );
  }, []);

  const handleSort = useCallback(() => {
    setSortOrder((prevOrder) => {
      switch (prevOrder) {
        case "unsorted":
          return "asc";
        case "asc":
          return "desc";
        default:
          return "unsorted";
      }
    });
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        setData((prevData) =>
          prevData.map((row) => ({
            ...row,
            selected: row.name.toLowerCase().includes(query.toLowerCase()),
          }))
        );
        setQuery("");
        setShowTable(false);
      }
    },
    [query]
  );

  const toggleTableVisibility = useCallback(() => {
    setShowTable((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest("input")) {
      setShowTable(false);
    }
  }, []);

  const renderSortButton = useCallback(() => {
    const buttonStyles = {
      opacity: 1,
      transition: "opacity 0.3s ease",
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translate(0, -50%)",
    };

    const labels = {
      unsorted: "Name",
      asc: "Name↑",
      desc: "Name↓",
    };

    return (
      <button onClick={handleSort} className="sort-button">
        {Object.entries(labels).map(([key, label]) => (
          <span
            key={key}
            style={{
              ...buttonStyles,
              opacity: sortOrder === key ? 1 : 0,
            }}>
            {label}
          </span>
        ))}
      </button>
    );
  }, [sortOrder, handleSort]);

  return (
    <div className="search-box" onClick={handleClickOutside}>
      <div className="sort-button-container">{renderSortButton()}</div>

      <div className="input-container">
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onClick={(e) => {
              e.stopPropagation();
              toggleTableVisibility();
            }}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            className="input"
          />
          <button onClick={toggleTableVisibility} className="toggle-button">
            {showTable ? "▲" : "▼"}
          </button>
        </div>
        <div
          className="datalist-container"
          style={{
            maxHeight: showTable ? "100px" : "0",
            opacity: showTable ? "1" : "0",
            transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
          }}>
          <ul className="datalist">
            <li className="datalist-item">
              <input
                type="checkbox"
                checked={isSelectAll}
                onChange={handleSelectAll}
                className="checkbox"
              />
              Select All
            </li>
            {filteredData.map((row) => (
              <li key={row.id} className="datalist-item">
                <input
                  type="checkbox"
                  checked={row.selected}
                  onChange={() => handleSelectRow(row.id)}
                  className="checkbox"
                />
                {row.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <tbody>
            {filteredData.map(
              (row) =>
                row.visible && (
                  <tr key={row.id} style={{ transition: "all 0.3s ease" }}>
                    <td>
                      <input type="checkbox" onChange={() => {}} />
                    </td>
                    <td>{row.name}</td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default memo(FilterInterface);
