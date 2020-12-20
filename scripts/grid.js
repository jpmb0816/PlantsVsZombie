class Grid {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.width = 60;
		this.height = 60;
		this.gap = 0;

		this.mouse = {x: -1, y: -1};

		this.tile = new Array(cols);
		this.projectiles = [];
		this.enemies = [];

		this.respawnDelay = 500;
		this.respawnTimer = this.respawnDelay;

		this.init();
	}

	update() {
		this.mouse = {x: mouseX, y: mouseY};

		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.tile[y][x].update();
			}
		}

		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update();
		}

		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].update();
		}

		if (mouseIsPressed) {
			this.addPlant();
		}
		
		if (this.respawnTimer === this.respawnDelay) {
			this.addEnemy();
			this.respawnTimer = 0;
		}
		else if (this.respawnTimer < this.respawnDelay) {
			this.respawnTimer++;
		}

		this.removeDeadProjectiles();
		this.removeDeadEnemies();
	}

	render() {
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.tile[y][x].render();
			}
		}

		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].render();
		}

		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].render();
		}
	}

	init() {
		let flag = true;
		let color = '#000000';

		for (let y = 0; y < this.cols; y++) {
			this.tile[y] = new Array(this.rows);

			if (this.rows % 2 === 0) {
				flag = !flag;
			}

			for (let x = 0; x < this.rows; x++) {
				color = flag ? '#05d519' : '#00aa0b';
				flag = !flag;

				this.tile[y][x] = new Cell(this.width * x, this.height * y, 
					this.width, this.height, color);
			}
		}
	}

	addPlant() {
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				const tile = this.tile[y][x];

				if (this.collidePR(this.mouse, tile)) {
					if (mouseButton === LEFT) {
						tile.addPlant();
					}
					else if (mouseButton === RIGHT) {
						tile.removePlant();
					}
				}
			}
		}
	}

	addEnemy() {
		const y = (floor(random(0, 10)) * this.height) + 15;

		this.enemies.push(new Enemy(width, y, 30, 30, 'yellow'));
	}

	collidePR(point, rectangle) {
		return ((rectangle.x < point.x && rectangle.x + rectangle.width > point.x) && 
			(rectangle.y < point.y && rectangle.y + rectangle.height > point.y));
	}

	collideRR(a, b) {
		return ((a.x < b.x + b.width && a.x + a.width > b.x) && (a.y < b.y + b.height && a.y + a.height > b.y));
	}

	removeDeadProjectiles() {
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			if (!this.projectiles[i].alive) {
				this.projectiles.splice(i, 1);
			}
		}
	}

	removeDeadEnemies() {
		for (let i = this.enemies.length - 1; i >= 0; i--) {
			if (!this.enemies[i].alive) {
				this.enemies.splice(i, 1);
			}
		}
	}
}