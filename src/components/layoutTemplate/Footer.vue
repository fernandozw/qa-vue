<template>
  <span>Copyright© 2018-{{ thisYear }} 数数科技 All Rights Reserved</span>
</template>

<script>
export default {
  data() {
    return {
      thisYear: this.$moment(new Date()).format('YYYY')
    };
  }
};
</script>
