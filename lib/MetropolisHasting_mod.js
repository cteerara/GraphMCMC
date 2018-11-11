// ***** METROPOLIS HASTING *****

const state = require("./State_mod.js");
const gt = require("./GraphTraversals_mod.js");
const util = require("./Util_mod.js");
const prob = require("./Prob_mod.js");

// Add edge at random
function GetAddableEdges(S){
  // Create a list of edges that can be added
  
  var n = S.VertexNumber;
  var M = n*(n-1)/2
  var Scand = gt.CloneState(S)  

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
  var B = gt.BridgeNumber(S)
  
  var Stmp = gt.CloneState(S)
  var EdgesToDel = new Array(E-B)
  var k =0

  for (var i=0;i<n;i++){
    for (var j=0;j<i;j++){
			if (Stmp.AdjMatrix[i][j] > 0){
				Stmp.RemoveEdge(i,j)
				if ( gt.IsConnected(Stmp) ) {
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
  var Scand = gt.CloneState(S)
  var AddOrDel = Math.random()
  var isAllConnected = (n*(n-1)/2 == S.EdgeNumber)
  var vertexlist = new Array(S.VertexNumber)
  for (var i=0;i<S.VertexNumber;i++){
    vertexlist[i] = i
  }
  Scand.Source = vertexlist[Math.floor(Math.random()*vertexlist.length)];
   
  if ( isAllConnected ){
    //Delete edge
    var RemovableEdges = GetRemovableEdges(Scand)
    var edge2Rem = RemovableEdges[Math.floor(Math.random()*RemovableEdges.length)]
    Scand.RemoveEdge(edge2Rem[0],edge2Rem[1])
  }else if ( gt.BridgeNumber(S) == S.EdgeNumber){
    //Add edge
    var AddableEdges = GetAddableEdges(Scand)
    var edge2add = AddableEdges[Math.floor(Math.random()*AddableEdges.length)]
    Scand.AddEdge(edge2add[0],edge2add[1])
  }else if (AddOrDel<0.5){
    //Delete edge
    var RemovableEdges = GetRemovableEdges(Scand)
    var edge2Rem = RemovableEdges[Math.floor(Math.random()*RemovableEdges.length)]
    Scand.RemoveEdge(edge2Rem[0],edge2Rem[1])
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

  
  var Stmp = gt.CloneState(S0)
       
  // Calculate the probabilities
  var q0to1 = prob.GetProposalDist(Stmp,Scand)
  var q1to0 = prob.GetProposalDist(Scand,Stmp)
  var RSD = prob.getRSD(Scand,Stmp,r,T)    

  var AcptProb = Math.min(1, RSD * q1to0/q0to1) 

  
  if (u < AcptProb){
    return true
  } else {
    return false
  }  

}

module.exports = {MH, GetCandidate, GetAddableEdges, GetRemovableEdges };
