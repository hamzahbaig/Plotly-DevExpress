import React from "react";
import "./NavBar.scss";

const NavBar = (props) => {
  const { dashBoardCurrentItem, dashBoardItems, updateItem } = props;
  return (
    <div className="NavBar">
      <h1>Research and Dev.</h1>
      <p>Dev Express Data Grid</p>
      <ul>
        {dashBoardItems.map((item, index) => (
          <li
            key={index}
            id = {index}
            onClick={updateItem}
            className={dashBoardCurrentItem == index ? "selected" : ""}
          >
            <span className="navAnchor">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavBar;
