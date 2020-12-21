class Grid {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;

		this.width = 60;
		this.height = 60;
		this.gap = 0;

		this.mouse = {x: -1, y: -1};
		this.plantCollection = ['blue', 'orange'];

		this.tiles = new Array(cols);
		this.plants = [];
		this.projectiles = [];
		this.enemies = [];
		this.suns = [];

		this.slots = new Array(6);
		this.selectedSlotIndex = 0;

		this.respawnEnemyDelay = 1000;
		this.respawnEnemyTimer = this.respawnEnemyDelay;

		this.sun = 0;
		this.sunMax = 60;
		this.sunToAdd = 25;
		this.sunSpawnDelay = 200;
		this.sunSpawnTimer = 0;

		this.actionButtons = [];

		this.actionButtons.push(new Button('SUN', 7 * this.width, 0, this.width, this.height, 'yellow'));
		this.actionButtons.push(new Button('PLACE', 8 * this.width, 0, this.width, this.height, 'pink'));
		this.actionButtons.push(new Button('REMOVE', 9 * this.width, 0, this.width, this.height, 'orange'));

		this.selectedActionIndex = 0;

		this.init();
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

				this.tiles[y][x] = new Cell(this.width * x, this.height * (y + 1), 
					this.width, this.height, color);
			}
		}

		// Initialize slot
		flag = true;

		for (let i = 0; i < this.slots.length; i++) {
			color = flag ? '#94a8b0' : '#bccbd1';
			flag = !flag;

			this.slots[i] = new Cell(this.width * (i + 1), 0, this.width, this.height, color);

			if (i < this.plantCollection.length) {
				this.slots[i].setEntity(this.plantCollection[i]);
			}
		}
	}

	update() {
		// Update mouse
		this.mouse = {x: mouseX, y: mouseY};

		// Update tiles
		for (let y = 0; y < this.tiles.length; y++) {
			for (let x = 0; x < this.tiles[y].length; x++) {
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

		// Update suns and i mouse is pressed, and collide with any suns
		for (let i = 0; i < this.suns.length; i++) {
			const sun = this.suns[i];
			sun.update();

			if (mouseIsPressed && mouseButton === LEFT && this.selectedActionIndex === 0 && this.collidePR(this.mouse, sun)) {
				sun.alive = false;
				this.sun += this.sunToAdd;
			}
		}

		// If mouse is pressed, and collide with any slots
		for (let i = 0; i < this.slots.length; i++) {
			const slot = this.slots[i];

			if (mouseIsPressed && mouseButton === LEFT && slot.occupied && this.collidePR(this.mouse, slot)) {
				this.selectedSlotIndex = i;
			}
		}

		// If mouse is pressed, and collide with any action buttons
		for (let i = 0; i < this.actionButtons.length; i++) {
			const button = this.actionButtons[i];

			if (mouseIsPressed && mouseButton === LEFT && this.collidePR(this.mouse, button)) {
				this.selectedActionIndex = i;
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
			this.suns.push(new Sun(10, 60, 40, 40, 'yellow'));
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
		for (let y = 0; y < this.tiles.length; y++) {
			for (let x = 0; x < this.tiles[y].length; x++) {
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

		// Render sun UI
		const sp = map(this.sunSpawnTimer, 0, this.sunSpawnDelay, 0, 60);

		fill('yellow');
		rect(0, 60 - sp, this.width, sp);

		// Render sun value
		fill('black');
		textAlign(CENTER);
		textSize(20);
		text(this.sun, 30, (this.height / 2) + 5);

		// Render slot
		for (let i = 0; i < this.slots.length; i++) {
			const slot = this.slots[i];

			slot.render();

			if (i === this.selectedSlotIndex) {
				fill(255, 0, 0, 130);
				rect(slot.x, slot.y, slot.width, slot.height);
			}
		}

		// Render buttons
		for (let i = 0; i < this.actionButtons.length; i++) {
			const button = this.actionButtons[i];

			button.render();

			if (i === this.selectedActionIndex) {
				fill(0, 100, 150, 130);
				rect(button.x, button.y, button.width, button.height);
			}
		}

		// Render sun
		for (let i = 0; i < this.suns.length; i++) {
			this.suns[i].render();
		}
	}

	addPlant() {
		for (let y = 0; y < this.tiles.length; y++) {
			for (let x = 0; x < this.tiles[y].length; x++) {
				const tile = this.tiles[y][x];

				// If specific tile is clicked
				if (mouseButton === LEFT && this.collidePR(this.mouse, tile)) {
					// If left click, add plant
					if (this.selectedActionIndex === 1 && !tile.occupied) {
						const selectedPlant = this.slots[this.selectedSlotIndex].entity;

						if (this.sun >= selectedPlant.cost) {
							tile.setEntity(selectedPlant.name);
							this.plants.push(tile.entity);
							this.sun -= selectedPlant.cost;
						}
					}
					// If right click, remove plant
					else if (this.selectedActionIndex === 2 && tile.occupied && this.collidePR(this.mouse, tile.entity)) {
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
		const y = (floor(random(1, this.tiles.length + 1)) * this.height) + 15;

		this.enemies.push(new Enemy(width, y, 30, 30, 'brown'));
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