class Cell {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.occupied = false;
		this.entity = undefined;
	}

	update() {
		if (this.entity) {
			this.entity.update();
		}
	}

	render() {
		fill(this.color);
		rect(this.x, this.y, this.width, this.height);

		if (this.entity) {
			this.entity.render();
		}
	}

	setEntity(name) {
		this.entity = this.getEntity(name);
		this.occupied = true;
	}

	clearEntity() {
		this.entity = undefined;
		this.occupied = false;
	}

	getEntity(name) {
		switch (name) {
			case 'blue':
				return new Plant('blue', this.x + (this.width / 4), this.y + (this.height / 4), this.width / 2, this.height / 2, 'blue', 50, 10);
			case 'orange':
				return new Plant('orange', this.x + (this.width / 4), this.y + (this.height / 4), this.width / 2, this.height / 2, 'orange', 100, 20);
		}

		return undefined;
	}
}