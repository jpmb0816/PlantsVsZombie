class Cell {
	constructor(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.occupied = false;
		this.plant = undefined;
	}

	update() {
		if (this.plant) {
			this.plant.update();
		}
	}

	render() {
		fill(this.color);
		rect(this.x, this.y, this.width, this.height);

		if (this.plant) {
			this.plant.render();
		}
	}

	addPlant() {
		if (!this.occupied) {
			this.plant = new Plant(this.x + (this.width / 4), this.y + (this.height / 4), this.width / 2, this.height / 2);
			this.occupied = true;
		}
	}

	removePlant() {
		if (this.occupied && grid.collidePR(grid.mouse, this.plant)) {
			this.plant = undefined;
			this.occupied = false;
		}
	}
}