import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './healthstatus.css';
import styles from './healthstatus.module.css';
import EquipmentDataForm from '../components/healthstatusdata/healthstatusdata.jsx';

const Healthstatus = () => {
  const [equipmentStatus, setEquipmentStatus] = useState([]);
  const [equipmentData, setEquipmentData] = useState(null);
  const [showEquipmentData, setShowEquipmentData] = useState(false);

  const getCriticalityClass = (criticality) => {
    if (criticality === "normal") {
      return 'dark-green'; // Default class if criticality is 'normal'
    }
  
    if (criticality.includes("very critical")) {
      return "dark-red";
    } else if (criticality.includes("critical")) {
      return "light-red";
    } else {
      return "light-green";
    }
  };
  
  const calculateCriticality = (data) => {
    const equipmentCriticality = {};
  
    data.forEach(({ equipmentNumber, criticality }) => {
      let maxCriticality = 'normal';
      criticality.forEach((critValue) => {
        if (critValue === 'Very Critical') {
          maxCriticality = 'very critical';
        } else if (critValue === 'Critical' && maxCriticality !== 'very critical') {
          maxCriticality = 'critical';
        } else if (critValue === 'Dangerous' && maxCriticality === 'normal') {
          maxCriticality = 'dangerous';
        }
      });
      equipmentCriticality[equipmentNumber] = maxCriticality;
    });
  
    return equipmentCriticality;
  };
    
  
  

  const handleClick = async (equipmentNumber) => {
    try {

      const response = await axios.get(`http://localhost:8800/api/equipment-status/${equipmentNumber}`);
      setEquipmentData({equipmentNumber: equipmentNumber, data: response.data});
      setShowEquipmentData(true);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };


  useEffect(() => {
    const fetchEquipmentStatus = async () => {
      try {
        await axios.get('http://localhost:8800/api/updatinghealth');
        const response = await axios.get('http://localhost:8800/api/equipment-status');
        const criticalityLevels = calculateCriticality(response.data);
        console.log(criticalityLevels);
        const processedData = response.data.map((row) => ({
          ...row,
          criticality: criticalityLevels[row.equipmentNumber],
        }));
        setEquipmentStatus(processedData);
      } catch (error) {
        console.error('Error fetching equipment status:', error);
      }
    };

    fetchEquipmentStatus();
  }, []);

  return (
    <div className={`${styles.gradientContainer}`}>
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
        <div className={styles.container}>
          {!showEquipmentData && (
            <>
              
              <div className="heatmap-container">
  {equipmentStatus
    .filter(({ criticality }) => criticality !== 'normal')
    .map(({ equipmentNumber, criticality }) => (
      <div
        key={equipmentNumber}
        className={`heatmap-box ${getCriticalityClass(criticality)}`}
        onClick={() => handleClick(equipmentNumber)}
      >
        {equipmentNumber}
      </div>
    ))}
</div>

              <div className="legend-container">
                <div className="legend-item">
                  <div className="legend-box heatmap-box dark-red"></div>
                  <span className="legend-text">Very Critical</span>
                </div> 
                <div className="legend-item">
                  <div className="legend-box heatmap-box light-red"></div>
                  <span className="legend-text">Critical</span>
                </div>
                <div className="legend-item">
                  <div className="legend-box heatmap-box light-green"></div>
                  <span className="legend-text">Dangerous</span>
                </div>
           
              </div>
            </>
          )}
          {showEquipmentData && (
  <div className={styles.fixedContainer}>
    <EquipmentDataForm
      data={equipmentData.data}
      equipmentNumber={equipmentData.equipmentNumber}
      onBackClick={() => setShowEquipmentData(false)}
    />
  </div>
)}
        </div>
      </div>
    </div>
  </div>
);

  
  
  
};

export default Healthstatus;