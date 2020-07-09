import React from "react";
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
} from "devextreme-react/data-grid";
import {
  Chart,
  Series,
  ArgumentAxis,
  Export,
  Legend,
  Margin,
  Title,
  Subtitle,
  Tooltip,
  Grid,
  ZoomAndPan,
  Aggregation,
  CommonSeriesSettings,
} from "devextreme-react/chart";
import { Button } from "devextreme-react/button";
import { generateData } from "./data.js";
import "./LocalDataGrid.css";
import Query from "devextreme/data/query";
import $, { jQuery } from "jquery";
import selectable from "jquery-ui/ui/widgets/selectable";
class DataGridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataGrid: null,
      chartRef: null,
      dataSource: generateData(100),
      filteredData: null,
      totalRowsCount: 0,
      selectedData: [],
      selectedCount: 0,
      chartElement: null,
    };
    this.state.filteredData = this.state.dataSource;
  }

  onSelectionChanged = (event) => {
    if (event.currentSelectedRowKeys.length) {
      const selectedRowsData = event.selectedRowsData;
      selectedRowsData.forEach((data) =>
        this.state.chartRef.instance
          .getSeriesByPos(0)
          .getPointsByArg(data.id)
          .forEach((point) => {
            if (point.data.id == data.id) {
              point.select();
            }
          })
      );
      this.setState({
        selectedData: [...event.selectedRowsData],
        selectedCount: event.selectedRowsData.length,
      });
    } else if (event.currentDeselectedRowKeys.length) {
      const currentDeselectedRowKeys = event.currentDeselectedRowKeys;
      currentDeselectedRowKeys.forEach((data) => {
        this.state.chartRef.instance
          .getSeriesByPos(0)
          .getPointsByArg(data.id)
          .forEach((point) => {
            if (point.data.id == data.id) {
              point.clearSelection();
            }
          });
      });
      this.setState({
        selectedData: [...event.selectedRowsData],
        selectedCount: event.selectedRowsData.length,
      });
    }
  };

  onContentReady = () => {
    // ("hi")
    // // We can go throught the filtered rows data and its implemented as well
    let filterExp = this.state.dataGrid.instance.getCombinedFilter();
    if (filterExp) {
      let sortColumn = this.state.dataGrid.instance.columnOption(
        "sortIndex:0"
      ) || { dataField: "" };
      let filteredData = Query(this.state.dataSource)
        .filter(filterExp)
        .sortBy(sortColumn.dataField, sortColumn.sortOrder == "desc")
        .toArray();
      this.setState({
        filteredData: filteredData,
        totalRowsCount: this.state.dataGrid.instance.totalCount(),
      });
    } else {
      this.state.dataGrid.instance.clearFilter();
      this.setState({
        filteredData: this.state.dataSource,
        totalRowsCount: this.state.dataGrid.instance.totalCount(),
      });
    }
  };
  // { target: point }
  onPointClick = (point) => {
    if (point.isSelected()) {
      let filteredSelection = this.state.selectedData.filter(
        (data) => data.id !== point.data.id
      );
      point.clearSelection();
      this.setState({
        selectedData: [...filteredSelection],
      });
    } else {
      point.select();
      this.setState({
        selectedData: [...this.state.selectedData, point.data],
      });
    }
    this.setState({
      selectedCount: this.state.selectedData.length,
    });
  };

  onClearButtonClicked = () => {
    this.state.dataGrid.instance.clearSelection();
    this.setState({
      selectedData: [],
      selectedCount: 0,
    });
  };
  resetZoom = () => {
    this.state.chartRef.instance.resetVisualRange();
  };

  componentDidMount() {
    $("g.dxc-markers circle").attr("class", "ui-widget-content");
    let tab_div = $("#my-chart");
    tab_div.selectable({
      selected: (event, ui) => {
        if (ui["selected"].tagName == "circle") {
          let matrix = $(ui["selected"])
            .css("transform")
            .replace(/[^0-9\-.,]/g, "")
            .split(",");
          let x = matrix[12] || matrix[4];
          let y = matrix[13] || matrix[5];
          // Look for the points
          let points = this.state.chartRef.instance.getSeriesByPos(0)._points;
          let filteredPoints = points.filter(
            (point) => point.x == x && point.y == y
          );
          this.onPointClick(filteredPoints[0]);
        }
      },
    });
  }

  render() {
    return (
      <div>
        <div style={{ marginTop: 40 }}>
          <h1>Local Data Grid with Virtual Scrolling</h1>
          <p>
            Virtual Scrolling: Pages are loaded when entering the viewport and
            removed once they leave. This mode allows users to scroll data by
            jumping swiftly from one row to another.
          </p>
        </div>
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
          dataSource={this.state.dataSource}
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
          <FilterRow visible={true} applyFilter="auto" />
          <Selection mode="multiple" selectAllMode="allpages" />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} width={240} placeholder="Search..." />
          <Sorting mode="multiple" />
          <Scrolling mode="virtual" />
        </DataGrid>
        <div className="options">
          <div className="caption">
            Selected Rows: {this.state.selectedCount}
          </div>
          <div className="caption">Total Rows: {this.state.totalRowsCount}</div>
        </div>
        <div>
          <React.Fragment>
            <Button
              id="reset-zoom"
              text="Reset"
              onClick={this.resetZoom}
            ></Button>
            <Chart
              id="my-chart"
              palette="Violet"
              dataSource={this.state.filteredData}
              pointSelectionMode="multiple"
              onPointClick={this.onPointClick}
              ref={(ref) => (this.state.chartRef = ref)}
              title={"Functionality Testing.."}
              tooltip={{ enabled: false }}
              legend={{ visible: false }}
            >
              {/* <CommonSeriesSettings
                fullstackedbar={{ aggregation: { enabled: true } }}
              >
                <Aggregation enabled={true} />
              </CommonSeriesSettings> */}
              <Series
                argumentField="id"
                valueField="age"
                type="scatter"
                point={{ size: 8, color: "red" }}
              />
              <Margin bottom={20} />
            </Chart>
          </React.Fragment>
        </div>
      </div>
    );
  }
}

export default DataGridComponent;
