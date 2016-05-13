'use strict';

(function () {
    function Desk() {
        this.size = {x: 30, y: 5};
        this.velocity = {x: 0};
    }
    Desk.prototype.draw = drawBody;

    function Player(gameSize) {
        this.keyboarder = new Keyboarder();
        this.center = {x: gameSize.x / 2 - this.size.x / 2, y: gameSize.y - this.size.y};
    }

    Player.prototype = new Desk();
    Player.prototype.update = function () {
        if (this.keyboarder.isDown(this.keyboarder.KEYS.left)) {
            this.center.x -= 4;
            this.velocity.x = -2;
        } else if (this.keyboarder.isDown(this.keyboarder.KEYS.right)) {
            this.center.x += 4;
            this.velocity.x = 2;
        } else {
            this.velocity.x = 0;
        }
    };

    var Enemy = function (ball, gameSize) {
        this.ball = ball;
        this.center = {x: gameSize.x / 2 - this.size.x / 2, y: this.size.y};
    };

    Enemy.prototype = new Desk();

    Enemy.prototype.update = function () {
        if (this.center.x+this.size.x/2 < this.ball.center.x) {
            this.center.x += 6;
            this.velocity.x = 2;
        } else if (this.center.x-this.size.x/2 > this.ball.center.x) {
            this.center.x -= 6;
            this.velocity.x = -2;
        }
    };

    var Game = function () {
        var canvas = document.getElementById("canvasId");
        var context = canvas.getContext("2d");
        var size = {x: canvas.width, y: canvas.height};
        var ball = new Ball(this, size);
        this.bodies = [new Player(size), new Enemy(ball, size),ball];

        var self = this;
        function tick() {
            self.update(size);
            self.draw(context, size);
            window.requestAnimationFrame(tick);
        }
        tick();
    };

    Game.prototype = {
        update: function (size) {
            this.bodies.forEach(function (el) {
                el.update(size);
            });
        },
        draw: function (ctx, size) {
            ctx.clearRect(0, 0, size.x, size.y);
            ctx.rect(0, 0, size.x, size.y);
            ctx.stroke();
            this.bodies.forEach(function (el) {
                el.draw(ctx);
            });
        }
    };

    function drawBody(ctx) {
        ctx.fillRect(this.center.x - this.size.x / 2,
            this.center.y - this.size.y / 2,
            this.size.x, this.size.y
        );
    }

    var Ball = function (game, gameSize) {
        this.game = game;
        this.size = {x: 5, y: 5};
        this.center = {x: gameSize.x / 2, y: gameSize.y / 2};
        this.velocity = {x: 0, y: 2};
    };

    Ball.prototype = {
        update: function (gameSize) {
            this.center.x += this.velocity.x;
            this.center.y += this.velocity.y;

            for (var i = 0; i < 2; i++) {
                var playable = this.game.bodies[i];
                if (collied(this, playable)) {
                    this.velocity.x += playable.velocity.x + Math.random() - 0.4;
                    this.velocity.y = -this.velocity.y + Math.random() - 0.4;
                }
            }

            if (this.center.x > gameSize.x || this.center.x < 0) {
                this.velocity.x = -this.velocity.x;
            }
        },
        draw: function (ctx) {
            drawBody.call(this, ctx);
        }
    };

    var collied = function (b1, b2) {
        return !(b1 === b2 ||
        b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
        b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
        b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
        b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2 );
    };

    function Keyboarder() {
        var keyState = {};

        window.onkeydown = function (e) {
            keyState[e.keyCode] = true;
        };

        window.onkeyup = function (e) {
            keyState[e.keyCode] = false;
        };

        this.isDown = function (keyCode) {
            return keyState[keyCode] === true;
        };
        this.KEYS = {left: 37, right: 39};
    };

    window.onload = function () {
        new Game();
    }
})();
