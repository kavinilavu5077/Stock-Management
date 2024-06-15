import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './allequipment.css';
import classnames from 'classnames';
import styles from './allequipment.module.css';
import tableNamesStyles from './tablenames.module.css';
import EquipmentViewer from '../components/allequipmentviewer/allequipmentv';

const Allequipment = () => {
  const [equipmentStatus, setEquipmentStatus] = useState([]);
  const [tableNames, setTableNames] = useState([]);
  const [selectedTableName, setSelectedTableName] = useState(null);
  const [showEquipmentData, setShowEquipmentData] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedEquipmentData, setSelectedEquipmentData] = useState({ tableName: null, equipmentNumber: null, category: null });
  const [showEquipmentViewer, setShowEquipmentViewer] = useState(false);
  

  const TableNamesList = ({ tableNames, onTableClick }) => {
    
    const bearingOnly = tableNames.filter((name) => name.toLowerCase().includes('bearing') && !name.toLowerCase().includes('vibration'));
    const bearingAndHistory = tableNames.filter((name) => name.toLowerCase().includes('bearing') && name.toLowerCase().includes('vibration'));
    const remaining = tableNames.filter((name) => !name.toLowerCase().includes('bearing'));
  
    return (
      <div className={tableNamesStyles.tableNamesList}>
         <h2 className={tableNamesStyles.equipmentNumberDetails}>
        {selectedEquipment} details
      </h2>
        <div className={tableNamesStyles.listContainer}>
          <div className={tableNamesStyles.listSection}>
            <h3 className={tableNamesStyles.listh3} >Bearing</h3>
            <ul>
              {bearingOnly.map((tableName) => (
                <li key={tableName} className={tableNamesStyles.tableNameItem} onClick={() => onTableClick(tableName, selectedEquipment, selectedCategory)}>
                  {tableName}
                </li>
              ))}
            </ul>
          </div>
          <div className={tableNamesStyles.listSection}>
            <h3 className={tableNamesStyles.listh3} >Vibration</h3>
            <ul>
              {bearingAndHistory.map((tableName) => (
                <li key={tableName} className={tableNamesStyles.tableNameItem} onClick={() => onTableClick(tableName, selectedEquipment, selectedCategory)}>
                  {tableName}
                </li>
              ))}
            </ul>
          </div>
          <div className={tableNamesStyles.listSection}>
            <h3 className={tableNamesStyles.listh}>Spares & History</h3>
            <ul>
              {remaining.map((tableName) => (
                <li key={tableName} className={tableNamesStyles.tableNameItem} onClick={() => onTableClick(tableName, selectedEquipment, selectedCategory)}>
                  {tableName}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={tableNamesStyles.backButton} onClick={() => setShowEquipmentData(false)}>
          Back
        </div>
      </div>
    );
  };
  
  

  const handleClick = async (equipmentNumber, category) => {
    try {
      const response = await axios.get(`http://localhost:8800/api/tables/${equipmentNumber}`);
      setTableNames(response.data);
      setSelectedEquipment(equipmentNumber);
      setSelectedCategory(category);
      setShowEquipmentData(true);
    } catch (error) {
      console.error('Error fetching table names:', error);
    }
  };

  const handleTableClick = (tableName, equipmentNumber, category) => {
    setShowEquipmentViewer(true);
    setShowEquipmentData(false);
    setSelectedEquipmentData({ tableName, equipmentNumber, category });
  };

  const handleEvCancel = () => {
    setShowEquipmentData(true);
    setShowEquipmentViewer(false);
  };

  useEffect(() => {
    const fetchEquipmentStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/equipmentcategories');
        setEquipmentStatus(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching equipment categories:', error);
      }
    };

    fetchEquipmentStatus();
  }, []);

  const equipmentViewer = showEquipmentViewer ? (
    <EquipmentViewer
      tableNames={selectedEquipmentData.tableName}
      equipmentNumber={selectedEquipmentData.equipmentNumber}
      category={selectedEquipmentData.category}
      onCancel={handleEvCancel}
    />
  ) : null;
  
  return (
    <>
       <div
      className={classnames(styles.gradientContainer, {
        [styles.gradienttableNameslist]: showEquipmentData,
      })}
    >
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
          <div
              className={classnames(styles.container, {
                [styles.containerTableNamesList]: showEquipmentData,
              })}
            >
              {!showEquipmentData && !showEquipmentViewer && (
                <>
                  <div className="categories-container">
                    {equipmentStatus.map(({ category, equipment_names }) => (
                      <div key={category} className="category-container">
                        <h2 className="category-title">{category}</h2>
                        <div className="heatmap-container custom-heatmap-container">
                          {equipment_names.split(',').map((equipmentNumber) => (
                            <div
                              key={equipmentNumber}
                              className={`heatmap-box dark-green`}
                              onClick={() => handleClick(equipmentNumber, category)}
                            >
                              {equipmentNumber}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {showEquipmentData && !selectedTableName && (
                <>
                
                  <TableNamesList tableNames={tableNames} onTableClick={handleTableClick} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {equipmentViewer}
    </>
  );
  
};

export default Allequipment;
