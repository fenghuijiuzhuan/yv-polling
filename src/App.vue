<!--
 * @path        : \yv-polling\src\App.vue
 * @message     : 
 * @Author      : yvangod
-->
<template>
  <div>
    轮询定时器 ---> 

    {{ count }}

    <p>3秒后开始轮询，每2秒轮询一次，轮询方法可以是promise</p>
  </div>
</template>

<script>
import YvPolling from '../lib/index'
export default {
  data() {
    return {
      count: 0,
      timer: null,
    };
  },
  mounted() {
    this.getData();
    this.createTimer();
  },
  activated() {
    this.clearTimer();
    this.$nextTick(() => {
      this.timer.goon.call(this.timer);
    });
  },
  deactivated() {
    this.clearTimer();
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    getData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.count++;
          resolve()
        }, 2000);
      });
    },
    createTimer() {
      this.timer = YvPolling.start({
        interval: 3 * 1000,
        action: () => this.getData(),
      });
      this.timer.run.call(this.timer);
    },
    clearTimer() {
      YvPolling.stop(this.timer);
    },
  },
}
</script>

<style lang="scss" scoped>
div{
  color: red;
  p{
    color: green;
  }
}
</style>

<style scoped>
.b{
  font-size: 50px;
}
</style>
