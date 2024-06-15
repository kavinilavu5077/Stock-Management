import React from 'react';
import styles from './healthstatusdata.module.css';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';


const EquipmentDataForm = ({ data,equipmentNumber, onBackClick }) => {
  if (!data) return null;

  return (
    <div className={styles.gradientContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageContent}>
          <div className={styles.container}>
            <div className={styles.formContainer}>
              <h2 className={styles.heading}>{equipmentNumber} Data</h2>
              
              <div className={styles.table}>
               
              <div className={`${styles.cell} ${styles.header}`}>Issue</div>
                <div className={`${styles.cell} ${styles.header}`}>Parts</div>
                <div className={`${styles.cell} ${styles.header}`}>Description</div>
                <div className={`${styles.cell} ${styles.header}`}>Criticality</div>
               
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    
                    <div className={styles.cell}>{item.issue}</div>
                    <div className={styles.cell}>{item.part}</div>
                    <div className={styles.cell}>{item.description}</div>
                    <div className={styles.cell}>{item.criticality}</div>
                   
                  </React.Fragment>
                ))}
              </div>
              <button className={styles.cancelButton} onClick={onBackClick}>
              <ArrowBackOutlinedIcon/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDataForm;