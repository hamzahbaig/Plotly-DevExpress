import React, { Component } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import DataGrid, {
  FilterRow,
  HeaderFilter,
  SearchPanel,
  Scrolling,
  Sorting,
  Selection,
  ColumnChooser,
  ColumnFixing,
  Editing,
  FilterPanel,
  FilterBuilderPopup,
  Column,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { generateData } from "./data.js";
import Query from "devextreme/data/query";

const Plot = createPlotlyComponent(Plotly);

const fields = [
  "Id",
  "First Name",
  "Last Name",
  "Gender",
  "Brith Date",
  "Age 1",
  "Age 2",
];

const keys = [
  "id",
  "firstName",
  "lastName",
  "gender",
  "birthDate",
  "age1",
  "age2",
];

class PlotlyChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: generateData(100),
      dataGrid: null,
      filteredData: null,
      gridFilteredData: null,
      selectedData: [],
      colorList: [],
      selectionColor: "green",
      unselectionColor: "red",
      advancedFilter: "",
      advancedFilterFlag: false,
    };
    this.state.filteredData = this.state.dataSource;
    this.state.gridFilteredData = this.state.dataSource;
  }

  componentDidMount() {
    this.setState({
      colorList: this.state.dataSource.map(() => this.state.unselectionColor),
    });
  }

  onSelectionChanged = (event) => {
    if (event.currentSelectedRowKeys.length) {
      let currentSelectedRowsData = event.currentSelectedRowKeys;
      let selectedColorList = this.state.colorList;
      currentSelectedRowsData.forEach((data) => {
        let index = this.state.filteredData.indexOf(data);
        selectedColorList[index] = this.state.selectionColor;
      });
      this.setState({
        colorList: selectedColorList,
        selectedData: event.selectedRowsData,
      });
    } else if (event.currentDeselectedRowKeys.length) {
      let selectedColorList = this.state.colorList;
      const currentDeselectedRowKeys = event.currentDeselectedRowKeys;
      const selectedRowsData = event.selectedRowsData;
      currentDeselectedRowKeys.forEach((data) => {
        let index = this.state.filteredData.indexOf(data);
        selectedColorList[index] = this.state.unselectionColor;
      });
      this.setState({
        selectedData: selectedRowsData,
        colorList: selectedColorList,
      });
    }
  };

  // Filter interaction between graph and datagrid
  onContentReady = () => {
    if (this.state.advancedFilterFlag == true) return;
    let filterExp = this.state.dataGrid.instance.getCombinedFilter();
    if (filterExp) {
      let filteredData = Query(this.state.dataSource)
        .filter(filterExp)
        .toArray();
      let colorList = filteredData.map(() => this.state.unselectionColor);
      this.state.selectedData.forEach((data) => {
        let index = filteredData.indexOf(data);
        colorList[index] = this.state.selectionColor;
      });
      this.setState({
        filteredData,
        colorList,
      });
    } else {
      // No Filter Back to original!
      this.state.dataGrid.instance.clearFilter();
      let colorList = this.state.dataSource.map(
        () => this.state.unselectionColor
      );
      this.state.selectedData.forEach((data) => {
        let index = this.state.dataSource.indexOf(data);
        colorList[index] = this.state.selectionColor;
      });
      this.setState({
        filteredData: this.state.dataSource,
        colorList,
      });
    }
  };

  // Clear selection on both datagrid and chart
  onClearButtonClicked = () => {
    this.state.dataGrid.instance.clearSelection();
    this.setState({
      selectedData: [],
      colorList: this.state.filteredData.map(() => this.state.unselectionColor),
    });
  };

  // Clear Filters
  onClearAdvancedFilter = () => {
    this.state.dataGrid.instance.clearFilter();
    let colorList = this.state.dataSource.map(
      () => this.state.unselectionColor
    );
    this.state.selectedData.forEach((data) => {
      let index = this.state.dataSource.indexOf(data);
      colorList[index] = this.state.selectionColor;
    });
    this.setState({
      filteredData: this.state.dataSource,
      gridFilteredData: this.state.dataSource,
      colorList,
      advancedFilterFlag: !this.state.advancedFilterFlag,
      advancedFilter: "",
    });
  };

  // Single point selection on graph
  singlePointGraphSelection = (event) => {
    let point = event.points[0];
    let selectedPoint;
    let selectedColorList = this.state.colorList;
    if (point["marker.color"] == this.state.unselectionColor) {
      selectedPoint = this.state.filteredData[point.pointNumber];
      selectedColorList[point.pointNumber] = this.state.selectionColor;
      this.setState({
        selectedData: [selectedPoint, ...this.state.selectedData],
        colorList: selectedColorList,
      });
    } else if (point["marker.color"] == this.state.selectionColor) {
      selectedColorList[point.pointNumber] = this.state.unselectionColor;
      this.setState({
        colorList: selectedColorList,
        selectedData: this.state.selectedData.filter(
          (p) => p.id - 1 != point.pointNumber
        ),
      });
    }
  };

  // Series of point selection on graph
  graphSelection = (event) => {
    let selectedPoints = [];
    let selectedColorList = this.state.colorList;
    event.points.forEach((point) => {
      if (point["marker.color"] == this.state.unselectionColor) {
        selectedPoints.push(this.state.filteredData[point.pointNumber]);
        selectedColorList[point.pointNumber] = this.state.selectionColor;
      }
    });
    this.setState({
      selectedData: [...selectedPoints, ...this.state.selectedData],
      colorList: selectedColorList,
    });
  };

  // Advance Filteration
  // Need to fix selection
  advancedFilter = () => {
    let exp = this.state.advancedFilter;
    let err = null;
    fields.forEach((field, index) => {
      if (exp.indexOf(field) != -1) {
        exp = exp.replace(field, "data." + keys[index]);
      } else {
        err = "Expression Invalid";
      }
    });
    let filteredData = Query(this.state.dataSource)
      .toArray()
      .filter((data) => eval(exp));
    this.setState({
      gridFilteredData: filteredData,
      filteredData: filteredData,
      advancedFilterFlag: true,
    });
  };

  render() {
    return (
      <div>
        <div>
          {this.state.advancedFilterFlag ? (
            <input
              type="text"
              name="advancedFilter"
              value={this.state.advancedFilter}
              onChange={(e) =>
                this.setState({ advancedFilter: e.target.value })
              }
            />
          ) : null}

          <Button
            text="Advanced Filter"
            visible={!this.state.advancedFilterFlag}
            onClick={this.onClearAdvancedFilter}
          />
          <Button
            text="Apply"
            visible={this.state.advancedFilterFlag}
            onClick={this.advancedFilter}
          />
          <Button
            text="Cancel Advanced Filter"
            visible={this.state.advancedFilterFlag}
            onClick={this.onClearAdvancedFilter}
          />
          <Button
            disabled={!this.state.selectedData.length}
            onClick={this.onClearButtonClicked}
            text="Clear Selection"
          />
          <DataGrid
            elementAttr={{
              id: "gridContainer",
            }}
            ref={(ref) => (this.state.dataGrid = ref)}
            dataSource={this.state.gridFilteredData}
            showBorders={true}
            onSelectionChanged={this.onSelectionChanged}
            onContentReady={this.onContentReady}
            allowColumnReordering={true}
            allowColumnResizing={true}
            selectedRowKeys={this.state.selectedData}
          >
            <Editing mode="row" useIcons={true} allowUpdating={true} />
            <ColumnChooser enabled={true} />
            <ColumnFixing enabled={true} />

            <FilterRow
              visible={!this.state.advancedFilterFlag}
              applyFilter="auto"
            />
            <HeaderFilter visible={!this.state.advancedFilterFlag} />

            <Selection mode="multiple" selectAllMode="allpages" />

            <SearchPanel visible={true} width={240} placeholder="Search..." />
            <Sorting mode="multiple" />
            <Scrolling mode="standard" />
            <FilterPanel visible={true} />
            <FilterBuilderPopup visible={false} />
          </DataGrid>
          <div className="options">
            <div className="caption">
              Selected Rows: {this.state.selectedData.length}
            </div>
            <div className="caption">
              Total Rows: {this.state.filteredData.length}
            </div>
          </div>
        </div>
        <div>
          <p>Plotly Scatter Graph with Plotly Grid</p>
          <Plot
            onClick={this.singlePointGraphSelection} // Single Selection
            onSelected={this.graphSelection} // Multiple Selection
            onUpdate={() =>
              console.log(
                this.state.filteredData,
                this.state.gridFilteredData,
                this.state.selectedData
              )
            }
            data={[
              {
                type: "scattergl",
                mode: "markers",
                x: this.state.filteredData.map((ele) => ele.id),
                y: this.state.filteredData.map((ele) => ele.age1),
                text: this.state.filteredData.map((ele) => ele.firstName),
                marker: { size: 10, color: this.state.colorList },
                selected: {
                  marker: { color: this.state.selectionColor, size: 15 },
                },
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default PlotlyChart;
// NOTE
// Try to save the prevCurrentFilter
// and keeping the track fix the oncontent function so u have one
// datasource changing and the other datasource is just backup. Period!!
