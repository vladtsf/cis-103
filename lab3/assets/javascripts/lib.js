window.VTFramework = (function () {
  var View = function () {

  };

  View.prototype.init = function($block) {
    this.$block = $($block);
    var elements = this.elements = this.elements || {};

    this.elements = {};

    for(var name in elements) {
      this.elements[name] = $(elements[name], this.$block);
    }
  };

  View.prototype.render = function() {
  };

  return {
    View: View
  };
})();
