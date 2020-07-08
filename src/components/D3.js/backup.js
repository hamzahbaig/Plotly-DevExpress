import React, { Component } from "react";
export class D3Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null,
      ctx: null,
      rect: {},
      drag: false,
    };
  }
  componentDidMount() {
    this.setState({
      canvas: document.getElementById("canvas"),
    });
  }
  mouseDown = (e) => {
    console.log("MouseDown");
    this.setState({ ctx: this.state.canvas.getContext("2d") });
    this.state.rect.startX = e.pageX - this.state.canvas.offsetLeft;
    this.state.rect.startY = e.pageY - this.state.canvas.offsetTop;
    this.state.drag = true;
    this.setState({ drag: true });
  };
  mouseUp = () => {
    console.log("MouseUp");
    this.setState({ drag: false });
    this.state.ctx.clearRect(
      0,
      0,
      this.state.canvas.width,
      this.state.canvas.height
    );
  };
  draw = () => {
    console.log(
      "draw",
      this.state.rect.startX,
      this.state.rect.startY,
      this.state.rect.w,
      this.state.rect.h
    );
    this.state.ctx.setLineDash([6]);
    // this.state.ctx.strokeRect(200, 200, 200, 200);
    this.state.ctx.strokeRect(
      this.state.rect.startX,
      this.state.rect.startY,
      this.state.rect.w,
      this.state.rect.h
    );
  };
  mouseMove = (e) => {
    console.log("MouseMove");
    if (this.state.drag) {
      console.log("Here");
      this.state.rect.w =
        e.pageX - this.state.canvas.offsetLeft - this.state.rect.startX;
      this.state.rect.h =
        e.pageY - this.state.canvas.offsetTop - this.state.rect.startY;
      this.state.ctx.clearRect(
        0,
        0,
        this.state.canvas.width,
        this.state.canvas.height
      );
      this.draw();
    }
  };

  render() {
    return (
      <canvas
        onMouseMove={this.mouseMove}
        onMouseDown={this.mouseDown}
        onMouseUp={this.mouseUp}
        id="canvas"
        width="800"
        height="650"
      ></canvas>
    );
  }
}

export default D3Testing;
