class Grid {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.width = 60;
		this.height = 60;
		this.gap = 0;

		this.mouse = {x: -1, y: -1};

		this.tiles = new Array(cols);
		this.menu = new Array(9);
		this.plants = [];
		this.projectiles = [];
		this.enemies = [];
		this.suns = [];

		this.respawnEnemyDelay = 1000;
		this.respawnEnemyTimer = this.respawnEnemyDelay;

		this.sun = 0;
		this.sunMax = 60;
		this.sunToAdd = 25;
		this.sunSpawnDelay = 200;
		this.sunSpawnTimer = this.sunSpawnDelay;

		this.init();
	}

	update() {
		// Update mouse
		this.mouse = {x: mouseX, y: mouseY};

		// Update tiles
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.tiles[y][x].update();
			}
		}

		// Update enemies
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update();
		}

		// Update projectiles
		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].update();
		}

		// Update suns
		for (let i = 0; i < this.suns.length; i++) {
			const sun = this.suns[i];
			sun.update();

			if (mouseIsPressed && mouseButton === LEFT && this.collidePR(this.mouse, sun)) {
				sun.alive = false;
				this.sun += this.sunToAdd;
			}
		}

		// If mouse is pressed, add plant
		if (mouseIsPressed) {
			this.addPlant();
		}
		
		// Generate enemy
		if (this.respawnEnemyTimer === this.respawnEnemyDelay) {
			this.addEnemy();
			this.respawnEnemyTimer = 0;
		}
		else if (this.respawnEnemyTimer < this.respawnEnemyDelay) {
			this.respawnEnemyTimer++;
		}

		// Generate sun
		if (this.sunSpawnTimer === this.sunSpawnDelay) {
			this.suns.push(new Sun(10, height - this.height - 40, 40, 40, 'yellow'));
			this.sunSpawnTimer = 0;
		}
		else if (this.sunSpawnTimer < this.sunSpawnDelay) {
			this.sunSpawnTimer++;
		}

		// Clear dead entities
		this.removeDeadPlants();
		this.removeDeadEnemies();
		this.removeDeadProjectiles();
		this.removeDeadSuns();
	}

	render() {
		// Render tiles
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				this.tiles[y][x].render();
			}
		}

		// Render enemies
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].render();
		}

		// Render projectiles
		for (let i = 0; i < this.projectiles.length; i++) {
			this.projectiles[i].render();
		}

		// Render menu
		for (let i = 0; i < this.menu.length; i++) {
			const menu = this.menu[i];

			fill(menu.color);
			rect(menu.x, menu.y, menu.width, menu.height);
		}

		// Render sun UI
		const sp = map(this.sunSpawnTimer, 0, this.sunSpawnDelay, 0, 60);

		fill('yellow');
		rect(0, height - sp, this.width, sp);

		fill('black');
		textAlign(CENTER);
		text(this.sun, 30, height - (this.height / 2) + 5);

		// Render sun
		for (let i = 0; i < this.suns.length; i++) {
			this.suns[i].render();
		}
	}

	init() {
		// Initialize tiles
		let flag = true;
		let color = '#000000';

		for (let y = 0; y < this.cols; y++) {
			this.tiles[y] = new Array(this.rows);

			if (this.rows % 2 === 0) {
				flag = !flag;
			}

			for (let x = 0; x < this.rows; x++) {
				color = flag ? '#05d519' : '#00aa0b';
				flag = !flag;

				this.tiles[y][x] = new Cell(this.width * x, this.height * y, 
					this.width, this.height, color);
			}
		}

		// Initialize menu
		flag = true;

		for (let i = 0; i < this.menu.length; i++) {
			color = flag ? '#94a8b0' : '#bccbd1';
			flag = !flag;

			this.menu[i] = {x: this.width * (i + 1), y: height - this.height, 
					width: this.width, height: this.height, color: color};
		}
	}

	addPlant() {
		for (let y = 0; y < this.cols; y++) {
			for (let x = 0; x < this.rows; x++) {
				const tile = this.tiles[y][x];

				// If specific tile is clicked
				if (this.collidePR(this.mouse, tile)) {
					// If left click, add plant
					if (mouseButton === LEFT && !tile.occupied && this.sun >= 100) {
						const plant = new Plant(tile.x + (tile.width / 4), tile.y + (tile.height / 4), tile.width / 2, tile.height / 2);

						tile.setEntity(plant);
						this.plants.push(plant);
						this.sun -= 100;
					}
					// If right click, remove plant
					else if (mouseButton === RIGHT && tile.occupied && this.collidePR(this.mouse, tile.entity)) {
						for (let i = 0; i < this.plants.length; i++) {
							if (this.plants[i] === tile.plant) {
								this.plants.splice(i, 1);
								break;
							}
						}

						tile.clearEntity();
					}
				}
			}
		}
	}

	addEnemy() {
		const y = (floor(random(0, this.cols)) * this.height) + 15;

		this.enemies.push(new Enemy(width, y, 30, 30, 'yellow'));
	}

	collidePR(point, rectangle) {
		return ((rectangle.x < point.x && rectangle.x + rectangle.width > point.x) && 
			(rectangle.y < point.y && rectangle.y + rectangle.height > point.y));
	}

	collideRR(a, b) {
		return ((a.x < b.x + b.width && a.x + a.width > b.x) && (a.y < b.y + b.height && a.y + a.height > b.y));
	}

	removeDeadPlants() {
		for (let i = this.plants.length - 1; i >= 0; i--) {
			const plant = this.plants[i];

			if (!plant.alive) {
				this.tiles[plant.col][plant.row].entity = undefined;
				this.tiles[plant.col][plant.row].occupied = false;
				this.plants.splice(i, 1);
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

	removeDeadProjectiles() {
		for (let i = this.projectiles.length - 1; i >= 0; i--) {
			if (!this.projectiles[i].alive) {
				this.projectiles.splice(i, 1);
			}
		}
	}

	removeDeadSuns() {
		for (let i = this.suns.length - 1; i >= 0; i--) {
			if (!this.suns[i].alive) {
				this.suns.splice(i, 1);
			}
		}
	}
}