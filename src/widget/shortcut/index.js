define(['css!./index.css'], function () {
  function init(el) {
    new Vue({
      el: '#' + el,
      template: '<div></div>',
    });
  }

  return {
    init: init
  }
});
