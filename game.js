(function() {
    function Ball(game) {
        this.game = game;
        this.size = {
            x: 5,
            y: 5
        };
        this.center = {
            x: game.size.x / 2,
            y: game.size.y / 2
        }
        this.velocity = {
            x: 0,
            y: 2
        }
    }

    function drawRect(context) {
        context.fillRect(this.center.x - this.size.x / 2, this.center.y - this.size.y / 2,
                this.size.x, this.size.y)
    }

    Ball.prototype.draw = function(context) {
        drawRect.call(this, context);
    };

    Ball.prototype.update = function() {
        this.center.x += this.velocity.x;
        this.center.y += this.velocity.y;
        var self = this;
        this.game.bodies.forEach(function(body) {
            if (collied(self, body)) {
                self.velocity.y = -self.velocity.y * 1.2;
                self.velocity.x = body.velocity.x + Math.random() - 0.5;
            }
        });
        if (this.center.x < 0 || this.center.x > this.game.size.x) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.center.y < 0 || this.center.y > this.game.size.y) {
            this.center = {
                x: this.game.size.x / 2,
                y: this.game.size.y / 2
            };
            this.velocity = {
                x: 0,
                y: 2
            }
        }
    };

    var Board = function() {
        this.size = {
            x: 30,
            y: 5
        };
        this.velocity = {
            x: 0,
            y: 0
        }
    };

    Board.prototype.draw = function(context) {
        drawRect.call(this, context);
    };

    var Enemy = function(game, ball) {
        this.ball = ball;
        this.center = {
            x: game.size.x / 2,
            y: this.size.y
        }
    };

    Enemy.prototype = new Board();
    Enemy.prototype.update = function() {
        if (this.center.x + this.size.x / 2 < this.ball.center.x) {
            this.center.x += 6;
            this.velocity.x = 2;
        } else if (this.center.x - this.size.x / 2 > this.ball.center.x) {
            this.center.x -= 6;
            this.velocity.x = -2;
        }
    };

    var Player = function(game) {
        this.center = {
            x: game.size.x / 2,
            y: game.size.y - this.size.y
        };
        this.keyboarder = new Keyboarder();
    };

    Player.prototype = new Board();

    Player.prototype.update = function() {
        if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
            this.center.x -= 4;
            this.velocity.x = -2;
        } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
            this.center.x += 4;
            this.velocity.x = 2;
        } else {
            this.velocity.x = 0;
        }
    };

    var collied = function(b1, b2) {
        return !(b1 === b2 || b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2
                || b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2
                || b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 || b1.center.y
                - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
    };

    var Game = function() {
        var canvas = document.getElementById("canvasId");
        var context = canvas.getContext("2d");
        this.size = {
            x: canvas.width,
            y: canvas.height
        };
        var ball = new Ball(this);
        this.bodies = [ ball, new Player(this), new Enemy(this, ball) ];

        var self = this;

        function tick() {
            self.update();
            self.draw(context);
            window.requestAnimationFrame(tick);
        }

        tick();
    };

    Game.prototype.update = function() {
        this.bodies.forEach(function(body) {
            body.update();
        });
    };

    Game.prototype.draw = function(context) {
        context.clearRect(0, 0, this.size.x, this.size.y);
        context.rect(0, 0, this.size.x, this.size.y);
        context.stroke();
        this.bodies.forEach(function(body) {
            body.draw(context);
        });
    };

    var Keyboarder = function() {
        this.KEYS = {
            LEFT: 37,
            RIGHT: 39
        };
        var keys = {}
        window.onkeydown = function(e) {
            keys[e.keyCode] = true;
        }
        window.onkeyup = function(e) {
            keys[e.keyCode] = false;
        }
        this.isDown = function(key) {
            return keys[key] === true;
        }
    };

    window.onload = function() {
        new Game();
    }
})();
