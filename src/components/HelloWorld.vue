<template>
  <div class="hello">
    <div ref="main" class="echarts"></div>
    <button @click="init">init</button>
    <button @click="run">run</button>
  </div>
</template>

<script>
import {init, run} from '../audio/index';
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
      async init() {
          let node = this.$refs.main;
          await init(node);
      },
      async run() {
          await run();
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
