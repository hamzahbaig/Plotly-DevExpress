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
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { generateData } from "./data.js";
import Query from "devextreme/data/query";

const Plot = createPlotlyComponent(Plotly);

export class PlotlyChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: generateData(100),
      dataGrid: null,
      filteredData: null,
      totalRowsCount: 0,
      selectedData: [],
      colorList: [],
      selectionColor: "green",
      unselectionColor: "red",
    };
    this.state.filteredData = this.state.dataSource;
  }

  componentDidMount() {
    this.setState({
      colorList: this.state.dataSource.map(() => this.state.unselectionColor),
      totalRowsCount: this.state.dataSource.length,
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
    let filterExp = this.state.dataGrid.instance.getCombinedFilter();
    if (filterExp) {
      // let f = [["lastName","=","Scott"],"or",["lastName","=","Allen"]]
      let filteredData = Query(this.state.dataSource)
        .filter(filterExp)
        .toArray();
      let colorList = filteredData.map(() => this.state.unselectionColor);
      this.state.selectedData.forEach((data) => {
        let index = filteredData.indexOf(data);
        colorList[index] = this.state.selectionColor;
      });
      this.setState({
        filteredData: filteredData,
        colorList,
      });
    } else {
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

  render() {
    return (
      <div>
        <div>
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
            dataSource={this.state.filteredData}
            showBorders={true}
            onSelectionChanged={this.onSelectionChanged}
            onContentReady={this.onContentReady}
            allowColumnReordering={true}
            allowColumnResizing={true}
            selectedRowKeys={this.state.selectedData}
          >
            {/* <FilterPanel visible={true} /> */}
            <Editing mode="row" useIcons={true} allowUpdating={true} />
            <ColumnChooser enabled={true} />
            <ColumnFixing enabled={true} />
            <FilterRow visible={true} applyFilter="auto" />
            <Selection mode="multiple" selectAllMode="allpages" />
            <HeaderFilter visible={true} />
            <SearchPanel visible={true} width={240} placeholder="Search..." />
            <Sorting mode="multiple" />
            <Scrolling mode="standard" />
          </DataGrid>
          <div className="options">
            <div className="caption">
              Selected Rows: {this.state.selectedData.length}
            </div>
            <div className="caption">
              Total Rows: {this.state.totalRowsCount}
            </div>
          </div>
        </div>
        <div>
          <p>Plotly Scatter Graph with Plotly Grid</p>
          <Plot
            onClick={this.singlePointGraphSelection} // Single Selection
            onSelected={this.graphSelection} // Multiple Selection
            data={[
              {
                type: "scatter",
                x: this.state.filteredData.map((ele) => ele.id),
                y: this.state.filteredData.map((ele) => ele.age),
                text: this.state.filteredData.map((ele) => ele.firstName),
                customdata: this.state.filteredData.map((ele) => ele.lastName),
                mode: "markers",
                selectedPoints: this.state.selectedData,
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
