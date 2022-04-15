import React from "react";
import {
  DeviceEventEmitter,
  NativeEventEmitter,
  View,
} from "react-native";
import PortalManager from "./portal-manager";

const EventType = {
  ADD_PORTAL: "ADD_PORTAL",
  UPDATE_PORTAL: "UPDATE_PORTAL",
  REMOVE_PORTAL: "REMOVE_PORTAL",
};

/**
 * portal 是干什么的？
 * 目的：将某一节点或组件，挂载到另一地方。
 * 例子：提示框，如果你想在 anywhere 打开你提示框，那么可以使用到 portal
 */

/**
 *利用EventEmitter向portal-manager（容器）中做节点操作
 */

export const PortalContext = React.createContext(null);
const {Provider} = PortalContext;

const EventEmitter = DeviceEventEmitter || new NativeEventEmitter();

export default class PortalHost extends React.Component {
  _nextKey = 0;
  _queue = [];

  componentDidMount() {
    const manager = this._manager;
    const queue = this._queue;

    EventEmitter.addListener(EventType.ADD_PORTAL, this._mount);
    EventEmitter.addListener(EventType.REMOVE_PORTAL, this._unmount);

    //执行队列
    while (queue.length && manager) {
      const action = queue.pop();//取出最前面的动作
      if (!action) {
        continue;
      }
      //调用 manager（容器）新增、修改、卸载
      switch (action.type) {
        case "mount":
          manager.mount(action.key, action.children);
          break;
        case "update":
          manager.update(action.key, action.children);
          break;
        case "unmount":
          manager.unmount(action.key);
          break;
      }
    }
  }

  componentWillUnmount() {
    EventEmitter.removeListener(EventType.ADD_PORTAL, this._mount);
    EventEmitter.removeListener(EventType.REMOVE_PORTAL, this._unmount);
  }

//通过EventEmitter 监听，调用以下新增、更新、卸载方法
  _mount = (children, _key) => {
    const key = _key || this._nextKey++;
    if (this._manager) {
      this._manager.mount(key, children);
    } else {
      this._queue.push({type: "mount", key, children});
    }
    return key
  };

  _update = (key, children) => {
    if (this._manager) {
      this._manager.update(key, children);
    } else {
      const option = {type: "mount", key, children};
      const index = this._queue.findIndex(item => item.type === "mount" || (item.type === "update" && item.key === key));

      if (index > -1) {
        this._queue[index] = option;
      } else {
        this._queue.push(option);
      }
    }
  };

  _unmount = (key) => {
    if (this._manager) {
      this._manager.unmount(key);
    } else {
      this._queue.push({type: "unmount", key});
    }
  };

  render() {
    return (
      <Provider
        value={{
          mount: this._mount,
          update: this._update,
          unmount: this._unmount,
        }}>
        {/*包裹根组件*/}
        <View style={{flex: 1}} collapsable={false}>
          {this.props.children}
        </View>
        {/*将 PortalHost 包裹在谁身上，那么它传进来的节点就会显示在下面*/}
        <PortalManager ref={ref => this._manager = ref}/>
      </Provider>
    );
  }
}


class PortalGuard {
  nextKey = 10000;

  add = (node) => {
    const key = this.nextKey++;
    EventEmitter.emit(EventType.ADD_PORTAL, node, key);
    return key;
  };

  remove = (key) => EventEmitter.emit(EventType.REMOVE_PORTAL, key);
}

//导出实例供外部使用
export const portal = new PortalGuard();

