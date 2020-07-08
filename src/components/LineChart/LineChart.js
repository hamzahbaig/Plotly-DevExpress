import React from "react";
import Chart, {
  Legend,
  Series,
  Tooltip,
  ValueAxis,
  ArgumentAxis,
  Break,
} from "devextreme-react/chart";

import SelectBox from "devextreme-react/select-box";
import CheckBox from "devextreme-react/check-box";

import { dataSource } from "./data.js";
const lineStyles = ["waved", "straight"];
const breaksCount = [1, 2, 3, 4];

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoBreaksEnabledValue: true,
      breaksCountValue: 3,
      lineStyleValue: lineStyles[0],
      canvas: null,
      ctx: null,
      rect: {},
      drag: false,
    };

    this.changeBreaksCount = (e) => {
      this.setState({
        breaksCountValue: e.value,
      });
    };

    this.changeStyle = (e) => {
      this.setState({
        lineStyleValue: e.value,
      });
    };

    this.changeBreaksEnabledState = (e) => {
      this.setState({
        autoBreaksEnabledValue: e.value,
      });
    };
  }

  
  render() {
    return (
      <div>
        <div className="demo-container">
          <Chart
            id="chart"
            title={"Relative Masses of the Heaviest\n Solar System Objects"}
            dataSource={dataSource}
          >
            <Series valueField="mass" argumentField="name" type="line" />
            <ValueAxis
              visible={true}
              autoBreaksEnabled={this.state.autoBreaksEnabledValue}
              maxAutoBreakCount={this.state.breaksCountValue}
              breakStyle={{ line: this.state.lineStyleValue, color: "red" }}
            ></ValueAxis>
            <ArgumentAxis
              visible={true}
              breakStyle={{ line: this.state.lineStyleValue, color: "red" }}
              breaks={[{ startValue: 65, endValue: 420 }]}
            ></ArgumentAxis>
            <Legend visible={false} />
            <Tooltip enabled={true} />
          </Chart>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              className="checkbox"
              text="Enable Breaks"
              onValueChanged={this.changeBreaksEnabledState}
              value={this.state.autoBreaksEnabledValue}
            ></CheckBox>
          </div>
          &nbsp;
          <div className="option center">
            <span>Max Count </span>
            <SelectBox
              items={breaksCount}
              value={this.state.breaksCountValue}
              onValueChanged={this.changeBreaksCount}
              width={60}
            ></SelectBox>
          </div>
          &nbsp;
          <div className="option right">
            <span>Style </span>
            <SelectBox
              items={lineStyles}
              value={this.state.lineStyleValue}
              onValueChanged={this.changeStyle}
              width={120}
            ></SelectBox>
          </div>
        </div>
      </div>
    );
  }
}

export default LineChart;
