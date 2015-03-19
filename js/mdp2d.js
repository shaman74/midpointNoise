
// --------------------------------------------------------------------------------------
// MIDDLE POINT ALGORITHM 2D
// Javascript implementation, (C) Matteo Poropat (http://www.matteoporopat.com)
// --------------------------------------------------------------------------------------
// http://godsnotwheregodsnot.blogspot.it/2014/02/i-updated-my-field-diamond-squared.html
// http://code.google.com/p/fractalterraingeneration/source/browse/#svn%2Fwiki
// --------------------------------------------------------------------------------------


var MAXV;
var MINV;
var MDP2D;


// ----------------------------------------------------------------------
// displacement function
// ----------------------------------------------------------------------
function randomDisplace(d) {
	return (Math.random()*2-1)*d;
}

// ----------------------------------------------------------------------
// assign the value updating max and min values
// ----------------------------------------------------------------------
function assignValue(v) {
	if (v>MAXV)
		MAXV=v;
	if (v<MINV)
		MINV=v;
	return v;
}


// ----------------------------------------------------------------------
// calculate an MDP iteration
// 
//   px-size,py-size ----- px,py-size ----- px+size,py-size
//          |                  |                   |
//          |                  |                   |
//          |                  |                   |
//   px-size,py ------------ px,py ------------ px+size,py
//          |                  |                   |
//          |                  |                   |
//          |                  |                   |
//   px-size,py+size ----- px,py+size ----- px+size,py+size
// 
// ----------------------------------------------------------------------
function mdp2dIteration(x0,y0,size,displace,roughness) {
	if (size>1)
	{
		size = size / 2;
		// middle point
		var px = x0+size;
		var py = y0+size;
		MDP2D[px][py] = assignValue( ( MDP2D[px-size][py-size] + MDP2D[px+size][py-size] + MDP2D[px+size][py+size] + MDP2D[px-size][py+size] ) / 4 + randomDisplace(displace) );
		// top point
		if (py-size == 0) // avoid recalculating left point
			MDP2D[px][py-size] = assignValue( ( MDP2D[px-size][py-size] + MDP2D[px+size][py-size] + MDP2D[px][py] ) / 3 + randomDisplace(displace) );
		// left point
		if (px-size == 0) // avoid recalculating top point
			MDP2D[px-size][py] = assignValue( ( MDP2D[px-size][py-size] + MDP2D[px-size][py+size] + MDP2D[px][py] ) / 3 + randomDisplace(displace) );
		// right point
		MDP2D[px+size][py] = assignValue( ( MDP2D[px+size][py-size] + MDP2D[px+size][py+size] + MDP2D[px][py] ) / 3 + randomDisplace(displace) );
		// bottom point
		MDP2D[px][py+size] = assignValue( ( MDP2D[px-size][py+size] + MDP2D[px+size][py+size] + MDP2D[px][py] ) / 3 + randomDisplace(displace) );
		// decrease displace according to the roughness value
		displace = displace*Math.pow(2,(-1)*roughness);
		// calculate next points for the following squares
		mdp2dIteration(px-size,py-size,size,displace,roughness); // top left
		mdp2dIteration(px,     py-size,size,displace,roughness); // bottom left
		mdp2dIteration(px-size,py,     size,displace,roughness); // top right
		mdp2dIteration(px,     py,     size,displace,roughness); // bottom right
	}
}


