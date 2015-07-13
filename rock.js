var rock = {
	particle: null,
	angle: 0,
	rotateSpeed: 0,
	dots: new Array(),
	Size: 0,
	radius: 0,
	getDirection: function(){
		return this.particle.velocity.getAngle();
	},
	getSpeed: function(){
		return this.particle.velocity.getLenght();
	},
	createSpecial: function(x, y, speed, direction, size){
		var obj = Object.create(this);
		var p = particle.create(x, y, speed, direction);
		obj.particle = p;
		console.log("added rock (spill-rock)");
		obj.angle = direction;
		obj.rotateSpeed = Math.round(Math.random()) == 0 ? (0.0088 * size) : (0.0088 * size) * -1;
		obj.Size = size;
		obj.radius = 15 * size;
		this.createDots(obj);
		return obj;
	},
	create: function(shipX, shipY, w, h, Size){
		var obj = Object.create(this);
		var rnd = Math.round(Math.random() * 3);
		var x = 0, y = 0, width = 0, height = 0;
		switch(rnd){
			case 0:
				x = -50;
				y = 0;
				width = 50;
				height = h;
			break;
			case 1:
				x = 0;
				y = -50;
				width = w;
				height = 50;
			break;
			case 2:
				x = w;
				y = 0;
				width = 50;
				height = h;
			break;
			case 3:
				x = 0;
				y = h;
				width = w;
				height = 50;
			break;
		}
		obj.Size = Size;
		obj.radius = 15 * obj.Size;
		obj.rotateSpeed = Math.round(Math.random()) == 0 ? (0.0088 * obj.Size) : (0.0088 * obj.Size) * -1;
		x += Math.random() * width;
		y += Math.random() * height;
		var direction = Math.atan2(shipY - y, shipX - x);
		obj.particle = particle.create(x, y, Size / 4 + 1, direction);
		this.createDots(obj);
		return obj;
	},
	createDots: function(obj){
		if(obj.dots.length > 0){ obj.dots = []; }
		for(var i = 0; i <= 12; i++){
			if(i == 12){
				var d = obj.dots[0];
				obj.dots.push(d);
			}
			else {
				var tAngle = i * Math.PI * (2 / 12),
					dSize = obj.radius / 4,
					index = Math.round(Math.random()) == 0 ? -1 : 1,
					xT = Math.cos(tAngle) * (obj.radius + dSize * index),
					yT = Math.sin(tAngle) * (obj.radius + dSize * index);
				var d = vector.create(xT, yT);
				obj.dots.push(d);
			}
		}
	},
	draw: function(context){
		
		context.save();
		context.translate(this.particle.position.getX(), this.particle.position.getY());
		context.rotate(this.angle);
		context.beginPath();
		for(var i = 0; i < this.dots.length - 1; i++){
			context.moveTo(this.dots[i].getX(), this.dots[i].getY());
			context.lineTo(this.dots[i + 1].getX(), this.dots[i + 1].getY());
		}
		context.stroke();
		context.restore();
	},
	isColiding: function(rock2){
		return this.particle.position.distanceTo(rock2.particle.position) < this.radius + rock2.radius;
	},
	update: function(w, h){
		var pos = this.particle.position;
		if(pos.getX() > w + 50){
			this.particle.position.setX(-50);
		} if(pos.getX() < -50){
			this.particle.position.setX(w + 50);
		} if(pos.getY() > h + 50){
			this.particle.position.setY(-50);
		} if(pos.getY() < -50){
			this.particle.position.setY(h + 50);
		}
		this.particle.update();
		this.angle += this.rotateSpeed;
	}
};