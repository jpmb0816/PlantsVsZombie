class Plant {
	constructor(name, x, y, width, height, color, cost, damage) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.ox = x;
		this.oy = y;

		this.row = -1;
		this.col = -1;

		this.width = width;
		this.height = height;
		this.ow = width;
		this.oh = height;

		this.cost = cost;

		this.color = color;
		this.hitColor = 'red';
		this.currentColor = this.color;

		this.alive = true;
		this.health = 100;
		this.damage = damage;

		this.isHitted = false;
		this.hitAnimationDelay = 8;
		this.hitAnimationTimer = this.hitAnimationDelay;

		this.projectileDelay = 150;
		this.projectileTimer = 0;

		this.projectileWidth = 20;
		this.projectileHeight = 5;
		this.projectileColor = 'gray';
		this.xd = 0;
	}

	update() {
		this.row = floor(this.x / grid.width);
		this.col = floor(this.y / grid.height);

		this.x = this.ox - this.xd;
		this.y = this.oy - this.xd;
		this.width = this.ow + (this.xd * 2);
		this.height = this.oh + (this.xd * 2);

		// Check if theres an enemy to shoot in relative y
		if (this.hasEnemyInRelativeY()) {
			// Throws projectile
			if (this.projectileTimer === this.projectileDelay) {
				grid.projectiles.push(new Projectile(this.x + this.width, 
					(this.y + (this.height / 2)) - (this.projectileHeight / 2), 
					this.projectileWidth, this.projectileHeight, this.projectileColor, this.damage));

				this.projectileTimer = 0;
				this.xd = 0;
			}
			else if (this.projectileTimer < this.projectileDelay) {
				this.projectileTimer++;

				if (this.projectileTimer % 30 === 0) {
					this.xd++;
				}
			}
		}
		else {
			this.projectileTimer = 0;
			this.xd = 0;
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
		if (this.health <= 0) {
			this.alive = false;
		}
	}

	render() {
		fill(this.currentColor);
		rect(this.x, this.y, this.width, this.height);
	}

	receiveDamage(damage) {
		this.health -= damage;
		this.isHitted = true;
	}

	hasEnemyInRelativeY() {
		for (let i = 0; i < grid.enemies.length; i++) {
			const enemy = grid.enemies[i];

			if (this.col === enemy.col) {
				return true;
			}
		}

		return false;
	}
}