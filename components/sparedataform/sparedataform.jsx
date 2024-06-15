import "./sparedataform.css";
import React ,{useState} from 'react';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EquipmentViewer from '../allequipmentviewer/allequipmentv';
import axios from 'axios';

const SpareDataForm = ({ Opdata, equipmentNumber,givencategory, onBackClick }) => {
  const [viewData, setViewData] = useState(false); // Add this state variable
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [tableName, setTableName] = useState(null);
  console.log("givecategory is",givencategory);
 


  if (!Opdata) return null;
  



  const tableStyles = {
    table: {
      background: 'transparent',
      borderCollapse: 'collapse',
      width: '100%',
      tableLayout: 'fixed',
    },
    header: {
      padding: '8px',
      textAlign: 'center',     
      borderBottom: '1px solid #ddd',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #191970, #0000CD, #000080)',  // Same as dataContainer background
      color: 'white',
    },
    cell: {
      height: '150px', // Set a fixed height for cells
      
      
      textAlign: 'left',
      color:'white',
      borderBottom: '1px solid #ddd',
      borderTop: '1px solid #ddd',
      wordWrap: 'break-word',
      fontWeight:'1000',
    },  spareNamesContainer: {
      background: 'linear-gradient(to right, #000080, #0000CD, #483D8B)',
      borderRadius: '5px',
      padding: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      height: '150px',
      marginTop: '-55px',
    },
    rowContainer: {
      background: 'linear-gradient(to right, #000080, #0000CD, #483D8B)',
      padding: '10px',
      marginBottom: '20px',
      marginTop: '20px',
      display: 'flex',
      flexDirection: 'column',
      height: '150px',
      overflowY: 'auto',
      overflowX: 'hidden',
      borderRadius: '10px',
    },
    dataContainer: {
      background: 'linear-gradient(to right, #000080, #0000CD, #483D8B)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      display: 'block',
      width: '100%',
      wordWrap: 'break-word',
      marginBottom: '10px',
    },
    gradientBackground: {
      background: 'linear-gradient(to right, #a8c0ff, #3f2b96)',
      position: 'absolute',
      left: '250px',
      top: '50px',
      width: 'calc(100% - 250px)',
      minHeight: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    contentWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      
    },
    pageContent: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      padding: '20px',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      width: '75%',
    },
   
  };
  const handleCategorySelection = async (equipmentNumber) => {
    if (givencategory) {
      setSelectedCategory(givencategory);
    } else {
      
      try {
        console.log('hi', equipmentNumber);
        const response = await axios.get(`http://localhost:8800/api/getCategoryy/${equipmentNumber}`);
        const category = response.data.category;
        console.log('hi',category);
        if (category) {
          setSelectedCategory(category);
        } else {
          setSelectedCategory();
        }
      } catch (error) {
        console.error('An error occurred while fetching the category:', error.data);
        setSelectedCategory();
      }
    }
  };
  
  const onEquipmentView = async (tableName) => {
    const equipmentNumber = tableName.split('_')[0]; // Slice the first part of the tableName
    console.log(equipmentNumber, tableName);
    await handleCategorySelection(equipmentNumber);
    setTableName(tableName);
    setCurrentEquipment(equipmentNumber);
    setViewData(true); // Set viewData to true when 'View' button is clicked
  };
  const onCancel = () => {
    setCurrentEquipment(null);
    setViewData(false); // Reset viewData to false when onCancel is invoked
  };
  const formatData = (obj, rowIndex) => {
    // Create a copy of the object without the id field
    const { id, ...rest } = obj;
  
    const formattedObj = JSON.stringify(rest, null, 2);
    const lines = formattedObj.split('\n');
    const contentLines = lines.slice(1, lines.length - 1); // Changed to keep brackets on separate lines
  
    return (
      <div key={rowIndex} style={{ marginBottom: '10px' }}>
        <div style={tableStyles.dataContainer}>
          {contentLines.map((line, index) => (
            <pre key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '10px', color: 'white', fontSize: '16px', overflowWrap: 'break-word' }}>
              {line.replace(/,$/, '').replace(/^\s*/, '')}
            </pre>
          ))}
        </div>
      </div>
    );
  };

  if (viewData) {
    return (
      <EquipmentViewer 
        equipmentNumber={currentEquipment} 
        onCancel={onCancel} 
        tableNames= {tableName}
        category={selectedCategory}
      />
    );
  } else {
    return (
      <div>
        <div style={tableStyles.gradientBackground}>
          <div style={tableStyles.contentWrapper}>
            <div style={tableStyles.pageContent}>
              <div style={tableStyles.container}>
                <table style={tableStyles.table}>
                  <colgroup>
                    <col style={{ minWidth: '30%' }} />
                    <col style={{ minWidth: '70%' }} /> {/* Adjusted to occupy full width */}
                  </colgroup>
                  <thead>
                    <tr>
                      <th style={tableStyles.header}>Spare Names</th>
                      <th style={tableStyles.header}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Opdata.filter((tableData) => tableData.data && tableData.data.length > 0)
                      .map((tableData, tableIndex) => {
                        const sortedData = [...tableData.data].sort((a, b) => b.id - a.id);
  
                        return (
                          <tr key={tableIndex}>
                            <td style={tableStyles.cell}>
                              <div style={tableStyles.spareNamesContainer}>{tableData.tableName}</div>
                            </td>
                            <td style={tableStyles.cell}>
                              <div style={tableStyles.rowContainer}>
                                {sortedData.map((item, index) => formatData(item, index))}
                              </div>
                              <button onClick={() => onEquipmentView(tableData.tableName)} className="clickButton">
                                 View
                             </button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                <button onClick={onBackClick} className="backButton"> <ArrowBackOutlinedIcon/></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
 
  }
  
};
export default SpareDataForm;