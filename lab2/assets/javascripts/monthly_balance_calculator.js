window.MonthlyBalanceCalculator = (function() {

  var Account = (function() {
    var Account = function (balance) {
      this.startingBalance = balance;
      this.transactions = [];
    };

    Account.prototype.getBalance = function() {
      if(this.transactions.length) {
        return this.startingBalance + this.transactions.reduce(function (prev, curr) {
          return prev + curr;
        });
      } else {
        return this.startingBalance;
      }
    };

    Account.prototype.addTransaction = function(transaction) {
      transaction.account = this;
      transaction.balanceBefore = this.getBalance();
      this.transactions.push(transaction);
    };

    Account.prototype.getDepositAmount = function() {
      if(this.transactions.length) {
        return this.transactions
          .map(function (t) { return t.type === "deposit" ? t.valueOf() : 0})
          .reduce(function (prev, curr) {
            return prev + curr;
          });
      } else {
        return 0;
      }
    };

    Account.prototype.getWithdrawalAmount = function() {
      if(this.transactions.length) {
        return this.transactions
          .map(function (t) { return t.type === "withdrawal" ? t.valueOf() : 0})
          .reduce(function (prev, curr) {
            return prev + curr;
          });
      } else {
        return 0;
      }
    };

    return Account;
  })();

  var Transaction = (function() {
    var Transaction = function (date, type, amount) {
      this.date = date;
      this.type = type;
      this.amount = amount;
      this.account = null;
      this.balanceBefore = null;
    };

    Transaction.prototype.valueOf = function() {
      return (this.type === "deposit" ? 1 : -1) * this.amount
    };

    Transaction.prototype.getBalance = function () {
      return this.balanceBefore + this;
    };

    return Transaction;
  })();

  var MonthlyBalanceCalculator = function($block) {
    var $elements, account = new Account(2000);

    var parseDate = function(val) {
      var base = val.split("/");

      if(base.length != 3) {
        return null;
      }

      var m = parseInt(base[0]);
      var d = parseInt(base[1]);
      var y = parseInt(base[2]);

      if(isNaN(m) || isNaN(d) || isNaN(y)) {
        return null;
      }

      if(m < 1 || m > 12 || d < 1 || d > 31 || y < 1000 || y > 3000) {
        return null;
      }

      if([4, 7, 9, 11].indexOf(m) != -1 && d > 30) {
        return null;
      }

      if(m === 2) {
        if(d > 29) {
          return null;
        } else if(y % 4 !== 0 && d > 28) {
          return null;
        }
      }

      return [m,d,y].join("/")
    };

    var self = {
      bindEvents: function() {
        $elements.$form.addEventListener("submit", this.onSubmit.bind(this));
      },

      serialize: function () {
        return {
          date: parseDate($elements.$date.value),
          type: $elements.$type.value,
          amount: parseFloat($elements.$amount.value)
        };
      },

      validate: function (data) {
        for (key in MonthlyBalanceCalculator.validations) {
          if(!MonthlyBalanceCalculator.validations[key].call(this, data[key])) {
            return false;
          }
        }

        return true;
      },

      addTransaction: function() {
        var data = this.serialize();

        if(this.validate(data)) {
          account.addTransaction(new Transaction(
            data.date,
            data.type,
            data.amount
          ));

          this.render();
        } else {
          alert("Please correct the errors on the page")
        }
      },

      onSubmit: function(e) {
        e.preventDefault();
        this.addTransaction();
        this.render();
      },

      render: function() {
        $elements.$startingBalance.value = account.startingBalance;
        $elements.$deposits.value = account.getDepositAmount();
        $elements.$withdrawals.value = account.getWithdrawalAmount();
        $elements.$endingBalance.value = account.getBalance();

        $elements.$output.innerHTML = account.transactions.map(function(t) {
          return [
            "<tr>",
            " <td>" + t.date +  "</td>",
            " <td>",
            "   <span class='dollar-sign'>$</span>",
            "   <span class='transaction-value'>" + Number(t).toFixed(2) + "</span>",
            " </td>",
            " <td>",
            "   <span class='dollar-sign'>$</span>",
            "   <span class='transaction-value'>" + t.getBalance().toFixed(2) + "</span>",
            " </td>",
            "</tr>"
          ].join("\n")
        }).join("\n");
      }
    };

    this.init = function () {
      $elements = {
        $form: $block.querySelector(".js-calculator__form"),
        $output: $block.querySelector('.js-output'),
        $date: $block.querySelector('[name=date]'),
        $type: $block.querySelector('[name=type]'),
        $amount: $block.querySelector('[name=amount]'),

        $startingBalance: $block.querySelector('[name=starting_balance]'),
        $deposits: $block.querySelector('[name=total_deposits]'),
        $withdrawals: $block.querySelector('[name=total_withdrawals]'),
        $endingBalance: $block.querySelector('[name=ending_balance]')
      }

      self.bindEvents();
      self.render();
    };
  };

  MonthlyBalanceCalculator.validations = {
    date: function(val) {
      return !!val;
    },

    amount: function (val) {

      return val <= 100000 && val >= 0 && !isNaN(val);
    }
  };


  return MonthlyBalanceCalculator;
})();