import React from "react";
import PortalHost, { PortalContext, portal } from "./portal-host";
import PortalConsumer from "./portal-cunsumer";

const { Consumer } = PortalContext;

export default class Index extends React.Component {
  static contextType = PortalContext;
  static Host = PortalHost;
  static add = portal.add;
  static remove = portal.remove;

  render() {
    const { children } = this.props;

    return (
      <Consumer>
        {/*
        可以直接使用<Index></Index>组件，例如做一个Modal框组件，就不用Portal.add()
        */}
        {manager => <PortalConsumer manager={manager}>{children}</PortalConsumer>}
      </Consumer>
    );
  }
}
