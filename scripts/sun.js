class Sun {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.alive = true;

		this.aliveDelay = 500;
		this.aliveTimer = this.aliveDelay;

		this.movementDelay = 3;
		this.movementTimer = 0;

		this.vx = floor(random(1, 4));
		this.vy = floor(random(1, 4));

		this.gravity = 1;
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

		if (this.x > width || this.y > height) {
			this.alive = false;
		}
		if (this.aliveTimer === 0) {
			this.aliveTimer = this.aliveDelay;
			this.alive = false;
		}
		else {
			this.aliveTimer--;
		}
	}

	render() {
		fill(this.color);
		rect(this.x, this.y, this.width, this.height);
	}
}