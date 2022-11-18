<template>
  <div class="box">
    <img
      src="/static/welcome_logo.jpeg"
      alt="move"
      style="width:100%; height:100%;"
    />
  </div>
</template>

<style>
.box img {
  /* position: absolute; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* margin:auto; */
  /* height:100%; */
  /* width:100%; */
}
</style>

<script type="text/javascript">
export default {
  name: 'Rmain',

  data() {
    const item = {};
    return {
      tableData: Array(5).fill(item),
      pickerOptions1: this.GLOBAL.pickerOptions1,
      start: '',
      end: ''
    };
  },
  methods: {
    initPage: function() {
      const url = this.GLOBAL.BASE_URL;
      this.axios.get(url).then(
        response => {
          console.log(document.cookie);
          return response;
        },
        response => {
          return response;
        }
      );
    }
  },
  beforeMount() {
    this.initPage();
  }
};
</script>
