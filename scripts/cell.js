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

	setEntity(entity) {
		this.entity = entity;
		this.occupied = true;
	}

	clearEntity() {
		this.entity = undefined;
		this.occupied = false;
	}
}