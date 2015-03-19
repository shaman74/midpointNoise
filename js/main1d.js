

var canvas;
var ctx;
var canvasData;
var cWidth;
var cHeight;
var pointNum=32;
var square;


function initDemo() {
	canvas = document.getElementById("playground");
	ctx = canvas.getContext("2d");
	cWidth=canvas.width;
	cHeight=canvas.height;
	canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);	

	square=cWidth/pointNum;
	// grey grid
	ctx.beginPath();
	ctx.strokeStyle = "#EEEEEE"
	ctx.lineWidth=1;	
	for(var i=1; i<pointNum; i++)
	{
		ctx.moveTo(0, i*square);
		ctx.lineTo(pointNum*square, i*square);
		ctx.moveTo(i*square, 0);
		ctx.lineTo(i*square, pointNum*square);
	}	
	ctx.stroke();
	
	// MDP
	initalizeMDP_1D(cWidth, 150+Math.random()*50, 150+Math.random()*50, square, 0.5, 140);
	generateMDP_1D();
	
	// squared height map
	i=0;
	ctx.fillStyle = "#dddddd";
	while (i>-1)
	{
		var p = MDP1D[i];
		var cy = Math.floor( (cHeight-p.y)/square ) * square;
		ctx.fillRect(p.x, cy, square, cHeight-cy );
		i=MDP1D[i].next;
	}	

	// linear height map
	ctx.beginPath();
	ctx.strokeStyle = "Blue"
	var i=0;
	ctx.moveTo(0, cHeight-MDP1D[0].y);
	i=MDP1D[0].next;
	while (i>-1)
	{
		var p = MDP1D[i];
		ctx.lineTo(p.x, cHeight-p.y);
		i=MDP1D[i].next;
	}
	ctx.stroke();
	


}



