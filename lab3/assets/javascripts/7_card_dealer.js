(function () {

  var CardDealerModel = function(duration) {
    this.cards = [];
  };

  CardDealerModel.prototype.deal = function() {
    this.cards = [];

    var card;

    while(this.cards.length < 5) {
      card = CardDealerModel.Card.random();

      if(this.cards.filter(function(c) {return c.id === card.id}).length > 0) {
        continue;
      }

      this.cards.push(card);
    }
  };

  CardDealerModel.Card = function (rank, suit) {
    this.rank = rank;
    this.suit = suit;
    this.id = Math.pow(CardDealerModel.Card.RANKS.indexOf(rank) + 1, CardDealerModel.Card.SUITS.indexOf(suit) + 1);
    var img = this.img = document.createElement("img");

    img.src = "assets/images/playing-cards/" + this.rank + "_of_" + this.suit + ".svg";
    img.className = "card card_dealt";
  };

  CardDealerModel.Card.RANKS = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"
  ];

  CardDealerModel.Card.SUITS = [
    "clubs", "hearts", "spades", "diamonds"
  ];

  CardDealerModel.Card.random = function() {
    var rank = CardDealerModel.Card.RANKS[~~(Math.random() * 1000 % CardDealerModel.Card.RANKS.length)];
    var suit = CardDealerModel.Card.SUITS[~~(Math.random() * 1000 % CardDealerModel.Card.SUITS.length)];
    return new CardDealerModel.Card(rank, suit);
  };

  var transitionend = "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd";

  var CardDealerView = function ($block) {
    this.model = new CardDealerModel();
    this.init($block);
    this.bindEvents();
  };

  CardDealerView.prototype = new VTFramework.View();

  CardDealerView.prototype.elements = {
    dealtCardContainer: ".js-dealt-card-container",
    cardContainers: ".js-card_container",
    sourceCard: ".js-source-card"
  };

  CardDealerView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-deal", function(e) {
      self.model.deal();

      var originalPosition = self.elements.sourceCard.position();

      self.elements.cardContainers.empty();

      self.elements.dealtCardContainer
        .empty()
        .append(self.model.cards.map(function(c) {
          $(c.img).css({left: originalPosition.left - 20, top: originalPosition.top});

          return c.img;
        }));

      self.render();
    });
  };

  CardDealerView.prototype.render = function() {
    (function (self) {
      for(var idx in self.model.cards) {
        var card = self.model.cards[idx];

        (function (idx, card) {
          var delay = (idx * 200) + "ms";

          $(card.img)
            .css(self.elements.cardContainers.eq(idx).position())
            .css({
              "-webkit-transition-delay": delay,
              "-ms-transition-delay": delay,
              "transition-delay": delay,
              "z-index": 4 - idx
            })
            .on(transitionend, function() {
              self.elements.cardContainers.eq(idx).append(this);
              $(this).removeClass("card_dealt")
            });
        })(idx, card);
      }
    })(this);
  };

  window.AppView = CardDealerView;
})();