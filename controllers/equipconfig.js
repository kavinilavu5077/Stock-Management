const equipmentconfiguration = {
    conveyor: [
      { name: 'head_pulley', columns: ['type', 'stock', 'material_code'] },
      { name: 'tail_pulley', columns: ['type', 'stock', 'material_code'] },
      { name: 'bend_pulley', columns: ['type', 'stock', 'material_code'] },
    ],
    idfan: [
      { name: 'fan_blades', columns: ['type', 'stock', 'material_code'] },
      { name: 'fan_housing', columns: ['type', 'stock', 'material_code'] },
    ],
  };

  export const equipmentConfiguration= async (req,res) =>{

    res.json(equipmentconfiguration);

  };