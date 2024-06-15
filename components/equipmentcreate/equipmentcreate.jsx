import React, { useState } from 'react';
import axios from "axios";
import styles from  "./equipmentcreate.module.css";


const EquipmentCreation = ({ onCreate }) => {
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const resetForm = () => {
    setMessage('');
    setEquipmentNumber('');
    setCategory('');
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if(!equipmentNumber || !category) {
      setMessage('Please enter both the Equipment Number and Category');
      setTimeout(() => {
      resetForm();
    }, 3000);
      return;
  }
    try {
      const response = await axios.get('http://localhost:8800/api/equipment/exists', {
        params: { equipmentNumber, category },
      });

      if (response.data.exists) {
        setMessage('Equipment already exists');
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        await axios.post('http://localhost:8800/api/equipment/tables', { equipmentNumber, category });
        console.log('Tables created');
        onCreate(equipmentNumber, category);
        const equipmentListResponse = await axios.post('http://localhost:8800/api/equipment-list/add', { equipmentNumber, category });
        console.log('Equipment added to the equipment list:', equipmentListResponse.data);
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
    <h2 className={styles.heading}>New Equipment</h2>
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
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              <option value="conveyor">Belt Conveyor</option>
              <option value="idfan">ID Fan</option>
              <option value="ral">RAL</option>
            </select>
          </div>
        </div>
        
        <button type="submit">Add</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  </div>
  </div>
  </div> 
  </div>    
    );
};
export default EquipmentCreation;
