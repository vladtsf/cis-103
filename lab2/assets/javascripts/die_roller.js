window.DieRoller = (function() {

  var Die = (function() {

    var Die = function(sides) {
      this.sides = parseInt(sides || 6);

      if(isNaN(this.sides)) {
        throw new Error("Number of sides is not a number");
      }

      this.roll();
    };

    Die.prototype.roll = function() {
      this.value = ~~(Math.random() * 1e5 % (this.sides + 1));
    };

    Die.prototype.getValue = function() {
      return this.value;
    };

    return Die;

  })();

  var PairOfDice = (function() {

    var PairOfDice = function(sides) {
      this.dices = [new Die(sides), new Die(sides)];
      this.roll();
    };

    PairOfDice.prototype.roll = function() {
      this.dices[0].roll();
      this.dices[1].roll();
    };

    PairOfDice.prototype.getValue1 = function() {
      return this.dices[0].getValue();
    };

    PairOfDice.prototype.getValue2 = function() {
      return this.dices[1].getValue();
    };

    PairOfDice.prototype.getSum = function() {
      return this.getValue1() + this.getValue2();
    };

    return PairOfDice;
  })();


  var DieRoller = function($block) {
    var $elements, dices = new PairOfDice();

    var self = {
      bindEvents: function() {
        $elements.$form.addEventListener("submit", this.onSubmit.bind(this));
      },

      onSubmit: function(e) {
        e.preventDefault();

        dices.roll();
        this.render();
      },

      getMessage: function() {
        var v1 = dices.getValue1();
        var v2 = dices.getValue2();
        var sum = dices.getSum();

        if(sum === 7) {
          return "Craps";
        } else if(v1 === v2) {
          if(v1 === 1) {
            return "Snake Eyes";
          } else if(v1 === 6) {
            return "Box Cars";
          }
        }

        return "";
      },

      render: function() {
        $elements.$die1Value.innerText = dices.getValue1();
        $elements.$die2Value.innerText = dices.getValue2();
        $elements.$message.innerText = this.getMessage();
      }
    };

    this.init = function () {
      $elements = {
        $form: $block.querySelector(".js-calculator__form"),
        $die1Value: $block.querySelector('#die1Value'),
        $die2Value: $block.querySelector('#die2Value'),
        $message: $block.querySelector('#message')
      }

      self.bindEvents();
    };
  };


  return DieRoller;
})();