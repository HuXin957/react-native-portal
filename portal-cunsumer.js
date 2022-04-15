import React from "react";

export default class PortalConsumer extends React.Component {
  _key;

  componentDidMount() {
    if (!this.props.manager) {
      throw new Error("Provider should be nested on the root node");
    }

    this._key = this.props.manager.mount(this.props.children);
  }

  componentDidUpdate() {
    this.props.manager.update(this._key, this.props.children);
  }

  componentWillUnmount() {
    this.props.manager.unmount(this._key);
  }

  render() {
    return null;
  }
}
