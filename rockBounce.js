function elastic_bounce(r1, r2){//balls
	var v1x = r1.particle.position.getX(),
		v1y = r1.particle.position.getY(),
		l1 = r1.getSpeed(),
		d1 = r1.getDirection(),
		m1 = r1.Size,
		v2x = r2.particle.position.getX(),
		v2y = r2.particle.position.getY(),
		l2 = r2.getSpeed(),
		d2 = r2.getDirection(),
		m2 = r2.Size;

	var A = Math.atan2(v1y - v2y, v1x - v2x);

	
	doApart(r1, r2);
	if(r1.isColiding(r2)){
		doApart(r1, r2);
	}

	var v1 = getBounce_Velocity(l1, d1, m1, l2, d2, m2, A),
		v2 = getBounce_Velocity(l2, d2, m2, l1, d1, m1, A);//swapped

	r1.particle.velocity = v1;
	r2.particle.velocity = v2;
}
function doApart(r1, r2){
	var v1x = r1.particle.position.getX(),
		v1y = r1.particle.position.getY(),
		v2x = r2.particle.position.getX(),
		v2y = r2.particle.position.getY();

	var A = Math.atan2(v2y - v1y, v2x - v1x);
	var dr = r1.radius + r2.radius - r1.particle.position.distanceTo(r2.particle.position) + 0.8;
	var push = vector.create(Math.cos(A) * dr/2, Math.sin(A) * dr/2);
	//find out which of the balls should be added.. and which should be subracted
	var vecTemp1 = r1.particle.position.add(push);
	var vecTemp2 = r2.particle.position.subtract(push);
	if(vecTemp1.distanceTo(vecTemp2) > r1.particle.position.distanceTo(r2.particle.position)){
		//this is oke
		r1.particle.position.addTo(push);
		r2.particle.position.subtractFrom(push);
	}
	else {
		//the other way
		r1.particle.position.subtractFrom(push);
		r2.particle.position.addTo(push);
	}
}
function getBounce_Velocity(l1, d1, m1, l2, d2, m2, A){
	var comb = (l1 * Math.cos(d1 - A) * (m1 - m2) + 2 * m2 * l2 * Math.cos(d2 - A))/(m1 + m2);
	var x = comb + Math.cos(A) + l1 * Math.sin(d1 - A) * Math.cos(A + Math.PI / 2);
	var y = comb + Math.sin(A) + l1 * Math.sin(d1 - A) * Math.sin(A + Math.PI / 2);
	var friction = 0.538;
	x *= friction;
	y *= friction;
	return vector.create(x, y);
}