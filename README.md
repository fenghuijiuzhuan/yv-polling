<!--
 * @path        : \yv-polling\README.md
 * @message     : 
 * @Author      : yvangod
-->
<!-- 标题 -->
# 定时轮询器
<!-- 介绍 -->
可以设置开始轮询的时间，和轮询间隔时间，轮询的方法可以是promise

## npm安装
```
npm install yv-polling
```
### 模块化导入
```
import YvPolling from 'yv-polling'
```
### 在html中的引入
```
<script src="/dist/yv-polling.js"></script>
```
### 示例
```
function getData() {
  return new Promise((resolve) => {
    <!-- 要轮询执行的代码 -->
    setTimeout(() => {
      ......
      resolve()
    }, 2000);
  });
}
<!-- 创建定时器 -->
var timer = YvPolling.start({
  interval: 3 * 1000,
  action: () => getData()
});
<!-- 执行定时器 -->
timer.run.call(timer);
<!-- 中断定时器 -->
YvPolling.stop(timer);
<!-- 继续定时器 -->
timer.goon.call(timer);
```
