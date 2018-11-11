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
	
  EdgeNumberConnectedTo0(){
    // Return the number of edges connected to vertex 0
    var k = 0
    for (var i=0;i<this.VertexNumber;i++){
      if (this.AdjMatrix[0][i] > 0){
        k = k + 1 
      }
    }
    return k
  }

}

module.exports = {State}
