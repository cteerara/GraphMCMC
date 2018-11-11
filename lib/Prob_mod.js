const state = require("./State_mod.js");
const gt = require("./GraphTraversals_mod.js");
const util = require("./Util_mod.js")

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

  var SP_Path_Dist = gt.getLenSP(S)
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

  var B = gt.BridgeNumber(S0)
  // edge difference CANNOT be 0 because of our restriction on candidate selection
  if (EdgeDifference > 0){ // edge added
    var q10 = 1/(M-S0.EdgeNumber)
  }else if(EdgeDifference < 0){ // edge deleted
    var q10 = 1/(S0.EdgeNumber - B)
  }
  
  return q10  
  

}

module.exports = {getTheta, GetProposalDist, getRSD};
