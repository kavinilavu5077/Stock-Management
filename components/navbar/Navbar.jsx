import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import { Link } from "react-router-dom";


const Navbar = () => {

    return (
        <div className="navbar">
          <div className="left">
            <span>
                MMS
            </span>
            <HomeOutlinedIcon />

            <div className="search">
             <SearchOutlinedIcon />
             <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="right">
           <div className="user">
             <img
              src={"/components/"}
              alt=""
              />
             <span></span>
            </div>
           </div>
        </div>

);
};

export default Navbar;


