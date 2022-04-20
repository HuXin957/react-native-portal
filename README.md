# react-native-portal

### 安装:

> npm i @huxin957/react-native-portal --save

> yarn add @huxin957/react-native-portal

### 使用:

> import Portal from "@huxin957/react-native-portal";

~~~
const App = () => {
  return (
    <Portal.Host>
      <View>
        <Text>我是根节点</Text>
      </View>
    </Portal.Host>
  );
};
~~~
## Static Method
>add(children: ReactNode) => number

>remove(key: number) => void
