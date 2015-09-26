window.AreaAndPerimeterCalculator = (function() {

  var AreaAndPerimeterCalculator = function($block) {
    var $elements;

    var self = {
      bindEvents: function() {
        $elements.$form.addEventListener("submit", this.onSubmit.bind(this));
      },

      serialize: function() {
        return {
          length: Number($elements.$length.value),
          width: Number($elements.$width.value)
        }
      },

      validate: function(data) {
        data = data || {};

        var messages = [];
        var isValid = true;

        if(isNaN(data.length) || isNaN(data.width)) {
          messages.push("Make sure the length and width are numbers");
          isValid = false;
        }

        if(data.length <= 0 || data.width <= 0) {
          messages.push("Make sure the length and width are positive");
          isValid = false;
        }

        return {isValid: isValid, messages: messages};
      },

      onSubmit: function(e) {
        e.preventDefault();

        var data = self.serialize();
        var validation = self.validate(data);

        if(!validation.isValid) {
          $elements.$messages.innerHTML = validation.messages.map(function(msg) {
            return '<li class="calculator__message">' + msg + "</li>";
          }).join("");
        } else {
          $elements.$messages.innerHTML = "";
          $elements.$area.value = parseFloat(self.getArea().toFixed(2));
          $elements.$perimeter.value = parseFloat(self.getPerimeter().toFixed(2));
        }
      },

      getPerimeter: function() {
        var data = this.serialize(),
            width = data.width,
            length = data.length;

        return 2 * (width + length);
      },

      getArea: function() {
        var data = this.serialize(),
            width = data.width,
            length = data.length;

        return width * length;
      }
    };

    this.init = function () {
      $elements = {
        $form: $block.querySelector(".js-calculator__form"),
        $length: $block.querySelector('[name=length'),
        $width: $block.querySelector('[name=width]'),
        $messages: $block.querySelector('.js-calculator__messages'),
        $perimeter: $block.querySelector('[name=perimeter]'),
        $area: $block.querySelector('[name=area]')
      }

      self.bindEvents();
    };

    this.getPerimeter = self.getPerimeter.bind(self);
    this.getArea = self.getArea.bind(self);
  };


  return AreaAndPerimeterCalculator;
})();