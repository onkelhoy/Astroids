var name = "";

function GO(){
	name = document.getElementById("name").value;
	if(name != ""){
		
		document.getElementById("nameInput").remove();
		play();
	}
	else {
		alert("Please enter a name!");
	}
}
function play(){
		var canvasElm = document.createElement("canvas");
		canvasElm.setAttribute("id", "canvas");
		document.body.appendChild(canvasElm);
		
		//just a try song..
		var song = new Audio("http://picosong.com/mkNM");
		song.play();

		var scoreElement = document.getElementById("score"),
			levelElement = document.getElementById("level"),
			liveElement = document.getElementById("live");
		var canvas = document.getElementById("canvas"),
			context = canvas.getContext("2d"),
			width = canvas.width = window.innerWidth, //ändra sen med meny saker!
			height = canvas.height = window.innerHeight * 4/5;

		canvas.style.top = window.innerHeight / 6;
		var bullets = [];
		

		var angle = 0,
			level = 0,
			score = 0,
			shipPosition = vector.create(width/2, height/2),
			isThurstin = false,
			left = false,
			right = false,
			backward = false,
			canShoot = true,
			rocksCount = 0,
			lives = (name == "henry") ? 1337 : 3;
		liveElement.innerHTML = "lives: " + lives;

		var ship = particle.create(width/2, height/2, 0, 0);
		var rocks = [];

		document.addEventListener("keydown", function(event){
			switch(event.keyCode){
				case 38: //up
					isThurstin = true;
					break;
				case 40: //down
					backward = true;
					break;
				case 37: //left
					left = true;
					break;
				case 39: //right
					right = true;
					break;
				case 32: //space
					if(canShoot){
						canShoot = false;
					}
					break;
			}
		});
		document.addEventListener("keyup", function(event){
			switch(event.keyCode){
				case 38: //up
					isThurstin = false;
					break;
				case 40:
					backward = false;
					break;
				case 37: //left
					left = false;
					break;
				case 39: //right
					right = false;
					break;
				case 32:
					canShoot = true;
					break;
			}
		});
		
		var specCounter = 0;
		function shoot(){
			if(specCounter == 0){
				console.log("a one worthy the name!");
				var bullet = particle.create(ship.position.getX() + Math.cos(angle) * 20, ship.position.getY() + Math.sin(angle) * 20, ship.velocity.getLenght() + 4, angle);
				bullets.push(bullet);
			}
			specCounter++;
			var intervall = 5;
			if(specCounter > intervall){
				specCounter = 0;
			}
		}
		AddRocks();
		update();

		function AddRocks(){
			var counter2 = 0;
			var timer2 = setInterval(function(){
				counter2++;
				if(counter2 > 10 && rocksCount < 10 + level){
					rocks.splice(rocks.length, 0, rock.create(ship.position.getX(), ship.position.getY(), width, height, Math.round(Math.random() * 4)));
					counter2 = 0;
					console.log("hello my friend! " + rocks);
					rocksCount++;
				}
			}, 100) 
		}

		function update(){
			if(lives > 0){
				ship.update();
				ShipUpdate();

				if(!canShoot){
					shoot();
				}

				context.clearRect(0, 0, width, height);

				UpdateBullets();
				UpdateRocks();

				ship.velocity.setAngle(angle);
				context.save();
				context.translate(ship.position.getX(), ship.position.getY());
				context.rotate(angle);


				context.beginPath();
				context.moveTo(-15, -11);
				context.lineTo(-15, 11);
				context.moveTo(-15, 11);
				context.lineTo(15, 0);
				context.moveTo(-15, -11);
				context.lineTo(15, 0);
				
				if(isThurstin){
					context.moveTo(-15, 5);
					context.lineTo(-24, 0);
					context.moveTo(-15, -5);
					context.lineTo(-24, 0);
				}

				context.stroke();

				context.restore();

				// make shoot (particles)
				// make a canShoot that is true after a certein time
				// requestAnimationFram mayby have time
				// else.. just add a variabel and increase (k++)
				// then  when k > 120 (2 second (60fps))

				requestAnimationFrame(update);
			}
			else {
				context.clearRect(0, 0, width, height);
				context.font="50px Verdana";
				context.fillText("You Lose!", width/2 - 155, height/2 - 15);

				context.font="18px Verdana";
				context.fillText("Refresh to play again", width/2 - 80, height/2 + 5);
			}
		}
		function Explode(rockIndex, bullet)//can also be ship
		{
			var size = rocks[rockIndex].Size - 1;
			if(size >= 1){
				var newPos = rocks[rockIndex].particle.position.add(bullet.velocity);
				var dx = newPos.getX() - bullet.position.getX(),
					dy = newPos.getY() - bullet.position.getY();
				var angle = Math.atan2(dy, dx);
				var length = bullet.velocity.subtract(rocks[rockIndex].particle.velocity).getLenght();

				var v1 = vector.create(Math.cos(angle) * length, Math.sin(angle) * length),
					v2 = vector.create(Math.cos(angle+Math.PI/2)*length,Math.sin(angle+Math.PI/2)*length);
				v1.addTo(rocks[rockIndex].particle.velocity);
				v2.addTo(rocks[rockIndex].particle.velocity);

				//rock.createSpecial(x, y, speed, direction, size)
				var x = bullet.position.getX() + v1.getX(),
					y = bullet.position.getY() + v1.getY();

				
				var rockTemp1 = rock.createSpecial(x, y, v1.getLenght(), v1.getAngle(), size);
				rocks.push(rockTemp1);

				x = bullet.position.getX() + v2.getX();
				y = bullet.position.getY() + v2.getY();
				console.log(x + " : " + y);
				var rockTemp2 = rock.createSpecial(x, y, v2.getLenght(), v2.getAngle(), size);
				rocks.push(rockTemp2);
				rocksCount+=2;
			}
			else {
				console.log("Rock exploded!");
			}
			rocks.splice(rockIndex, 1);
		}
		function ShipUpdate(){

			if(ship.position.getX() > width + 20){
				ship.position.setX(-20);
			}
			if(ship.position.getX() < -20){
				ship.position.setX(width + 20);
			}
			if(ship.position.getY() > height + 20){
				ship.position.setY(-20);
			}
			if(ship.position.getY() < -20){
				ship.position.setY(height + 20);
			}

			if(isThurstin){
				ship.accelerate(0.05);
			}
			if(backward){
				ship.accelerate(-.05);
			}
			if(left){
				angle -= 0.081;
			}
			if(right){
				angle += 0.081;
			}
		}
	function UpdateBullets(){
		for(var i = 0; i < bullets.length; i++){
			bullets[i].update();
			if(bullets[i].position.outsideMap(width, height, 20)){
				bullets.splice(i, 1);//remove at index at te count of 1
								 //so.. remove at index..
				i--;
			}
			context.beginPath();
			try{
				context.fillStyle = "rgb(28, 0, 168)";
				context.arc(bullets[i].position.getX(), bullets[i].position.getY(), 2, 0, Math.PI * 2, false);
				context.fill();
			}
			catch(err){
			}
		}
	}
	function UpdateRocks(){
		for(var i = 0; i < rocks.length; i++){
			for(var j = 0; j < rocks.length; j++){
				//check rock to rock collision
				if(i != j && rocks[i].isColiding(rocks[j])){
					elastic_bounce(rocks[i], rocks[j]);
				}
			}
			rocks[i].update(width, height);
			rocks[i].draw(context);
			if(rocks[i].particle.position.distanceTo(ship.position) <= rocks[i].radius){
				lives--;
				rocks.splice(i, 1);
				i--;
				rocksCount--;
				liveElement.innerHTML = "lives: " + lives;
			}
			for(var j = 0; j < bullets.length; j++){
				try{
					if(rocks[i].particle.position.distanceTo(bullets[j].position) <= rocks[i].radius){
						score += rocks[i].Size * 10;
						scoreElement.innerHTML = "score: " + score + " xp";
						if(score - level * 100 >= 100){
							level++;
							levelElement.innerHTML = "level: " + level;
						}
						Explode(i, bullets[j]);
						i--;
						bullets.splice(j, 1);
						j--;
						rocksCount--;
					}
				}catch(e){}
			}
		}
	}
};
