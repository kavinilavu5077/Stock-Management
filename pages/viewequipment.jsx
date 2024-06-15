// components/ViewEquipment/ViewEquipment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './viewequipment.module.css';

function convertTableNameToDisplayName(tableName) {
  const words = tableName.split('_');
  const formattedWords = words.map((word) => {
    if (word.length === 1) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return formattedWords.join(' ');
}

const ViewEquipment = ({ equipmentNumber, category, onCancel }) => {
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [tableNames, setTableNames] = useState([]);
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/equipment/${equipmentNumber}/${category}/tables`
        );
        setTableNames(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTableNames();
  }, [equipmentNumber, category]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (tableNames.length > 0) {
        try {
          const tableName = tableNames[currentTableIndex];
          const response = await axios.get(
            `http://localhost:8800/api/equipment/data/${tableName}`
          );
          setFormData(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchTableData();
  }, [tableNames, currentTableIndex]);

  const handlePrevTable = () => {
    setCurrentTableIndex(currentTableIndex - 1);
  };

  const handleNextTable = () => {
    setCurrentTableIndex(currentTableIndex + 1);
  };

  const handleUpdateData = async () => {
    try {
      const tableName = tableNames[currentTableIndex];
      await axios.put(`http://localhost:8800/api/equipment/data/${tableName}`, formData);
      alert('Table data updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedFormData = [...formData];
    updatedFormData[index] = { ...updatedFormData[index], [field]: value };
    setFormData(updatedFormData);
  };

  const currentTableName = tableNames[currentTableIndex];

  return (
    <div className={styles.container}>
      <h2>{currentTableName && convertTableNameToDisplayName(currentTableName)}</h2>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Stock</th>
              <th>Material Code</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((row, index) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <input
                    type="text"
                    value={row.type}
                    onChange={(e) =>
                      handleInputChange(index, 'type', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.stock}
                    onChange={(e) =>
                      handleInputChange(index, 'stock', e.target.value)
                    }
                  />
                </td>
               
                        <td>
                        <input
                          type="text"
                          value={row.material_code}
                          onChange={(e) =>
                            handleInputChange(index, 'material_code', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.buttons}>
              <button onClick={handlePrevTable} disabled={currentTableIndex === 0}>
                Previous
              </button>
              <button onClick={handleNextTable} disabled={currentTableIndex === tableNames.length - 1}>
                Next
              </button>
              <button onClick={handleUpdateData}>
                Save
              </button>
              <button onClick={onCancel}>
                Cancel
              </button>
            </div>
          </div>
        );
      };
      
      export default ViewEquipment;
      
