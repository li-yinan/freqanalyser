<template>
  <div class="hello">
    <div ref="main" class="echarts"></div>
    <button @click="handleClick">click</button>
  </div>
</template>

<script>
import {getRecorder} from '../audio/index';
import {init} from 'echarts';
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  async created() {
  },
  methods: {
      async handleClick() {
          let node = this.$refs.main;
          let recorder = await getRecorder(node);
      }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.echarts {
    width: 400px;
    height: 300px;
    margin: auto;
}
</style>
