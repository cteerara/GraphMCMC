'use strict';

// State Space Functions
class State{
  // Statespace of the Markov Chain Monte Carlo simulation. In this case it will contain an adjacency matrix representing a graph, and the source vertex. 

//----- CONSTRUCTOR ------------------------------------
  constructor(n,s){
    //INPUT: integer n
    //       integer s
    //OUTPUT: Construct an n x n adjacency matrix of zeros and a source nodes < n
    if (s > n) throw "Error: The index for the source vertex must be less than the total number of vertices.";

    var tmparr = new Array(n)
    for (var i=0;i<n;i++) tmparr[i] = new Array(n)
    for (i=0;i<n;i++) for (var j=0;j<n;j++) tmparr[i][j] = 0

    this.AdjMatrix = tmparr
    this.Source = s
    this.VertexNumber = n

  }
//------------------------------------------------------


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

//------All Pair Shortest path length -------------------
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


//----- CALCULATE THETA -----------------------------------------------
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

//*********************************************************************

    
//var SS = new State(10,1)
//console.log(SS.AdjMatrix)
//console.log(SS.source)

module.exports = {State, getMinDist, getLenSP, getTheta, getRSD};
