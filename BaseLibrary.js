var vector = {
	_x : 1,
	_y : 0,
	create : function(x, y){
		var obj = Object.create(this);
		obj.setX(x);
		obj.setY(y);
		return obj;
	},
	setX : function(value){
		this._x = value;
	},
	getX : function(){
		return this._x;
	},
	setY : function(value){
		this._y = value;
	},
	getY : function(){
		return this._y;
	},
	setAngle : function(angle){
		var length = this.getLenght();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},
	getAngle : function(){
		return Math.atan2(this._y, this._x);
	},
	setLenght : function(length){
		var angle = this.getAngle();
		this._x = Math.cos(angle) * length;
		this._y = Math.sin(angle) * length;
	},
	getLenght: function(){
		return Math.sqrt(this._x * this._x + this._y * this._y);
	},
	add: function(v2){
		return vector.create(this._x + v2.getX(), this._y + v2.getY());
	},
	subtract: function(v2){
		return vector.create(this._x - v2.getX(), this._y - v2.getY());
	},
	multiply: function(val){
		return vector.create(this._x * val, this._y * val);
	},
	divide: function(val){
		return vector.create(this._x / val, this._y / val);
	},
	addTo: function(v2){
		this._x += v2.getX();
		this._y += v2.getY();
	},
	subtractFrom: function(v2){
		this._x -= v2.getX();
		this._y -= v2.getY();
	},
	multiplyBy: function(val){
		this._x *= val;
		this._y *= val;
	},
	multiplyX: function(val){
		this._x *= val;
	},
	multiplyY: function(val){
		this._y *= val;
	},
	divideBy: function(val){
		this._x /= val;
		this._y /= val;
	},
	outsideMap: function(width, height, size){
		if(this._x > width + size){
			return true;
		}
		else if(this._x < -size){
			return true;
		}
		else if(this._y > height + size){
			return true;
		}
		else if(this._y < -size){
			return true;
		}
		else {
			return false;
		}
	},
	distanceTo: function(v2){
		var dx = v2.getX() - this._x,
			dy = v2.getY() - this._y;
		return Math.sqrt(dx * dx + dy * dy);
	}
};
var particle = {
	position: null,
	velocity: null,

	create: function(xPos, yPos, speed, direction){
		var obj = Object.create(this);
		obj.position = vector.create(xPos, yPos);
		obj.velocity = vector.create(0, 0);
		obj.velocity.setLenght(speed);
		obj.velocity.setAngle(direction);
		return obj;
	},

	update: function(){
		this.position.addTo(this.velocity);
	},
	accelerate: function(accel){
		var currentSpeed = this.velocity.getLenght();
		this.velocity.setLenght(currentSpeed + accel);
	}
};