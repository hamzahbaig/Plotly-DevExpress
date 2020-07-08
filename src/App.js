import React from "react";
import logo from "./logo.svg";
import "./App.css";

import "./skeleton.css";
import "./styles.scss";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";

import NavBar from "./components/NavBar/NavBar";
import DataGridComponent from "./components/LocalDataGrid/LocalDataGrid";
import LineChart from "./components/LineChart/LineChart";
import D3Testing from "./components/D3.js/D3Testing";
import PlotlyChart from "./components/PlotlyChart/PlotlyChart";
class App extends React.Component {
  state = {
    dashBoardCurrentItem: 0,
    dashBoardItems: ["Local Data Grid", "Axis Break", "Plotly Chart"],
  };
  updateItem = (e) => {
    this.setState({ dashBoardCurrentItem: e.target.getAttribute("id") });
  };
  render() {
    let renderComponent;
    if (this.state.dashBoardCurrentItem == 2) {
      renderComponent = <DataGridComponent />;
    } else if (this.state.dashBoardCurrentItem == 1) {
      renderComponent = <LineChart />;
    } else if (this.state.dashBoardCurrentItem == 0) {
      renderComponent = <PlotlyChart />;
    }
    return (
      <React.StrictMode className="container">
        <div className="two columns">
          <div className="row">
            <NavBar
              dashBoardCurrentItem={this.state.dashBoardCurrentItem}
              dashBoardItems={this.state.dashBoardItems}
              updateItem={this.updateItem}
            ></NavBar>
          </div>
        </div>
        <div className="ten columns previewPane">
          <div className="row">{renderComponent}</div>
        </div>
      </React.StrictMode>
    );
  }
}

export default App;
