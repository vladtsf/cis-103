(function () {

  var TeamRoasterModel = function() {
    this.team = "";
    this.players = [];
    this.positions = [].concat(TeamRoasterModel.POSITIONS);
  };

  TeamRoasterModel.POSITIONS = [
    "Center Field",
    "Left Field",
    "Right Field",
    "Pitcher",
    "Catcher",
    "First Base",
    "Short Stop",
    "Second Base",
    "Third Base"
  ];

  TeamRoasterModel.prototype.addPlayer = function(player) {
    this.players.push(player);
    this.positions = this.positions.filter(function(position) {
      return position !== player.position;
    });
  };

  TeamRoasterModel.Player = function(name, position) {
    this.name = name;
    this.position = position;
  }

  TeamRoasterModel.Player.prototype.toString = function() {
    return [this.name, this.position].join(" - ");
  };



  function onEnter(fn) {
    fn = fn || function () {};

    return function(e) {
      if(e.keyCode === 13) {
        return fn(e);
      }
    }
  };

  var TeamRoasterView = function ($block) {
    this.model = new TeamRoasterModel();
    this.init($block);
    this.bindEvents();
  };

  TeamRoasterView.prototype = new VTFramework.View();

  TeamRoasterView.prototype.elements = {
    teamNameLabel: ".js-team-name-label",
    teamNameInput: ".js-team-name",
    memberName: ".js-member-name",
    positions: ".js-positions",
    players: ".js-players",
    addMemberButton: ".js-add-member"
  };

  TeamRoasterView.prototype.setTeam = function(e) {
    var value = $.trim(this.elements.teamNameInput.val());

    if(value.length > 0) {
      this.model.team = value;
      this.elements.memberName.focus();
      this.render();
    }
  };

  TeamRoasterView.prototype.addPlayer = function(e) {
    var value = $.trim(this.elements.memberName.val());

    if(value.length > 0) {
      this.model.addPlayer(new TeamRoasterModel.Player(
        value, this.elements.positions.val()
      ));
      this.elements.memberName.val("").focus();
      this.render();
    }
  };

  TeamRoasterView.prototype.reset = function(e) {
    this.model = new TeamRoasterModel();
    this.render();
    this.elements.teamNameInput.focus();
  };

  TeamRoasterView.prototype.bindEvents = function() {
    var self = this;

    this.$block.on("click", ".js-set-team", this.setTeam.bind(this));
    this.$block.on("keypress", ".js-team-name", onEnter(this.setTeam.bind(this)));

    this.$block.on("click", ".js-add-member", this.addPlayer.bind(this));
    this.$block.on("keypress", ".js-member-name", onEnter(this.addPlayer.bind(this)));

    this.$block.on("click", ".js-reset", this.reset.bind(this));

  };

  TeamRoasterView.prototype.render = function() {
    this.elements.teamNameLabel.text(this.model.team);

    this.elements.positions.html(this.model.positions.map(function(val) {
      return "<option>" + val + "</option>";
    }).join(""));


    this.elements.players.html(this.model.players.map(function(val) {
      return "<li>" + val + "</li>";
    }).join(""));

    this.elements.addMemberButton.attr("disabled", !this.model.positions.length);
    this.elements.memberName.attr("disabled", !this.model.positions.length);
  };

  window.AppView = TeamRoasterView;
})();