'use strict';

// State Space Object.
class State{
  // Statespace of the Markov Chain Monte Carlo simulation.
  // one state space object represents a connected undirected graph. It has an adjacency matrix to define the edge weights. 

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
		this.EdgeNumber = n*(n-1)/2 // This is the case of all edges having connection with each other. RemoveEdge and AddEdge method will change this value	

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

// ***** GRAPH TRAVERSALS *****
// Min Dist Local
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
	//Clone stateobect Sini into Sclone
	var Sclone = new State(Sini.Pts, Sini.Source)
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



//*****************************************************************
// **** PROBABILITY ****
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
  //Calculate the Relative Stationary Distribution of the system pi(i)/pi(j)
  //INPUT: State objects S1 and S2
  //       double r and T; input parameters
  //OUTPUT: double Relative Stationary Distribution - RSD

  var theta_i = getTheta(Si,r)
  var theta_j = getTheta(Sj,r)

  var RSD = Math.exp(-1*(theta_i - theta_j)/T)
  return RSD

}

// Proposal Distribution
function GetProposalDist(S0, S1){
	//Calculate the proposal distribution from going from state S0 to S1
	//INPUT: State object S0 and S1
	//OUTPUT: double q10 - probability of transfering from state 0 to state 1 using the adding and subtracting rule
	
	var n = S0.VertexNumber
	var M = n*(n-1)/2 // Total number of edges

  // Edge difference. + is edge added. - is edge deleted
  var EdgeDifference = S1.EdgeNumber - S0.EdgeNumber

  var B = BridgeNumber(S0)
  var q10 = 0;  
  if (EdgeDifference > 0){ // edge added
    q10 = 1/(M-S0.EdgeNumber)
  }else if(EdgeDifference < 0){ // edge deleted
    q10 = 1/(S0.EdgeNumber - B)
  }
  
  return q10  
  

}
//***********************************************************************************************

// ***** METROPOLIS HASTING *****

// Add edge at random
function GetAddableEdges(S){
  // Create a list of edges that can be added
  
  var n = S.VertexNumber;
  var M = n*(n-1)/2
  var Scand = CloneState(S)  

  // Array of edges available to add
  var EdgesToAdd = new Array(M-S.EdgeNumber)
  var k = 0    
  for (var i=0;i<n;i++){
    for (var j=0;j<i;j++){
      if (S.AdjMatrix[i][j] == 0){
        EdgesToAdd[k] = [i,j]
        k = k+1
      }
    }
  }
  
  return EdgesToAdd;

}

// Delete edge at random
function GetRemovableEdges(S){
  // Create a list of edges that can be deleted
  
  var n = S.VertexNumber
  var E = S.EdgeNumber
  var B = BridgeNumber(S)
  
  var Stmp = CloneState(S)
  var EdgesToDel = new Array(E-B)
  var k =0

  for (var i=0;i<n;i++){
    for (var j=0;j<i;j++){
			if (Stmp.AdjMatrix[i][j] > 0){
				Stmp.RemoveEdge(i,j)
				if ( IsConnected(Stmp) ) {
          EdgesToDel[k] = [i,j]
          k = k+1
				}
				Stmp.AddEdge(i,j)		
			}
    }
  }

  return EdgesToDel

}

function GetCandidate(S){
  //INPUT: State object S
  //OUTPUT: candidate state with either 1 edge added or deleted.

  var n = S.VertexNumber
  var Scand = CloneState(S)
  var AddOrDel = Math.random()
  var isAllConnected = (n*(n-1)/2 == S.EdgeNumber)
  var vertexlist = new Array(S.VertexNumber)
  for (var i=0;i<S.VertexNumber;i++){
    vertexlist[i] = i
  }
  Scand.Source = vertexlist[Math.floor(Math.random()*vertexlist.length)];


  if (AddOrDel < 0 || isAllConnected){
    //Delete edge
    var RemovableEdges = GetRemovableEdges(Scand)
    var edge2Rem = RemovableEdges[Math.floor(Math.random()*RemovableEdges.length)]
    Scand.RemoveEdge(edge2rem[0],edge2Rem[1])
  
  }else{
    //Add edge
    var AddableEdges = GetAddableEdges(Scand)
    var edge2add = AddableEdges[Math.floor(Math.random()*AddableEdges.length)]
    Scand.AddEdge(edge2add[0],edge2add[1])

  }

  return Scand
}

function MH(S0, Scand, r, T, u){
  //INPUT: the initial state object S0
  //       Candidate state Scand
  //       RSD parameters r and T
  //       Acceptance criterior u [0,1]
  //OUTPUT: true/false whether to accept or reject

  
  var Stmp = CloneState(S0)
       
  // Calculate the probabilities
  var q0to1 = GetProposalDist(Stmp,Scand)
  var q1to0 = GetProposalDist(Scand,Stmp)
  var RSD = getRSD(Scand,Stmp,r,T)    

  var AcptProb = Math.min(1, RSD * q1to0/q0to1) 
  console.log(AcptProb)  

  if (u < AcptProb){
    return true
  } else {
    return false
  }  

}

//*******************************************************************

function Main(){
  var n = 4
  var s = 0;
  var pts = new Array(n)
  for (var i=0;i<n;i++) pts[i] = new Array(2)



}

pts[0] = [0,0]
pts[1] = [0,1]
pts[2] = [1,1]
pts[3] = [1,0]
var S0 = new State(pts,s)
S0.RemoveEdge(1,3)
S0.RemoveEdge(0,3)

var S1 = CloneState(S0)
S1.AddEdge(1,3)


var r = 1
var T = 10
var a = MH(S0,S1,r,T,0.4)

console.log(a)

module.exports = {State, getMinDist, getLenSP, getTheta, getRSD, IsConnected, CloneState, BridgeNumber, GetProposalDist, GetCandidate, MH };
