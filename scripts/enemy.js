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
		this.currentColor = this.color;

		this.alive = true;
		this.health = 100;
		this.damage = 10;

		this.vx = -1;
		this.vy = 0;
		this.ovx = this.vx;
		this.ovy = this.vy;

		this.movementDelay = 8;
		this.movementTimer = 0;

		this.hitAnimationDelay = 8;
		this.hitAnimationTimer = 0;

		this.attackAnimationDelay = 100;
		this.attackAnimationTimer = 0;
	}

	update() {
		this.row = floor(this.x / grid.width);
		this.col = floor(this.y / grid.height);

		if (this.movementTimer === this.movementDelay) {
			this.x += this.vx;
			this.y += this.vy;
			this.movementTimer = 0;
		}
		else if (this.movementTimer < this.movementDelay) {
			this.movementTimer++;
		}

		if (this.hitAnimationTimer > 0) {
			this.hitAnimationTimer--;
			this.currentColor = this.hitColor;
		}
		else {
			this.currentColor = this.color;
		}

		if (this.x + this.width < 0 || this.health < 0) {
			this.alive = false;
		}
		else {
			for (let i = 0; i < grid.projectiles.length; i++) {
				if (grid.collideRR(this, grid.projectiles[i])) {
					grid.projectiles[i].alive = false;
					this.health -= grid.projectiles[i].damage;
					this.hitAnimationTimer = this.hitAnimationDelay;
					break;
				}
			}
		}

		for (let x = 0; x < grid.tiles[this.col].length; x++) {
			const tile = grid.tiles[this.col][x];

			if (tile.occupied && grid.collideRR(this, tile.entity)) {
				// this.eat(tile.entity);
				tile.entity.health--;

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

	eat(entity) {
		if (this.attackAnimationTimer === this.attackAnimationDelay) {
			entity.health -= this.damage;
			this.attackAnimationTimer = 0;
			this.currentColor = this.attackColor;
		}
		else if (this.attackAnimationTimer < this.attackAnimationDelay) {
			this.attackAnimationTimer++;
			this.currentColor = this.color;
		}
	}
}