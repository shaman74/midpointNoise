
// ------------------------------------------------------------------------------
// MIDDLE POINT ALGORITHM
// Javascript implementation, (C) Matteo Poropat (http://www.matteoporopat.com)
// ------------------------------------------------------------------------------

var MDP1D;
var threshold;
var roughness;
var displace;
var points=0;

function Point(x,y, next) {
	this.x = x;
	this.y = y;
	this.next = next;
}

function interpolate(v0, v1, t) {
  return (1-t)*v0 + t*v1;
}


// -------------------------------------------------------------------------------
// initialization function
// -------------------------------------------------------------------------------
function initalizeMDP_1D(width, vin, vfin, pthreshold, proughness, pdisplace) {
	threshold=pthreshold;
	roughness=proughness;
	displace=pdisplace;
	MDP1D = new Array();
	MDP1D.push( new Point(0, vin, 1) );
	MDP1D.push( new Point(width, vfin, -1) );	
}


// -------------------------------------------------------------------------------
// recursive version of generation function
// -------------------------------------------------------------------------------
function generateMDP_1D() {
	while (MDP1D.length<=pointNum) 
	{
		displace=displace*roughness;
		var i=0;
		while (MDP1D[i].next>-1) 
		{
			var p1 = MDP1D[i];
			var p2 = MDP1D[MDP1D[i].next];
			if (p2.x-p1.x>threshold)
			{
				// left point
				var x1 = MDP1D[i].x;
				var y1 = MDP1D[i].y;
				// right point
				var x2 = MDP1D[MDP1D[i].next].x;
				var y2 = MDP1D[MDP1D[i].next].y;
				// middle point
				var xmdp = Math.floor(x1+(x2-x1)/2);
				// the linear interpolated value in the middle point
				var ymdp = interpolate(y1, y2, 0.5); 
				// basic displace of the point, based on segment length
				//displace=(x2-x1)/2;
				// new height = a random value in [-1, 1)*displace
				ymdp = ymdp + (Math.random()*2-1)*displace;
				// new item between the two
				var new_point = MDP1D.length;
				MDP1D[new_point] = new Point(xmdp, ymdp, MDP1D[i].next);
				// updated the pointer
				var old_pointer=MDP1D[i].next;
				MDP1D[i].next = new_point;
				i=old_pointer;
			}
			else
			{
				i=MDP1D[i].next;
			}
		}
	}
}





