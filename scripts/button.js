class Button {
	constructor(name, x, y, width, height, color) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;

		this.textSize = 10;
		this.textColor = 'black';
	}

	render() {
		fill(this.color);
		rect(this.x, this.y, this.width, this.height);

		textSize(this.textSize);
		textAlign(CENTER);
		
		fill(this.textColor);
		text(this.name, this.x + (this.width / 2), this.y + (this.height / 2));
	}
}