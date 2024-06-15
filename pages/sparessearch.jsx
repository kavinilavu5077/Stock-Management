import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './sparessearch.module.css';
import Select from 'react-select';
import SpareDataForm from  '../components/sparedataform/sparedataform.jsx';

const SparesSearch = () => {
  const [categories, setCategories] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [spare, setSpare] = useState('');
  const [outputData, setOutputData] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/spares-categories');
        console.log(response.data);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEquipmentList = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/spares-equipment', {
          params: { category: selectedCategory },
        });
        console.log(response.data);
        setEquipmentList(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedCategory) {
      fetchEquipmentList();
    }
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedEquipment('');
  }, [selectedCategory]);

  const handleSearch = async () => {
    if (spare) {
      try {
        const response = await axios.post('http://localhost:8800/api/search-spares', {
          selectedCategory,
          selectedEquipment,
          spare,
        });
  
        console.log(response.data);
        setOutputData(response.data);
        setShowResults(true);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const handleBackClick = () => {
    setShowResults(false);
  };

  const equipmentOptions = equipmentList.map((equipment) => ({
    value: equipment,
    label: equipment,
  }));

  console.log(selectedCategory);
  if (showResults) {
    return (
      <SpareDataForm
        Opdata={outputData}
        equipmentNumber={selectedEquipment}
        givencategory={selectedCategory}
        onBackClick={handleBackClick}
      />
    );
  }
  return (
    <div className={styles.gradientContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageContent}>
          <div className={styles.container}>
            <div className={styles.formContainer}>
              <h2 className={styles.heading}>Search Spares</h2>
              <div className={styles.labelContainer}>
                <label>Category:</label>
                <div className={styles.selectContainer}>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.labelContainer}>
                <label>Equipment Number:</label>
<div className={styles.selectContainer}>
<Select
value={selectedEquipment ? { value: selectedEquipment, label: selectedEquipment } : null}
onChange={(option) => setSelectedEquipment(option.value)}
options={equipmentOptions}
isDisabled={!selectedCategory}
isSearchable
placeholder="Select an equipment"
/>
</div>
</div>
<div className={styles.labelContainer}>
<label>Spares:</label>
<div className={styles.inputContainer}>
<input
type="text"
value={spare}
onChange={(e) => setSpare(e.target.value)}

/>
</div>
</div>
<button
type="button"
onClick={handleSearch}
disabled={!spare}
>
Search
</button>
</div>
</div>
</div>
</div>
</div>
);

};

export default SparesSearch;
