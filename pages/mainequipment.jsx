

import React, { useState } from 'react';
import EquipmentCreation from '../components/equipmentcreate/equipmentcreate';
import EquipmentForm from '../components/equipmentform/equipmentform';
import '../App.css';

const Main = () => {
  const [equipmentNumber, setEquipmentNumber] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleCreate = (equipmentNumber, category) => {
    setEquipmentNumber(equipmentNumber);
    setCategory(category);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEquipmentNumber('');
    setCategory('');
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ paddingTop: '100px' }}>
      {!showForm && <EquipmentCreation onCreate={handleCreate} />}
      {showForm && (
        <EquipmentForm
          equipmentNumber={equipmentNumber}
          category={category}
          onCancel={handleCancel}
        />
      )}
      </div>
    </div>
  );
};

export default Main;
