(function () {
  function rebuildArray(arr) {
    var newArr = [];

    for (var i = 0; i < arr.length; i++) {
      if(arr[i]) {
        newArr.push(arr[i]);
      }
    }

    return newArr;
  }

  var VideoPoker = function(duration) {
    this.cards = [];
    // this.cards = [
    //   new Card("ace", "diamonds"),
    //   new Card("king", "diamonds"),
    //   new Card("queen", "diamonds"),
    //   new Card("jack", "diamonds"),
    //   new Card(10, "diamonds")
    // ]
    this.credits = 100;
    this.lastBet = 1;
    this.bet = 0;

    this.deck = (function() {
      var deck = [];

      for(var i = 0; i < VideoPoker.Card.SUITS.length; i++) {
        for(var j = 0; j < VideoPoker.Card.RANKS.length; j++) {
          deck.push(new VideoPoker.Card(VideoPoker.Card.RANKS[j], VideoPoker.Card.SUITS[i]));
        }
      }

      return deck;
    })();

    this.shuffle()
  };

  VideoPoker.MAX_BET = 5;

  VideoPoker.prototype.shuffle = function() {
    this.deck = this.deck.sort(function() {
      return (~~(Math.random() * 10000)) % 2 == 0
    });
  };

  VideoPoker.prototype.deal = function() {
    if(this.deck.length <= 0) {
      return;
    }

    for (var i = 0; i < 5; i++) {


      if(!this.cards[i] || !this.cards[i].held) {

        this.cards[i] = this.deck.splice(0,1)[0];
      }
    }

    var combo = this.checkCombo();

    this.credits -= this.bet || this.lastBet;

    if(this.bet > 0) {
      this.lastBet = this.bet;
      this.bet = 0;
    }

    if(combo) {
      this.credits += combo.credits;
    }
  };

  VideoPoker.prototype.checkCombo = function() {
    var cards = rebuildArray(this.cards)
      .sort(VideoPoker.Card.rankSort)
      .map(function(c) {
        return c.id;
      })
      .join(",");

    var matchedCombo = null;

    VideoPoker.COMBINATIONS.forEach(function(combo) {
      var comboCards = combo.cards
        .sort(VideoPoker.Card.rankSort)
        .map(function(c) {
          return c.id
        })
        .join(",");

      if(cards === comboCards) {
        matchedCombo = combo;
      }
    });

    return matchedCombo;
  };

  var Card = VideoPoker.Card = function (rank, suit, dry) {
    this.rank = rank;
    this.suit = suit;
    this.held = false;
    this.id = Math.pow(VideoPoker.Card.RANKS.indexOf(rank) + 1, VideoPoker.Card.SUITS.indexOf(suit) + 1);

    if(!dry) {
      var img = this.img = document.createElement("img");

      img.src = "assets/images/playing-cards/" + this.rank + "_of_" + this.suit + ".svg";
      img.className = "card card_dealt";
    }
  };

  VideoPoker.Card.rankSort = function (l, r) {
    return VideoPoker.Card.RANKS.indexOf(l.rank) - VideoPoker.Card.RANKS.indexOf(r.rank);
  };

  VideoPoker.Card.RANKS = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"
  ];

  VideoPoker.Card.SUITS = [
    "clubs", "hearts", "spades", "diamonds"
  ];

  VideoPoker.Card.random = function() {
    var rank = VideoPoker.Card.RANKS[~~(Math.random() * 1000 % VideoPoker.Card.RANKS.length)];
    var suit = VideoPoker.Card.SUITS[~~(Math.random() * 1000 % VideoPoker.Card.SUITS.length)];
    return new VideoPoker.Card(rank, suit);
  };

  VideoPoker.Card.prototype.equals = function(other) {
    if(other) {
      return this.id === other.id;
    }

    return false;
  };

  // Just some of them
  VideoPoker.COMBINATIONS = [

    {name: "Royal Flush", credits: 800,
      cards: [
        new Card("ace", "diamonds", true),
        new Card("king", "diamonds", true),
        new Card("queen", "diamonds", true),
        new Card("jack", "diamonds", true),
        new Card(10, "diamonds", true)
      ]
    },

    {name: "Straight Flush", credits: 50,
      cards: [
        new Card("jack", "clubs", true),
        new Card(10, "clubs", true),
        new Card(9, "clubs", true),
        new Card(8, "clubs", true),
        new Card(7, "clubs", true)
      ]
    },

    {name: "Straight Flush", credits: 50,
      cards: [
        new Card("jack", "diamonds", true),
        new Card(10, "diamonds", true),
        new Card(9, "diamonds", true),
        new Card(8, "diamonds", true),
        new Card(7, "diamonds", true)
      ]
    }

  ];

  var transitionend = "webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd";

  function transitiondelay(delay) {
    return {
      "-webkit-transition-delay": delay,
      "-ms-transition-delay": delay,
      "transition-delay": delay
    };
  }

  var VideoPokerView = function ($block) {
    this.model = new VideoPoker();
    this.init($block);
    this.bindEvents();
  };

  VideoPokerView.prototype = new VTFramework.View();

  VideoPokerView.prototype.elements = {
    bet: ".js-score__bet-value",
    credits: ".js-score__credit-value",
    betOneButton: ".js-bet-one",
    betMaxButton: ".js-bet-max",
    dealButton: ".js-deal",
    dealtCardContainers: ".js-card_container",
    message: ".js-message",
    holdButtons: ".js-card__hold"
  };

  VideoPokerView.prototype.betOne = function() {
    if(this.model.bet < VideoPoker.MAX_BET) {
      this.model.bet++;
      this.render();
    }
  };

  VideoPokerView.prototype.betMax = function() {
    this.model.bet = VideoPoker.MAX_BET;
    this.render();
  };

  VideoPokerView.prototype.deal = function() {
    this.model.deal();
    this.render();
  };

  VideoPokerView.prototype.hold = function(e) {
    var idx = $(e.target).data("idx");
    this.model.cards[idx].held = !this.model.cards[idx].held;
    this.render();
  };

  VideoPokerView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-bet-one", this.betOne.bind(this));
    this.$block.on("click", ".js-bet-max", this.betMax.bind(this));
    this.$block.on("click", ".js-deal", this.deal.bind(this));
    this.$block.on("click", ".js-draw", function () {alert("I don't know how it should work :(")});
    this.$block.on("click", ".js-card__hold", this.hold.bind(this));
  };

  VideoPokerView.prototype.render = function() {
    var self = this;
    var gameOver = this.model.deck.length <= 0;
    var gameStarted = this.model.cards.length > 0

    this.elements.credits.text(this.model.credits);
    this.elements.bet.text(this.model.bet);

    this.elements.betOneButton.attr("disabled", gameOver || this.model.bet >= VideoPoker.MAX_BET);
    this.elements.betMaxButton.attr("disabled", gameOver || this.model.bet >= VideoPoker.MAX_BET);
    this.elements.dealButton.attr("disabled", gameOver);


    (function () {
      for (var i = self.model.cards.length - 1; i >= 0; i--) {
        if(!self.model.cards[i]) {
          $(".card", self.elements.dealtCardContainers[i]).remove();
        }

        if(!self.model.cards[i] || self.model.cards[i].rendered) {
          continue;
        }

        self.model.cards[i].rendered = true;
        self.elements.dealButton.attr("disabled", true);

        (function (idx, card) {
          $(".card", self.elements.dealtCardContainers[idx]).remove();

          var delay = (idx * 200) + "ms";

          var $container = $(self.elements.dealtCardContainers[idx]);

          $card = $(card.img)
            .appendTo(".js-source-card")
            .css($(".js-source-card__img").position())
            .css(transitiondelay(delay))
            .css({
              "z-index": 4 - idx
            });

          setTimeout(function() {
            $(card.img)
              .css($container.position())
              .on(transitionend, function() {
                $container.append(this);
                $(this).removeClass("card_dealt")
                self.elements.dealButton.attr("disabled", idx < self.model.cards.length - 1);
              });

          })
        })(i, self.model.cards[i]);
      };
    })();


    this.elements.holdButtons.each(function(i, e) {
      var held = self.model.cards[i] && self.model.cards[i].held;

      $(e).attr("disabled", !gameStarted || !self.model.cards[i]);
      $(e.parentNode).toggleClass("card_container-held", !!held);
    });

    var combo = this.model.checkCombo();

    if(combo) {
      this.elements.message.text(combo.name + "! Winnings: " + combo.credits);
    } else {
      this.elements.message.text("");
    }
  };

  window.AppView = VideoPokerView;
})();