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

		this.vx = floor(random(1, 4));
		this.vy = -floor(random(8, 13));

		this.gravity = 1;
	}

	update() {
		this.vy += this.gravity;
		this.x += this.vx;
		this.y += this.vy;

		if (this.y + this.height >= height) {
			this.y = height - this.height;
			this.vx *= 0.8;
			this.vy = 0;
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