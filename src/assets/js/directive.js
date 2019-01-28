import Vue from 'vue';

const numberOnly = Vue.directive('numberOnly', {
  update(el) {
    el.value = el.value.replace(/\D+/, '')
  },
})

export { numberOnly }
