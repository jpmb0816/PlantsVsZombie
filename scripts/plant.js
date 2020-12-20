class Plant {
	constructor(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.ox = x;
		this.oy = y;

		this.width = width;
		this.height = height;
		this.ow = width;
		this.oh = height;

		this.color = 'white';
		this.shootColor = 'green';
		this.currentColor = this.color;

		this.projectileDelay = 150;
		this.projectileTimer = 0;

		this.projectileWidth = 20;
		this.projectileHeight = 5;
		this.projectileColor = 'gray';
		this.xd = 0;
	}

	update() {
		this.x = this.ox - this.xd;
		this.y = this.oy - this.xd;
		this.width = this.ow + (this.xd * 2);
		this.height = this.oh + (this.xd * 2);

		if (this.projectileTimer === this.projectileDelay) {
			grid.projectiles.push(new Projectile(this.x + this.width, 
				(this.y + (this.height / 2)) - (this.projectileHeight / 2), 
				this.projectileWidth, this.projectileHeight, this.projectileColor));

			this.projectileTimer = 0;
			this.xd = 0;
		}
		else if (this.projectileTimer < this.projectileDelay) {
			this.projectileTimer++;
			this.xd += 0.05;
		}
	}

	render() {
		fill(this.currentColor);
		rect(this.x, this.y, this.width, this.height);
	}
}