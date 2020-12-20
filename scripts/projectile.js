class Projectile {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.alive = true;
		this.damage = 10;

		this.vx = 2;
		this.vy = 0;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;

		if (this.x > width) {
			this.alive = false;
		}
	}

	render() {
		fill(this.color);
		rect(this.x, this.y, this.width, this.height);
	}
}