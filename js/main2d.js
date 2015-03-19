// ------------------------------------------------------------------------------
// MIDDLE POINT ALGORITHM 2D DEMO
// Javascript implementation, (C) Matteo Poropat (http://www.matteoporopat.com)
// ------------------------------------------------------------------------------


var ctx;
var square_size;
var grid_size;

// ===============================================================================
// COLOR GRADIENT FUNCTIONS
// ===============================================================================

function gradientP(x,v) {
	this.x=x;
	this.v=v;
}

function getGradient(x, grArray) {
	var v=0;
	for (var i=1; i<grArray.length; i++)
	{
		if (x<=grArray[i].x)
		{
			var t = (x-grArray[i-1].x)/(grArray[i].x-grArray[i-1].x);
			
			var a1 = grArray[i-1].v
			var a2 = grArray[i].v;
			
			var rx = Math.round( (1-t)*((a1>>16)&0x0ff) + t*(a2>>16)&0x0ff );
			var gx = Math.round( (1-t)*((a1>>8)&0x0ff) + t*((a2>>8)&0x0ff) );
			var bx = Math.round( (1-t)*((a1)&0x0ff) + t*((a2)&0x0ff) );
			
			v = rgb2int(rx,gx,bx);
			
			break;
		}
	}
	return v;
}

function rgb2int(r,g,b) {
	return ((r&0x0ff)<<16)|((g&0x0ff)<<8)|(b&0x0ff);
}

function int2rgb(rgb) {
	var r = (rgb>>16)&0x0ff;
	var g = (rgb>>8) &0x0ff;
	var b = (rgb)    &0x0ff;
	return [r,g,b];
}



// ===============================================================================
// OTHER FUNCTIONS
// ===============================================================================

// -------------------------------------------------------------------------
// save canvas to file
// -------------------------------------------------------------------------
function savePicture() {
	log("logarea","saving...");
	saveCanvasToFile('playground');
}


// -------------------------------------------------------------------------
// scale the height value returning a value in [0,1]
// -------------------------------------------------------------------------
function scaleValue(vts) {
	return (vts+Math.abs(MINV))/(Math.abs(MINV)+MAXV)
}


// ----------------------------------------------------------------------
// paint the height MAP according to color gradients
// ----------------------------------------------------------------------
function colorMDP(usecolor) {
	// color gradient definition
	var gradientArray = new Array();
	gradientArray.push( new gradientP(0.00, rgb2int(  0,  0, 20)) ); // dark blue
	gradientArray.push( new gradientP(0.37, rgb2int( 80, 80,200)) ); // light blue
	gradientArray.push( new gradientP(0.42, rgb2int(150,150,255)) ); // cyan
	gradientArray.push( new gradientP(0.45, rgb2int(200,200, 80)) ); // yellow
	gradientArray.push( new gradientP(0.50, rgb2int(  0,190,  0)) ); // green 
	gradientArray.push( new gradientP(0.70, rgb2int( 50,100,  0)) ); // green 
	gradientArray.push( new gradientP(0.78, rgb2int(200, 70,  0)) ); // maroon
	gradientArray.push( new gradientP(0.88, rgb2int(100, 60,  0)) ); // dark maroon
	gradientArray.push( new gradientP(0.95, rgb2int(100,100,100)) ); // grey
	gradientArray.push( new gradientP(0.98, rgb2int(255,255,255)) ); // white
	gradientArray.push( new gradientP(1.00, rgb2int(255,255,255)) ); // white
	// draw the map
	for (var y=0; y<grid_size; y++)
	{
		for (var x=0; x<grid_size; x++)
		{
			var z = scaleValue(MDP2D[x][y]);
			if (usecolor==true)
			{
				var rgb = getGradient(z, gradientArray);
				var r = (rgb>>16)&0x0ff;
				var g = (rgb>>8) &0x0ff;
				var b = (rgb)    &0x0ff;			
				ctx.fillStyle = "rgb("+r+","+g+","+b+")";
			}
			else
			{
				var n = Math.round( 255 * z );	
				ctx.fillStyle = "rgb("+n+","+n+","+n+")";
			}
			ctx.fillRect(x*square_size, y*square_size, square_size, square_size);
		}	
	}		
}


// ----------------------------------------------------------------------
// calculate MDP and draw the grid into the canvas
// ----------------------------------------------------------------------
function startMDP() {
	var canvas = document.getElementById("playground");
	ctx = canvas.getContext("2d");
	// read parameters
	var cSide = parseFloat(document.getElementById('csize').value);
	canvas.width=cSide;
	var step = parseFloat(document.getElementById('step').value);
	var roughness = parseFloat(document.getElementById('roughness').value);
	// grid_size = 1 + 2^step
	grid_size=1+Math.pow(2,step);
	// init grid
	MDP2D = new Array(grid_size);
	for (var i=0; i<grid_size; i++)
		MDP2D[i] = new Array(grid_size);
	// clear log 
	document.getElementById("logarea").value="";
	// correct canvas size according to grid_size
	square_size=Math.floor(cSide/grid_size);
	cSide = square_size*grid_size;
	canvas.width=cSide;
	canvas.height=cSide;
	// reset limits needed to scale the height map
	MAXV=0;
	MINV=1000;
	// initialize four corner to 0.5
	MDP2D[0][0] = 0.5;
	MDP2D[0][grid_size-1] = 0.5;
	MDP2D[grid_size-1][0] = 0.5;
	MDP2D[grid_size-1][grid_size-1] = 0.5;
	
	// start MDP 
	mdp2dIteration(0,0,grid_size-1,cSide/2,roughness);
	
	// output parameters
	log("logarea", "canvas size (px) = "+cSide);
	log("logarea", "grid size (n) = "+grid_size);
	log("logarea", "square size (px) = "+square_size);
	log("logarea", "roughness (%) = "+roughness);
	log("logarea", "maxv = "+MAXV);
	log("logarea", "minv = "+MINV);
	
	colorMDP(false);	

	
	/*
	// middle linear profile
	canvas = document.getElementById("playground2");
	canvas.width=cSide;
	canvas.height=cSide;
	ctx = canvas.getContext("2d");
	
	// values line
	ctx.beginPath();
	ctx.strokeStyle = "#00EE00"
	ctx.lineWidth=1;	
	for (var x=0; x<grid_size; x++)
	{
		var py = Math.round( scaleValue(MDP2D[x][(grid_size-1)/2])*(cSide) );
		if (x==0)
			ctx.moveTo( Math.round( square_size/2 + x*square_size ), cSide-py);
		else
			ctx.lineTo( Math.round( square_size/2 + x*square_size ), cSide-py);
	}	
	ctx.stroke();
	*/
}


// ----------------------------------------------------------------------
// initialize the demo data
// ----------------------------------------------------------------------
function initDemo() {
}

