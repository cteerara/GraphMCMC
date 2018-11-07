'use strict';

// State Space Functions
class State{
  // Statespace of the Markov Chain Monte Carlo simulation. In this case it will contain an adjacency matrix representing a graph, and the source vertex. 

// CONSTRUCTOR
  constructor(pts,s){
    //INPUT: n-by-2 array indicating the positions of each vertices
    //       integer s
    //OUTPUT: Construct an n x n adjacency matrix of zeros and a source nodes < n

    var n = pts.length
    var tmparr = new Array(n)
    for (var i=0;i<n;i++) tmparr[i] = new Array(n)
   
     
    var x1 = 0
    var x2 = 0
    var y1 = 0
    var y2 = 0
    for (i=0;i<n;i++){
      for (var j=0;j<n;j++){
      
        x1 = pts[i][0]
        x2 = pts[j][0]

        y1 = pts[i][1]
        y2 = pts[j][1]

        tmparr[i][j] = Math.sqrt( Math.pow(x1-x2,2) + Math.pow(y1-y2,2) )
      }
    }

    this.AdjMatrix = tmparr
    this.Source = s
    this.VertexNumber = n
    this.Pts = pts
		this.EdgeNumber = n*(n-1)/2		

  }

//--- METHODS ---
  RemoveEdge(u,v){
    //Remove (u,v) edge
    //INPUT:  vertex u and v

    this.AdjMatrix[u][v] = 0
    this.AdjMatrix[v][u] = 0
		this.EdgeNumber = this.EdgeNumber-1
  }

  AddEdge(u,v){
    //Add (u,v) edge
    //INPUT: vertex u and v
   
    var uu = this.Pts[u]
    var vv = this.Pts[v]

    this.AdjMatrix[u][v] = Math.sqrt( Math.pow(uu[0]-vv[0],2) + Math.pow(uu[1]-vv[1],2) )
    this.AdjMatrix[v][u] = this.AdjMatrix[u][v]  

		this.EdgeNumber = this.EdgeNumber+1
  }
	
	ChangeSource(v){
		//Change source vertex to vertex v
		this.Source = v			
	}	
	

}

//***********************************************************************************************

// GRAPH TRAVERSALS
function getMinDist(dist, sptSet){
    
  var nodecount = dist.length;
  var min = Infinity;    
  var minidx = 0;

  for (var i=0;i<nodecount;i++){
    if (sptSet[i] == false & dist[i] <=min){
      min = dist[i];
      minidx = i;
    }
  }
  
  return minidx;
}

// All Pair Shortest Path
function getLenSP(S){
  // Calculate the length of the shortest path in the state space S from source to vertex t  
  //INPUT: State object S
  //       target vertex t
  //OUTPUT: Array of length S.VertexNumber each member indicate the distance of the shortest path from S.source to that vertex

  var n = S.VertexNumber;  
  var source = S.Source;
  var adjmat = S.AdjMatrix;
  var visited = new Array(n)
  var dist = new Array(n)
  
  // Initialize distance and visited array
  for (var i =0;i<n;i++){
    dist[i] = Infinity;
    visited[i] = false;
  }

  // Set dist and visited at source
  dist[source] = 0;
  
  var mindist = 0;
  // Itirate through n-1 times to get all the members
  for(i=0;i<n;i++){

    // Get next vertex to search
    var w = getMinDist(dist, visited);
    visited[w] = true;

    // Search through neighbor of u
    for (var u=0; u<n; u++){
      
      if(!visited[u] & adjmat[u][i] > 0 ){
        dist[u] = Math.min(dist[u],dist[i] + adjmat[i][u]);
      }

    }
  }
 
  return dist; 

} // end function getLenSP_SinglePair


// Theta
function getTheta(S, r){
  //Calculate theta used to get the relative probability in the stationary distribution.
  //\theta(s_i,X_i) = r*\Sum_e (w_e) + \Sum^M_k \Sum_{e \in p_{sk}} (w_e)
  //INPUT: State object S
  //       double r
  //OUTPUT: double \theta

  var theta = 0
  for (var i=0;i<S.VertexNumber;i++){
    for (var j=0;j<i+1;j++){
      theta = theta + S.AdjMatrix[i][j] 
    }
  }

  theta = theta * r

  var SP_Path_Dist = getLenSP(S)
  for (i=0;i<S.VertexNumber;i++){
    theta = theta + SP_Path_Dist[i]
  }

  return theta;

}

// RSD
function getRSD(Si,Sj,r,T){
  //Calculate the Relative Stationary Distribution of the system
  //INPUT: State objects S1 and S2
  //       double r and T; input parameters
  //OUTPUT: double Relative Stationary Distribution - RSD

  var theta_i = getTheta(Si,r)
  var theta_j = getTheta(Sj,r)

  var RSD = Math.exp(-1*(theta_i - theta_j)/T)
  return RSD

}


// DFS - explore
function explore(S, v, visited){
  //explore vertex v in graph S. Mark v as visited in the visited array
  //INPUT:  State Object S
  //        integer v - vertex index
  //        boolean array visited of size S.VertexNumber indicating if vertex is visited
  visited[v] = true
  for (var u=0;u<S.VertexNumber;u++){
    if (!visited[u] & S.AdjMatrix[v][u] > 0){
      explore(S, u, visited)
    }
  }
  return;

}

// IsConnected
function IsConnected(S){
  //See if state S is a connected graph
  //INPUT: State object S
  //OUTPUT: if S is connected, return true; else return false

  var visited = new Array(S.VertexNumber)
  for (var i=0;i<S.VertexNumber;i++){
    visited[i] = false
  }

  explore(S, S.Source, visited)
  var isconnected = true
  for (var i=0;i<S.VertexNumber;i++){
    isconnected = isconnected && visited[i]
  }
  return isconnected;

}

// Get Bridges
function BridgeNumber(S){
	// Return the number of bridges in a graph from state opbject S
	var Stmp = CloneState(S)
	var BridgeNumber = 0;
	for (var i=0;i<S.VertexNumber;i++){
		for (var j=0;j<i;j++){

			if (Stmp.AdjMatrix[i][j] > 0){
				Stmp.RemoveEdge(i,j)
				if ( !IsConnected(Stmp) ) {
					BridgeNumber = BridgeNumber + 1
				}
				Stmp.AddEdge(i,j)		
			}

		}
	}
	
	return BridgeNumber
}


// clone state object
function CloneState(Sini){
	//Clone stateobect Sini into Sclone
	var Sclone = new State(Sini.Pts, Sini.Source)
	for (var i=0;i<Sini.VertexNumber;i++){
		for (var j=0;j<i;j++){
			if (Sini.AdjMatrix[i][j] == 0) Sclone.RemoveEdge(i,j)
		}
	}
	return Sclone;
}


function GetProposalDist(S0, S1){
	//Calculate the proposal distribution from going from state S0 to S1
	//INPUT: State object S0 and S1
	//OUTPUT: double q10 - probability of transfering from state 0 to state 1 using the adding and subtracting rule
	
	var n = S0.VertexNumber
	var m0 = S0.EdgeNumber
	var M = n*(n-1)/2

	var AddNum = 0
	var RemoveNum = 0

	var Stmp = CloneState(S0)

  // Add Edges
	for (var i=0;i<S0.VertexNumber;i++){
		for (var j=0;j<i;j++){
			if (S1.AdjMatrix[i][j]-S0.AdjMatrix[i][j] > 0){ 
  			AddNum = AddNum+1;
				Stmp.AddEdge(i,j)
			}
	  } 
	}

	// Remove Edges
	for ( i=0;i<S0.VertexNumber;i++){
		for ( j=0;j<i;j++){
			if (S1.AdjMatrix[i][j]-S0.AdjMatrix[i][j] < 0){ 
  			RemoveNum = RemoveNum+1
			}
	  } 
	}
	
	// Get an array of bridge numbers for each instances the graph is removed an edge
	var bridgenumber = new Array(RemoveNum+1)
	bridgenumber[0] = BridgeNumber(Stmp) // account for biridge number after adding all the edges
	var k = 1
	for ( i=0;i<S0.VertexNumber;i++){
		for (j=0;j<i;j++){
			if (S1.AdjMatrix[i][j]-S0.AdjMatrix[i][j] < 0){
				console.log('removing edge',i,j)
				Stmp.RemoveEdge(i,j)
				bridgenumber[k] = BridgeNumber(Stmp)
				k = k+1
			}
		}
	}
	
	var q10 = 1
	for (k = 0;k<AddNum;k++){
		q10 = q10*(M-m0+k)/M
	}
	console.log(bridgenumber)
	for (k=0;k<RemoveNum;k++){
		q10 = q10*(M-bridgenumber[k])/M
	}
	q10 = q10/n
	return q10
}
//***********************************************************************************************


var n = 4
var s = 0
var pts = new Array(n)
for (var i=0;i<n;i++) pts[i] = new Array(2)

pts[0] = [0,0]
pts[1] = [0,1]
pts[2] = [1,1]
pts[3] = [1,0]
var SS = new State(pts,s)
SS.RemoveEdge(0,2)
SS.RemoveEdge(1,3)
SS.RemoveEdge(2,3)


var SS2 = new State(pts,s)
SS2.RemoveEdge(1,3)
SS2.RemoveEdge(1,2)
SS2.RemoveEdge(3,0)
// State 2 done

var q10 = GetProposalDist(SS,SS2)
console.log(q10)
//GetProposalDist(SS,SS2)


module.exports = {State, getMinDist, getLenSP, getTheta, getRSD, IsConnected};
