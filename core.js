class GameCore {

	constructor(canvId) {

		this.cnv = document.getElementById(canvId);
		this.ctx = this.cnv.getContext('2d');

		this.cnv.width  = innerWidth;
		this.cnv.height = innerHeight;

		this.baseSpeed = 3;

		this.gameStarted = false;
		this.gameEnd 	 = false;

		this.snake = {
			speed: 3,
			size: 20,
			xv: 0,
			yv: -3,
			tailLength: 50,
			tail: [],
			tsz: 20,
			pos: {
				x: this.cnv.width/2,
				y: this.cnv.height/2
			}
		}

		this.cooldown				= false;
		this.score					= 0;
		this.id 					= 3;
		this.apples 				= [];
		this.applesCount			= 1;

		this.logIn();
		this.loadProgress();

		document.addEventListener('keydown', (e)=>this.controller(e));
	}

	loop() {
		if(this.gameEnd) return 0;
		this.logic();
		this.move();
		this.draw();
	}

	logic() {
		// Adding and removing parts of the snake's tail
		this.snake.tail.push({
			x: this.snake.pos.x, 
			y: this.snake.pos.y,
			color: 'lime'
		});
		if(this.snake.tail.length > this.snake.tailLength) this.snake.tail.shift();

		// End game
		if(this.gameStarted) {
			for(let i=this.snake.tail.length-this.snake.tsz;i>=0;i--)
			{
				if( this.snake.pos.x < (this.snake.tail[i].x + this.snake.size)
					&& this.snake.pos.x + this.snake.size > this.snake.tail[i].x
					&& this.snake.pos.y < (this.snake.tail[i].y + this.snake.size)
					&& this.snake.pos.y + this.snake.size > this.snake.tail[i].y)
				{
					this.end();
					break;
				}
			}	
		}
		
		// Generate apples
		if(this.apples.length < this.applesCount) this.appleGenerator(this.applesCount);
		
		// Eat apples
		for(let i=0;i<this.apples.length;i++)
		{
			if( this.snake.pos.x < (this.apples[i].x + this.snake.size) &&
				this.snake.pos.x + this.snake.size > this.apples[i].x   &&
				this.snake.pos.y < (this.apples[i].y + this.snake.size) &&
				this.snake.pos.y + this.snake.size > this.apples[i].y) {
				
				let eat = new Audio();
				eat.src = './Sounds/eat.mp3';
				eat.volume = .5 ;
				eat.play();

				this.apples.splice(i, 1); 
				this.snake.tailLength += 10; 
				this.snake.speed += .1;

				this.score++;
				break;
			}
		}		
	}

	draw() {

		// Clear the canvas
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);

		// Drawing a snake
		for(let i=0;i<this.snake.tail.length;i++) {
			this.ctx.fillStyle = this.snake.tail[i].color || 'green';
			this.ctx.fillRect(this.snake.tail[i].x, this.snake.tail[i].y, this.snake.size, this.snake.size);
		}

		// Drawing apples
		for(let i=0;i<this.apples.length;i++) {
			this.ctx.fillStyle = this.apples[i].color || 'red';
			this.ctx.fillRect(this.apples[i].x, this.apples[i].y, this.apples[i].size, this.apples[i].size);
		}

		// Show score
		this.ctx.fillStyle = '#333';
		this.ctx.font = '35px sans-serif';
		this.ctx.fillText(`Score: ${this.score}`, 25, 55);

		if(this.gameEnd) {
			this.ctx.fillStyle = 'rgba(0, 0, 0, .8)';
			this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
			this.ctx.fillStyle = 'white';
			this.ctx.font = '64px sans-serif';
			this.ctx.fillText('You lose!', this.cnv.width/2-125, this.cnv.height/2)
		}
	}

	move() {

		// Movement
		this.snake.pos.x += this.snake.xv;
		this.snake.pos.y += this.snake.yv;

		// Teleports on the borders
		if(this.snake.pos.x > this.cnv.width) this.snake.pos.x = 0;
		if(this.snake.pos.x < 0) this.snake.pos.x = this.cnv.width;
		if(this.snake.pos.y < 0) this.snake.pos.y = this.cnv.height;
		if(this.snake.pos.y > this.cnv.height) this.snake.pos.y = 0;
	}

	controller(e) {

		if(!this.gameStarted) setTimeout(()=>this.gameStarted = true, 250);	

		if(this.gameEnd) window.location.reload();

		if(this.cooldown) return 0;

		if(e.keyCode == 37 && !(this.snake.xv > 0)) { this.snake.xv = -this.snake.speed; this.snake.yv = 0; } // Left
		if(e.keyCode == 38 && !(this.snake.yv > 0)) { this.snake.xv = 0; this.snake.yv = -this.snake.speed; } // Top
		if(e.keyCode == 39 && !(this.snake.xv < 0)) { this.snake.xv =  this.snake.speed; this.snake.yv =0; } // Right
		if(e.keyCode == 40 && !(this.snake.yv < 0)) { this.snake.xv = 0; this.snake.yv = this.snake.speed; } // Down

		this.cooldown = true;
		setTimeout(()=>{ this.cooldown = false }, 150);		
	}

	appleGenerator(limit) {
		for(let i=0;i<limit;i++) {
			this.apples.push({ 
				x: this.random(25, this.cnv.width-25),
				y: this.random(25, this.cnv.height-25),
				color: 'red',
				size: 20 
			});	
		}
	}

	uploadProgress() {
		let gameResults = {
			id: this.id,
			score: this.score
		};

		fetch('save.php', {
			method: 'POST',  
			headers: {
    			'Content-Type': 'application/json;charset=utf-8'
  			},
			body: JSON.stringify(gameResults)
		})
	}

	loadProgress() {
		fetch('save.php', {
			method: 'POST',  
			headers: {
    			'Content-Type': 'application/json;charset=utf-8'
  			},
			body: JSON.stringify({id: this.id})
		}) .then(resp => resp.json())
		   .then(res  => this.score = res.count)
		fetch('save.php')

	}
	logIn() {

	}

	end() {
		this.uploadProgress();
		this.gameEnd = true;
	}

	random(min, max) { return Math.random() * (max - min) + min; }
}