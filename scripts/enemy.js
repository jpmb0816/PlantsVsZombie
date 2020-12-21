class Enemy {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.row = floor(this.x / grid.width);
		this.col = floor(this.y / grid.height);

		this.color = color;
		this.hitColor = 'red';
		this.attackColor = 'violet';
		this.currentColor = this.color;

		this.alive = true;
		this.health = 100;
		this.damage = 5;

		this.vx = -1;
		this.vy = 0;
		this.ovx = this.vx;
		this.ovy = this.vy;

		this.movementDelay = 10;
		this.movementTimer = 0;

		this.isHitted = false;
		this.hitAnimationDelay = 8;
		this.hitAnimationTimer = this.hitAnimationDelay;

		this.attackAnimationDelay = 50;
		this.attackAnimationTimer = 0;
	}

	update() {
		// Update current row and col position
		this.row = floor(this.x / grid.width);
		this.col = floor(this.y / grid.height);

		// Movement delay
		if (this.movementTimer === this.movementDelay) {
			this.x += this.vx;
			this.y += this.vy;
			this.movementTimer = 0;
		}
		else if (this.movementTimer < this.movementDelay) {
			this.movementTimer++;
		}

		// Hit animation
		if (this.isHitted) {
			if (this.hitAnimationTimer === 0) {
				this.hitAnimationTimer = this.hitAnimationDelay;
				this.currentColor = this.color;
				this.isHitted = false;
			}
			else {
				this.hitAnimationTimer--;
				this.currentColor = this.hitColor;
			}
		}

		// Check if alive
		if (this.x + this.width < 0 || this.health <= 0) {
			this.alive = false;
		}
		else {
			for (let i = 0; i < grid.projectiles.length; i++) {
				if (grid.collideRR(this, grid.projectiles[i])) {
					grid.projectiles[i].alive = false;
					this.receiveDamage(grid.projectiles[i].damage);
					break;
				}
			}
		}

		// Enemy will eat the entity they collided with
		for (let x = 0; x < grid.tiles[this.col].length; x++) {
			const tile = grid.tiles[this.col][x];

			if (tile.occupied && grid.collideRR(this, tile.entity)) {
				this.attack(tile.entity);

				if (this.vx != 0) {
					this.vx = 0;
				}

				break;
			}
			else if (this.vx === 0) {
				this.vx = this.ovx;
			}
		}
	}

	render() {
		fill(this.currentColor);
		rect(this.x, this.y, this.width, this.height);
	}

	attack(entity) {
		if (this.attackAnimationTimer === this.attackAnimationDelay) {
			entity.receiveDamage(this.damage);
			this.attackAnimationTimer = 0;
		}
		else if (this.attackAnimationTimer < this.attackAnimationDelay) {
			this.attackAnimationTimer++;
		}
	}

	receiveDamage(damage) {
		this.health -= damage;
		this.isHitted = true;
	}
}