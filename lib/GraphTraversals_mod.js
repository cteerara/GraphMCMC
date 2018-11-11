const state = require("./State_mod.js");

// ***** GRAPH TRAVERSALS *****
// Min Dist Local
function getMinDist(dist, visited){
  // Function computes the next vertex to explore.
  // INPUT: dist array
  //        visited array
  // OUTPUT: next vertex to explore
    
  var nodecount = dist.length;
  var min = Infinity;    
  var minidx = 0;

  for (var i=0;i<nodecount;i++){
    if (visited[i] == false & dist[i] <=min){
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

      if(!visited[u] && adjmat[w][u] > 0 ){
        dist[u] = Math.min(dist[u],dist[w] + adjmat[w][u]);
      }
    }
  }
 
  return dist; 

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

// clone state object/clone graph
function CloneState(Sini){
	//Clone state object
	var Sclone = new state.State(Sini.Pts, Sini.Source)
	for (var i=0;i<Sini.VertexNumber;i++){
		for (var j=0;j<i;j++){
			if (Sini.AdjMatrix[i][j] == 0) Sclone.RemoveEdge(i,j)
		}
	}
	return Sclone;
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

// Bridge Number
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

module.exports = {getMinDist, getLenSP, IsConnected, CloneState, BridgeNumber};
