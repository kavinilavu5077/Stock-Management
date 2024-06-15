import React, { useState } from "react";
import styles from "./equipmentsearch.module.css";
import axios from 'axios';
import Papa from 'papaparse';


const EquipmentSearch = ({ onSearc }) => {
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState("");
  const [message, setMessage] = useState('');
  const resetForm = () => {
    setMessage('');
    setEquipmentNumber('');
    setCategory('');
  };


  function downloadCSV() {
    const userInput = prompt('Please enter the filename:');
    const filename = userInput ? userInput : 'table_data.csv';

    const csvData = Papa.unparse(data);
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

  const handledownload = async (event) => {
    event.preventDefault();
    if (!equipmentNumber) {
      setMessage('Please enter both the Equipment Number and Category');
      setTimeout(() => {
        resetForm();
      }, 3000);
      return;
    }
    try {
      const response = await axios.get('http://localhost:8800/api/equipment/checkNumber', {
        params: { equipmentNumber },
      });
  
      if (response.data.notExists) { 
        setMessage('No equipment found. Please check the equipment number that you have entered');
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        const response = await axios.get('http://localhost:8800/api/specificequipment', {
        params: { equipmentNumber },
      });
      setData(response.data);
      downloadCSV();
      }
    } 
     
   catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!equipmentNumber || !category) {
      setMessage('Please enter both the Equipment Number and Category');
      setTimeout(() => {
        resetForm();
      }, 3000);
      return;
    }
    try {
      const response = await axios.get('http://localhost:8800/api/equipment/checkNumber', {
        params: { equipmentNumber },
      });
  
      if (response.data.notExists) { 
        setMessage('No equipment found. Please check the equipment number that you have entered');
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        onSearc(equipmentNumber, category);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
 
  return (
    <div className={styles.gradientContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Search Equipment</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.labelContainer}>
            <label>Equipment Number:</label>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={equipmentNumber}
                onChange={(e) => setEquipmentNumber(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.labelContainer}>
            <label>Category:</label>
            <div className={styles.selectContainer}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="conveyor">Belt Conveyor</option>
                <option value="idfan">ID Fan</option>
              </select>
            </div>
          </div>
          <button type="submit" className={styles.button}>Search</button>
          <button className={styles.button} onClick={handledownload}>Download</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div></div></div></div>
  );
};

export default EquipmentSearch;