(function () {

  var ProgressBarModel = function(duration) {
    this.position = 0;
    this.duration = duration || 4000;
    this.direction = 0;
  };

  ProgressBarModel.prototype.tick = function() {
    var now = Date.now();

    this.lastTick = this.lastTick || now;
    this.position += this.direction * (now - this.lastTick) / this.duration
    this.lastTick = now;

    if(this.position < 0) {
      return this.position = 0;
    }

    if(this.position > 1) {
      return this.position = 1;
    }
  };

  var ProgressBarView = function ($block) {
    this.model = new ProgressBarModel();
    this.init($block);
    this.bindEvents();

    setInterval(this.render.bind(this), 40);
  };

  ProgressBarView.prototype = new VTFramework.View();

  ProgressBarView.prototype.elements = {
    bar: ".js-progress-bar",
    filled: ".js-progress-bar__filled",
    changeDirection: ".js-change-direction"
  };

  ProgressBarView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-change-direction", function() {
      self.model.direction = self.model.position < 1 ? 1 : -1
    });
  };

  ProgressBarView.prototype.render = function() {
    this.model.tick()
    this.elements.filled.css("width", (this.model.position * 100) + "%");
    this.elements.changeDirection.text(this.model.position < 1 ? "Go to 100%" : "Go to 0%");
    this.elements.bar.toggleClass("progress-bar_red", this.model.position < .39)
    this.elements.bar.toggleClass("progress-bar_yellow", this.model.position > .39 && this.model.position < .79)
    this.elements.bar.toggleClass("progress-bar_green", this.model.position > .79)
  };

  window.AppView = ProgressBarView;
})();