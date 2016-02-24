/**
* var
*/

// directions
var ARROW_LEFT  = "ArrowLeft";
var ARROW_UP    = "ArrowUp";
var ARROW_RIGHT = "ArrowRight";
var ARROW_DOWN  = "ArrowDown";

// strings
var snakeHead  = 'head';
var snakeBody  = 'body';
var snakeApple = 'apple';

/**
* var
*/
var snake = new Snake(0,0);
var size = 16;
var tilesX = 640 / size;
var tilesY = 480 / size;
var timer;
var ticks;

/**
*	Help functions
*/

Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--)
		if(this[i] && this[i].parentElement)
			this[i].parentElement.removeChild(this[i]);
		else
			return false;
}

function getId(i){
	return document.getElementById(i);
}

function getClass(c){
	return document.getElementsByClassName(c);
}

/**
*	Game
*/
function Snake(x,y){
	this.X = x;
	this.Y = y;
	this.d = 'r';
	this.tmpDir = this.d;
	this.eating = false;
	this.length = 1;
}

function createPx(x,y,z){
	var px = document.createElement('div');
	px.style.left = x*size;
	px.style.top = y*size;
	px.setAttribute('id','block-'+x+'-'+y);
	px.setAttribute('class','block');
	px.setAttribute('data-type',z);
	getClass('map')[0].appendChild(px);
}

function move(d){
	var pX = snake.X, pY = snake.Y;

	switch(d) {
		case 'l': pX--; break;
		case 'r': pX++; break;
		case 'u': pY--; break;
		case 'd': pY++; break;
	}

	if(pX < 0 || pX >= tilesX || pY < 0 || pY >= tilesY) {
		getClass('map')[0].style = 'box-shadow:#800 0 0 5px 5px';
		clearInterval(timer);
	} else {

		var tmp = getId('block-'+pX+'-'+pY);

		if(tmp) {
			if(tmp.getAttribute('data-type') == snakeApple) {
				tmp.setAttribute('data-type',snakeHead);

				tmp = getId('block-'+snake.X+'-'+snake.Y);
				tmp.setAttribute('data-type',snakeBody);
				tmp.setAttribute('data-life',snake.length++);

				getId('score').innerHTML = snake.length;

				snake.X = pX;
				snake.Y = pY;

				do {
					appleX = Math.floor(Math.random() * tilesX);
					appleY = Math.floor(Math.random() * tilesY);
				} while(getId('block-'+appleX+'-'+appleY))

				createPx(appleX, appleY, snakeApple);
			} else {
				getClass('map')[0].style = 'box-shadow:#800 0 0 5px 5px';
				clearInterval(timer);
			}
		} else {
			tmp = getId('block-'+snake.X+'-'+snake.Y);
			tmp.setAttribute('data-type',snakeBody);
			tmp.setAttribute('data-life',snake.length);
			tmp.setAttribute('class','block');

			createPx(pX,pY,snakeHead);
			snake.X = pX;
			snake.Y = pY;

			tmp = getClass('block');
			for(var i=tmp.length-1; i>=0; i--) {
				if(tmp[i].hasAttribute('data-life')) {
					var iLifetime = tmp[i].getAttribute('data-life')-1;
					if (iLifetime)
						tmp[i].setAttribute('data-life',iLifetime);
					else
						tmp[i].remove();
				}
			}
		}
	}
}

function Game() {
	document.body.onkeypress = function(e) {
		switch(e.code) {
			case ARROW_LEFT:
				if(snake.d != 'r')
					snake.tmpDir = 'l';
				break;
			case ARROW_UP:
				if(snake.d != 'd')
					snake.tmpDir = 'u';
				break;
			case ARROW_RIGHT:
				if(snake.d != 'l')
					snake.tmpDir = 'r';
				break;
			case ARROW_DOWN:
				if(snake.d != 'u')
					snake.tmpDir = 'd';
				break;
		}
	}
	timer = window.setInterval(function() {snake.d = snake.tmpDir;	move(snake.d);}, 75);
	createPx(Math.floor((Math.random()*(tilesX-1))+1),Math.floor((Math.random()*(tilesY-1))+1),snakeApple);

	createPx(snake.X,snake.Y,snakeHead);
}

Game();
