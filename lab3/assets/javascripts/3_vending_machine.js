(function () {

  var VendingMachineModel = function() {
    this.balance = 0;
    this.drinks = {};
    this.message = "";
  };

  VendingMachineModel.DRINK_PRICE = .75;
  VendingMachineModel.DEFAULT_NUMBER_OF_BOTTLES = 2;

  VendingMachineModel.prototype.dispence = function(drinkType) {
    this.drinks[drinkType] = typeof this.drinks[drinkType] === "undefined" ?
      VendingMachineModel.DEFAULT_NUMBER_OF_BOTTLES : this.drinks[drinkType];

    if(this.balance < VendingMachineModel.DRINK_PRICE) {
      return false;
    }

    this.balance -= VendingMachineModel.DRINK_PRICE;
    this.drinks[drinkType]--;

    return true;
  }
  VendingMachineModel.prototype.refund = function() {
    var refunded = this.balance;
    this.balance = 0;
    return refunded;
  };


  function formatMoney(value) {
    return value.toFixed(2);
  };

  var VendingMachineView = function ($block) {
    this.model = new VendingMachineModel();
    this.init($block);
    this.bindEvents();
  };

  VendingMachineView.prototype = new VTFramework.View();

  VendingMachineView.prototype.elements = {
    balance: ".js-balance__amount",
    message: ".js-message",
    refund: ".js-refund",
    drinks: ".js-drink"
  };

  VendingMachineView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-coin", function (e) {
      var $t = $(e.target);

      self.model.balance += parseFloat($t.data("value"));
      self.render();
    });

    this.$block.on("click", ".js-refund", function(e) {
      self.model.message = "Refunded $" + formatMoney(self.model.refund());
      self.render();
    });

    this.$block.on("click", ".js-drink", function(e) {
      var $t = $(e.target);
      var type = $t.data("type");

      if(self.model.dispence(type)) {
        self.model.message = "Please enjoy your " + $t.text();

        if(self.model.balance > 0) {
          self.model.message += " and take your $" + self.model.balance + " change";
          self.model.balance = 0;
        }
      }
      else {
        self.model.message = "Sorry. But, you're $"
          + (VendingMachineModel.DRINK_PRICE - self.model.balance)
          + " short";
      }

      self.render();

    });

  };


  VendingMachineView.prototype.render = function() {
    this.elements.balance.val(formatMoney(this.model.balance));
    this.elements.message.text(this.model.message);

    (function (self) {
      for (var drink in self.model.drinks) {
        if(self.model.drinks[drink] <= 0) {
          $(".js-drink[data-type='" + drink + "']", this.$block).attr("disabled", true);
        }
      };
    })(this);

    this.model.message = "";
  };

  window.AppView = VendingMachineView;
})();