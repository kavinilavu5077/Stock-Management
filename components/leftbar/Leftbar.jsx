import "./leftbar.scss";
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import {Link} from 'react-router-dom';

const Leftbar = () => {

  const linkstyle = {
    textDecoration: 'none',
    color: 'black',
    cursor: 'pointer',
    display: 'inline-block',
    
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
           <span>Equipments</span>
           <div className="item">
           <LeaderboardOutlinedIcon/>
           <Link to={"/healthstatus"}>
            <span  style={linkstyle}>Analysis</span>
            </Link>
          </div>

           <div className="item">
           <PrecisionManufacturingOutlinedIcon/>
            <Link to={"/newequipment"}>
            <span 
            style={linkstyle}>New Equipment</span>
            </Link>
            </div>

            <div className="item">
           <PrecisionManufacturingOutlinedIcon/>
            <Link to={"/allequipments"}>
            <span 
            style={linkstyle}>All Equipment</span>
            </Link>
            </div>
          
          <div className="item">
          <InfoOutlinedIcon/>
          <Link to={"/viewspares"}>
            <span style={linkstyle}>View Equipment</span>
            </Link>
          </div>
          <div className="item">
          <HistoryOutlinedIcon/>
          <Link to={"/llf"}>
          <span style={linkstyle}>History</span>
          </Link>
          </div>
          
        </div>
        <hr />
        <div className="menu">
          <span>My Section</span>
          <div className="item">
            <EventAvailableOutlinedIcon></EventAvailableOutlinedIcon>
            <span>Events</span>
          </div>
          <div className="item">
             <AssignmentOutlinedIcon/>
            <span>Daily Works</span>
          </div>
         
          <div className="item">
          <MarkEmailUnreadOutlinedIcon/>
            <span>Messages</span>
          </div>
        </div>
        <hr />
       
      </div>
    </div>
  );
};

export default Leftbar;



    
