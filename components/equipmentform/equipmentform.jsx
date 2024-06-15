import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from  "./equipmentform.module.css";

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



const EquipmentForm = ({ equipmentNumber, category, onCancel }) => {
  const [currentTableIndex, setCurrentTableIndex] = useState(0);
  const [tableNames, setTableNames] = useState([]);
  const [equipmentConfiguration, setEquipmentConfiguration] = useState({});
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  
  
  useEffect(() => {
    const fetchEquipmentConfiguration = async () => {
      const response = await axios.get("http://localhost:8800/api/equipment/configuration");
      setEquipmentConfiguration(response.data);
    };

    fetchEquipmentConfiguration();
  }, []);

  useEffect(() => {
    if (category && equipmentConfiguration[category]) {
      setTableNames(equipmentConfiguration[category].map((table) => `${equipmentNumber}_${table.name}`));
    }
  }, [category, equipmentNumber, equipmentConfiguration]);
  
  const cancel = () => {
    onCancel();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tableName = tableNames[currentTableIndex];
   
    try {
      await axios.post('http://localhost:8800/api/equipment/data', { tableName, formData });
      setMessage('Details have been registered and moving on to next spare details');
    setTimeout(() => {
      setMessage(''); // Clear the message after 2 seconds (2000 ms)
    }, 2000);
      setFormData({});
       if (currentTableIndex + 1 === tableNames.length) {
        setMessage('All spares related to this equipment have been entered.');
        setTimeout(() => {
          cancel();
        }, 3000); // Wait 3 seconds before navigating back
      } else {
        setCurrentTableIndex(currentTableIndex + 1);
      }
    } catch (error) {
      // Handle errors in form submission
    }
  };

  
  const currentTableConfiguration = equipmentConfiguration[category] && equipmentConfiguration[category][currentTableIndex];

  return (
    <div className={styles.gradientContainer}>
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
    
      <div className={styles.container} >
        <div className={styles.formContainer}>
        <h2 className={styles.heading}>
  {currentTableConfiguration?.name && convertTableNameToDisplayName(currentTableConfiguration.name)}
</h2>
          
           
{currentTableConfiguration && (
  <form onSubmit={handleSubmit}>
    {currentTableConfiguration.columns.map((column) => (
      <div key={column.name} className={styles.labelContainer}>
        <label>{convertTableNameToDisplayName(column.name)}:</label>
        <div className={styles.inputContainer}>
          {column.type === "DATE" ? (
            <input
              type="DATE"
              value={formData[column.name] || ''}
              onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
            />
          ) : column.name === "reason" ? (
            <>
            <textarea
              value={formData[column.name] || ''}
              onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
              rows="5"
              maxLength="250"
              style={{width: '100%', borderRadius: '4px'}}
            />
            <p className={styles.charCounter}>
              {formData[column.name] ? formData[column.name].length : 0}/250 characters
            </p>
          </>
          ) : (
            <input
              type="text"
              value={formData[column.name] || ''}
              onChange={(e) => setFormData({ ...formData, [column.name]: e.target.value })}
            />
          )}
        </div>
      </div>
    ))}
    <div className={styles.buttonContainer}>
      <button className={styles.submitButton} type="submit">Submit</button>
      <button className={styles.cancelButton} onClick={cancel}>Cancel</button>
    </div>
  </form>
)}


          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
      </div></div></div>
  );
};

export default EquipmentForm;
