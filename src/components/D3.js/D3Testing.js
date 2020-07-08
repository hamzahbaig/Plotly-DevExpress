import React, { Component } from "react";
import { SelectableGroup, createSelectable } from "react-selectable";

const SomeComponent = (props) => {
  return (
    <div style={{ height: 100, width: 100, background: "red", margin: 10 }}>
      <p>Hamzah Baig</p>
    </div>
  );
};

const SelectableComponent = createSelectable(SomeComponent);

export default class D3Testing extends Component {
  state = {
    selectedKeys: [],
    names: [
      { title: "a", id: 1 },
      { title: "b", id: 2 },
      { title: "c", id: 3 },
      { title: "d", id: 4 },
      { title: "e", id: 5 },
      { title: "f", id: 6 },
    ],
  };
  handleSelection = (selectedKeys) => {
    console.log(selectedKeys);
    this.setState({ selectedKeys: selectedKeys });
  };
  render() {
    return (
      <SelectableGroup className="main" onSelection={this.handleSelection}>
        {this.state.names.map((item, i) => {
          let selected = this.state.selectedKeys.indexOf(item.id) > -1;
          return (
            <SelectableComponent
              key={i}
              selected={true}
              selectableKey={item.id}
            >
              {item.title}
            </SelectableComponent>
          );
        })}
      </SelectableGroup>
    );
  }
}
