import React, { useState } from "react";
import EquipmentSearch from "../components/equipmentsearch/equipmentsearch";
import EquipmentViewer from "../components/equipmentviewer/equipmentviewer";
import "../App.css";

const Mainvieww = () => {
  const [equipmentNumber, setEquipmentNumber] = useState("");
  const [category, setCategory] = useState("");
  const [showViewer, setShowViewer] = useState(false);

  const handleSearch = (equipmentNumber, category) => {
    setEquipmentNumber(equipmentNumber);
    setCategory(category);
    setShowViewer(true);
  };

  const handleCancel = () => {
    setEquipmentNumber("");
    setCategory("");
    setShowViewer(false);
  };

  return (
    <div>
      <div style={{ paddingTop: "50px" }}>
        {!showViewer && <EquipmentSearch onSearc={handleSearch} />}
        {showViewer && (
          <EquipmentViewer
            equipmentNumber={equipmentNumber}
            category={category}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Mainvieww;

