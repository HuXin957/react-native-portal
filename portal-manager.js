import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Index-host 通过ref调用以下方法
 * mount:新增
 * update:更新
 * unmount:卸载
 */

/**
 * PortalManager 作用：
 * 相当于一个容器，接收需要挂载的节点到该容器当中，
 * 所以对外提供新增、更新、卸载 三个方法
 */

export default class PortalManager extends React.Component {
  state = {
    portals: [],
  };

  mount = (key, children) => {
    this.setState(state => ({
      portals: [...state.portals, { key, children }],
    }));
  };

  update = (key, children) => {
    this.setState(state => ({
      portals: state.portals.map(item => {
        if (item.key === key) {
          return { ...item, children };
        }
        return item;
      }),
    }));
  };

  unmount = (key) => {
    this.setState(state => ({
      portals: state.portals.filter(item => item.key !== key),
    }));
  };

  render() {
    return this.state.portals.map(({ key, children }, index) => (
      <View
        key={key}
        // box-none：视图自身不能作为触控事件的目标，但其子视图可以.
        collapsable={false}
        // 如果一个 View 只用于布局它的子组件，则它可能会为了优化而从原生布局树中移除。 把此属性设为 false 可以禁用这个优化，以确保对应视图在原生结构中存在。
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, { zIndex: 1000 + index }]}
      >
        {children}
      </View>
    ));
  }
}
