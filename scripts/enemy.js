class Enemy {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.hitColor = 'red';
		this.currentColor = this.color;
		this.alive = true;

		this.health = 100;

		this.vx = -1;
		this.vy = 0;

		this.movementDelay = 8;
		this.movementTimer = 0;

		this.hitAnimationDelay = 8;
		this.hitAnimationTimer = 0;
	}

	update() {
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
	}

	render() {
		fill(this.currentColor);
		rect(this.x, this.y, this.width, this.height);
	}
}