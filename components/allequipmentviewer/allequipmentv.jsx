import React, { useState, useEffect, useCallback} from "react";
import axios from "axios";
import styles from "./allequipmentv.module.css";
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';

import Papa from 'papaparse';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import EditForm from '../editform/editform';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';





const tooltipTheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1rem', 
          maxWidth: '300px', 
          padding: '8px 16px', 
          backgroundColor: 'royalblue', 
          color: '#fff',           borderRadius: '4px', 
        },
      },
    },
  },
});



const customTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            borderBottomColor: '#e0e0e0',
          },
          '& .MuiDataGrid-row.Mui-even': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#4a148c',
            color: '#ffffff',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(135, 206, 250, 0.3)',
          },
        },
      },
    },
    MuiDataGridColumnHeaderMenu: {
      styleOverrides: {
        root: {
          display: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.6rem',
          fontWeight:'bolder'
          // Adjust the font size for buttons in the GridToolbar
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.7rem', 
          fontWeight: 'bold',// Adjust the font size for input elements in the GridToolbar
        },
      },
    },
  },
});




function convertTableNameToDisplayName(tableName) {
  const words = tableName.split("_");
  const formattedWords = words.map((word) => {
    if (word.length === 1) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return formattedWords.join(" ");
}


const EquipmentViewer = ({ equipmentNumber, category, onCancel,tableNames }) => {
 
  const [equipmentConfiguration, setEquipmentConfiguration] = useState({});
  const [tableData, setTableData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [isDataGrid, setIsDataGrid] = useState(false);

  // Additional states
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputData, setInputData] = useState({});
  const [isInsertMode, setIsInsertMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  console.log('equipmentv category is', category);
  

  useEffect(() => {
    const fetchEquipmentConfiguration = async () => {
      const response = await axios.get("http://localhost:8800/api/equipment/configuration");
      setEquipmentConfiguration(response.data);
    };

    fetchEquipmentConfiguration();
  }, []);
  
  useEffect(() => {
    const fetchColumnNames = async () => {
      const response = await axios.get(`http://localhost:8800/api/columnNames`, {
        params: { tableName: tableNames },
      });
      console.log("hi")
      setColumnNames(response.data);
    };
  
    if (isInsertMode && columnNames.length === 0) {
      fetchColumnNames();
    }
  }, [isInsertMode, columnNames, tableNames]);
  
  
  useEffect(() => {
    if (tableNames) {
      setIsDataGrid(tableNames.includes("bearing") || tableNames.includes("vibration"));
    } else {
      setIsDataGrid(false);
    }
  }, [tableNames]);
  
  
  useEffect(() => {
    fetchTableData();
  }, [tableNames]);
  
  
  const fetchTableData = useCallback(async () => {
    if (tableNames) {
      const [tableDataResponse, columnNamesResponse] = await Promise.all([
        axios.get(`http://localhost:8800/api/tableData`, {
          params: { tableName: tableNames },
        }),
        axios.get(`http://localhost:8800/api/columnNames`, {
          params: { tableName: tableNames },
        }),
      ]);
  
      setTableData(tableDataResponse.data);
      setColumnNames(columnNamesResponse.data);
    }
  }, [tableNames]);
  
  function downloadCSV() {
    const userInput = prompt('Please enter the filename:');
    const filename = userInput ? userInput : 'table_data.csv';

    const csvData = Papa.unparse(tableData);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a hidden anchor element with a download attribute
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);

    // Trigger a click event on the anchor element
    link.click();

    // Clean up: remove the anchor element and revoke the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
 
  const cancel = () => {
    onCancel();
  };

 
  const handleDelete = async (rowIndex) => {
    const rowData = tableData[rowIndex];
    if (rowData.id) {
      await axios.delete("http://localhost:8800/api/tableData", {
        data: {
          tableName: tableNames,
          id: rowData.id,
        },
      });
    }
    fetchTableData();
  };


  const handleInsert = async () => {
    console.log("handleInsert called");
    if (columnNames.length === 0) {
      const columnResponse = await axios.get(`http://localhost:8800/api/columnNames`, {
        params: { tableName: tableNames },
      });
      console.log(columnResponse);
      setColumnNames(columnResponse.data);
    }
  
    let newRowData = columnNames.reduce((acc, columnName) => {
      if (columnName !== "id") {
        acc[columnName] = "";
      }
      console.log(acc);
      return acc;

    }, {});
  
    setInputData({ 0: newRowData });
    setIsEditMode(true);
    setIsInsertMode(true);
  };
  



  const handleInputChange = (e, key, rowIndex) => {
    setInputData({
      ...inputData,
      [rowIndex]: { ...(inputData[rowIndex] || {}), [key]: e.target.value },
    });
  };

  const handleSave = async () => {
    if (Object.keys(inputData).length > 0) {
      for (const rowIndex in inputData) {
        const rowData = inputData[rowIndex];
        if (rowData.id) {
          await axios.put("http://localhost:8800/api/tableData", {
            tableName: tableNames,
            data: rowData,
          });
        } else {
          await axios.post("http://localhost:8800/api/tableData", {
            tableName: tableNames,
            data: rowData,
          });
        }
      }
    }
    setInputData({});
    setIsEditMode(false);
    setIsInsertMode(false);
    fetchTableData();
  };
  const handleCancel = () => {
    setInputData({});
    setIsEditMode(false);
    setIsInsertMode(false);
  };
  const renderInsertMode = () => {
    console.log(category, tableNames, equipmentNumber);
    const currentConfig = equipmentConfiguration[category]?.find(
      (config) => `${equipmentNumber.toLowerCase()}_${config.name.toLowerCase()}` === tableNames.toLowerCase()
    );
    
    
    console.log(currentConfig);
    
  
    return (
      <div className={styles.insertModeContainer}>
        {currentConfig &&
          currentConfig.columns.map((column) =>
            column.name !== "id" ? (
              <div key={column.name} className={styles.dataRow}>
                <div className={styles.dataLabel}>
                  {convertTableNameToDisplayName(column.name)}:
                </div>
                <input
                  className={styles.dataInput}
                  type={column.inputType || "text"}
                  value={inputData[0]?.[column.name] || ""}
                  placeholder={column.name === "changed_at" ? "DD-MM-YYYY" : ""}
                  onChange={(e) => handleInputChange(e, column.name, 0)}
                />
              </div>
            ) : null
          )}
      </div>
    );
  };
  
  
  const handleEdit = (rowIndex) => {
    setInputData({ [rowIndex]: tableData[rowIndex] });
    setIsEditMode(true);
    setIsInsertMode(false);
  };

  
 
  const handledgDelete = async (row) => {
    if (row.id) {
      await axios.delete("http://localhost:8800/api/tableData", {
        data: {
          tableName: tableNames,
          id: row.id,
        },
      });
      fetchTableData();
    } else {
      alert("Unable to delete the row.");
    }
  };
  




  
  const renderDataRowContainer = (row, rowIndex) => {
    const isCurrentRowInEditMode = isEditMode && inputData.hasOwnProperty(rowIndex);
  
    if (isEditMode && !isCurrentRowInEditMode) {
      return null;
    }
    if (isDataGrid) {
      return null;
    }
  
    return (
      <div key={`row-${rowIndex}`} className={styles.dataRowContainer}>
        {Object.entries(row).map(([key, value]) =>
          key !== "id" ? (
            <div key={`${key}-${rowIndex}`} className={styles.dataRow}>
              <div className={styles.dataLabel}>
                {convertTableNameToDisplayName(key)}:
              </div>
              {!isCurrentRowInEditMode ? (
                <div className={styles.dataValue}>{value}</div>
              ) : (
                <input
                  className={styles.dataInput}
                  type="text"
                  value={inputData[rowIndex]?.[key] || ""}
                  onChange={(e) => handleInputChange(e, key, rowIndex)}
                />
              )}
            </div>
          ) : null
        )}
        {!isCurrentRowInEditMode && (
          <div className={styles.rowActionButtons}>
            <button
              className={styles.editButton}
              onClick={() => handleEdit(rowIndex)}
            >
              <EditOutlinedIcon/>
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(rowIndex)}
            >
              <DeleteForeverIcon />
            </button>
          </div>
        )}
      </div>
    );
  };

const [editingRow, setEditingRow] = useState(null);
const handledgEdit = (row) => {
  setEditingRow(row);
};

const handledgSave = async (newRow) => {
  await axios.put("http://localhost:8800/api/tableData", {
    tableName: tableNames,
    data: newRow,
  });
  setTableData(tableData.map((row) => (row.id === newRow.id ? newRow : row)));
  setEditingRow(null);
};


const handledgCancel = () => {
  setEditingRow(null);
};

if (editingRow) {
  return (
    <EditForm data={editingRow} onSubmit={handledgSave} onCancel={handledgCancel} />
  );
}

const wrapCellContentRenderer = (params) => {
  return (
    <ThemeProvider theme={tooltipTheme}>
      <Tooltip title={params.value} placement="left" enterDelay={500} enterNextDelay={500}>
        <div className="wrapCellContent">{params.value}</div>
      </Tooltip>
    </ThemeProvider>
  );
};


const renderDataGrid = () => {
  if (!tableNames || (!tableNames.includes("bearing") && !tableNames.includes("vibration"))) {
    return null;
  }

  const formattedColumns = columnNames.map((columnName) => ({
    field: columnName,
    headerName: convertTableNameToDisplayName(columnName),
    ...(columnNames.length <= 4 ? { flex: 1 } : { minWidth: 150 }),
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'disablePointerEvents',
    renderCell: wrapCellContentRenderer,
    resizable: true,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <ThemeProvider theme={customTheme}>
        <DataGrid
            components={{
              Toolbar: GridToolbar, 
            }}
          columns={[
            {
              field: 'sno',
              headerName: 'S.No',
              ...(columnNames.length <= 4 ? { flex: 1 } : { minWidth: 100 }),
              sortable: false,
              disableColumnMenu: true,
              headerClassName: 'disablePointerEvents',
              resizable: true, // Make the 'S.No' column resizable
              renderCell: (params) => {
                const rowIndex = tableData.findIndex((row) => row.id === params.id) + 1;
                return <div>{rowIndex}</div>;
              },
            },
            ...formattedColumns.filter((column) => column.field !== 'id'),
            {
              field: 'actions',
              headerName: 'Actions',
              ...(columnNames.length <= 4 ? { flex: 1 } : { minWidth: 150 }),
              sortable: false,
              disableColumnMenu: true,
              headerClassName: 'disablePointerEvents',
              resizable: true, // Make the 'Actions' column resizable
              renderCell: (params) => (
                <div>
                <IconButton onClick={() => handledgEdit(params.row)}
                sx={{ marginLeft: -7, color: "inherit",
                 '&:hover': {
                        color: '#4a148c', 
                              backgroundColor: 'transparent',  }, }}>
                  <EditOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => handledgDelete(params.row)}
                 sx={{ marginLeft: -7, color: "inherit",
                 '&:hover': {
                        color: '#4a148c', 
                              backgroundColor: 'transparent',  }, }} >
                  <DeleteForeverIcon />
                </IconButton>
              </div>
              
              ),
            },
          ]}
          rows={tableData}
          disableSelectionOnClick
          style={{ width: "100%", height: "100%" }}
          pageSize={25}
          pagination
          scrollbarSize={10}
          rowHeight={60}
        />
      </ThemeProvider>
    </div>
  );
};


return (
  <div className={styles.gradientContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
        <div className={styles.container}>
          <h2 className={styles.heading}>
            {tableNames &&
              convertTableNameToDisplayName(tableNames)}
          </h2>

          <div
            className={styles.dataContainer}
            style={{
              maxHeight: isEditMode || isInsertMode ? "auto" : "100%",
              overflowY: isEditMode || isInsertMode ? "visible" : "auto",
              overflowX: "hidden",
            }}
          >
            {isInsertMode ? (
              renderInsertMode()
            ) : tableData.length === 0 && !isEditMode ? (
              <div className={styles.emptyTableMessage}>
                No data available for this table.
              </div>
            ) : null}

            {!isInsertMode && renderDataGrid()}

            {!isInsertMode &&
              tableData.map((row, rowIndex) =>
                renderDataRowContainer(row, rowIndex)
              )}

            <div className={styles.buttonContainer}>
              
              {!isEditMode && (
                <div className={styles.actionButtons}>
                  {selectedRows !== null && (
                    <>
                      <button className={styles.insertButton} onClick={handleInsert}>
                        Insert
                      </button>
                      <button className={styles.cancelButton} onClick={cancel}>
                        Close
                      </button>
                      <button className={styles.cancelButton} onClick={downloadCSV}>
                        Download
                      </button>
                    </>
                  )}
                </div>
              )}

              {isEditMode && (
                <div className={styles.saveCancelContainer}>
                  <button className={styles.saveButton} onClick={handleSave}>
                    Save
                  </button>
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

  
};

export default EquipmentViewer;