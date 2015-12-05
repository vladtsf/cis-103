(function () {
  var canvas = document.getElementById("canvas");

  var Life = function (canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = Life.WIDTH * Life.CELL_SIZE;
    this.height = Life.HEIGHT * Life.CELL_SIZE;
    this.isRunning = false;
    this.reset();
    this.bindEvents();
    this.getRunning();
  };

  Life.prototype.getRunning = function() {
    clearInterval(this._stepInterval);

    this._stepInterval = setInterval(function () {
      if(this.isRunning) {
        this.step();
      }
    }.bind(this), 1000 / Life.SPS);
  };

  Life.prototype.reset = function() {
    this.board = Array.apply(null, Array(Life.WIDTH))
    this.board = this.board.map(function (i) {
      return Array.apply(null, Array(Life.HEIGHT)).map(function (j) {
        return Life.EMPTY;
      });
    });
  };

  Life.prototype.pxToCoords = function(x, y) {
    var w = parseInt(window.getComputedStyle(this.canvas).width.replace("px", ""));
    var h = parseInt(window.getComputedStyle(this.canvas).height.replace("px", ""));

    return [~~(x / w * Life.WIDTH), ~~(y / h * Life.HEIGHT)];
  };

  Life.prototype.toggle = function(x, y) {
    this.board[x][y] = this.board[x][y] === Life.EMPTY ? Life.ALIVE : Life.EMPTY;
  };

  Life.prototype.numberOfNeighbors = function(x, y) {
    var px, py;
    var n = 0;

    for(var dx = -1; dx <= 1; dx++) {
      for(var dy = -1; dy <= 1; dy++) {
        px = x + dx;
        py = y + dy;

        if(px < 0 || py < 0 || px >= Life.WIDTH || py >= Life.HEIGHT) {
          continue;
        }

        if(this.board[px][py] !== Life.EMPTY && this.board[px][py] !== Life.BORN) {
          n++;
        }
      }
    }

    return n;
  };

  Life.prototype.step = function() {
    var n;
    for (var x = 0; x < Life.WIDTH; x++) {
      for (var y = 0; y < Life.HEIGHT; y++) {
        n = this.numberOfNeighbors(x, y);

        if(n > 3 || n < 2 && this.board[x][y] === Life.ALIVE) {
          this.board[x][y] = Life.DEAD;
        } else if(n === 3) {
          this.board[x][y] = Life.BORN;
        }
      }
    }

    for (var x = 0; x < Life.WIDTH; x++) {
      for (var y = 0; y < Life.HEIGHT; y++) {
        if(this.board[x][y] == Life.DEAD) {
          this.board[x][y] = Life.EMPTY;
        } else if(this.board[x][y] == Life.BORN) {
          this.board[x][y] = Life.ALIVE;
        }
      }
    }
  }

  Life.prototype.bindEvents = function() {
    var mDown = false;
    var hasMoved = false;

    cbAddEventListener(this.canvas, "mousedown", function(e) {
      mDown = true;
      hasMoved = false;
    }.bind(this));

    cbAddEventListener(this.canvas, "mouseup", function(e) {
        var pos = this.pxToCoords(e.offsetX, e.offsetY);

        if(hasMoved) {
          this.board[pos[0]][pos[1]] = Life.ALIVE;
        } else {
          this.toggle(pos[0], pos[1], Life.ALIVE);
        }

        hasMoved = false;
        mDown = false;
    }.bind(this));

    cbAddEventListener(this.canvas, "mousemove", function(e) {
      hasMoved = true;
      if(mDown) {
        var pos = this.pxToCoords(e.offsetX, e.offsetY);
        this.board[pos[0]][pos[1]] = Life.ALIVE
      }
    }.bind(this));


    cbAddEventListener(document.getElementById("clear"), "click", this.reset.bind(this));
    cbAddEventListener(document.getElementById("step"), "click", this.step.bind(this));
    cbAddEventListener(document.getElementById("start"), "click", function() {
      this.isRunning = true;
    }.bind(this));
    cbAddEventListener(document.getElementById("stop"), "click", function() {
      this.isRunning = false;
    }.bind(this));
  };

  Life.prototype.render = function() {
    var c = this.ctx;

    c.clearRect(0, 0, this.width, this.height);

    c.lineWidth = .3;

    (function () {
      for (var x = 0; x <= this.width; x += Life.CELL_SIZE) {
        c.beginPath();
        c.moveTo(x, 0);
        c.lineTo(x, this.height);
        c.stroke();
      };

      for (var y = 0; y <= this.height; y += Life.CELL_SIZE) {
        c.beginPath();
        c.moveTo(0, y);
        c.lineTo(1000, y);
        c.stroke();
      };
    }).call(this);

    (function () {

      for (var x = 0; x < Life.WIDTH; x++) {
        for (var y = 0; y < Life.HEIGHT; y++) {
          if(this.board[x][y] === Life.ALIVE) {
            c.fillRect(x * Life.CELL_SIZE, y * Life.CELL_SIZE, Life.CELL_SIZE, Life.CELL_SIZE);
          }
        }
      }

    }).call(this);
  };


  Life.WIDTH = 100;
  Life.HEIGHT = 50;
  Life.CELL_SIZE = 10;

  Life.EMPTY = 0;
  Life.DEAD = 1;
  Life.ALIVE = 2;
  Life.BORN = 3;

  Life.SPS = 5; // Steps per Second

  var life = new Life(canvas);

  (function () {
    function frame () {
      life.render();
      window.requestAnimationFrame(frame);
    }

    frame();
  })();


})();