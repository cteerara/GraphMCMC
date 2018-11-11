'use strict';
const state = require("./State_mod.js");
const gt = require("./GraphTraversals_mod.js");
const util = require("./Util_mod.js");
const prob = require("./Prob_mod.js");
const mh = require("./MetropolisHasting_mod.js");
const io = require("./IO.js");

//***********************************************************************************************



//***********************************************************************************************



// Please don't test this!!! :D
function Main(){

  var nsamples = 1000
  var VertexNum = 4
  var s = 0;
  var pts = new Array(VertexNum)
  for (var i=0;i<VertexNum;i++) pts[i] = new Array(2)

  pts[0] = [0,0]
  pts[1] = [0,1]
  pts[2] = [1,1]
  pts[3] = [1,0]
  var S0 = new state.State(pts,s)

  // RSD parameters
  var r = 1;
  var T = 10;
  
  // State Space array containing all statespaces from random walks
  var StateArray = new Array(nsamples+1)
  StateArray[0] = gt.CloneState(S0)
  var u = 0
  for (var i=1;i<nsamples+1;i++){
    u = Math.random()
    var Scand = mh.GetCandidate(StateArray[i-1])
    if ( mh.MH(StateArray[i-1],Scand,r,T,u) ){
      StateArray[i] = gt.CloneState(Scand);
    } else {
      StateArray[i] = gt.CloneState(StateArray[i-1])
    }
  }

  var NumOfOccur = new Array(0)
  var StateList = new Array(0)
  
  var S = gt.CloneState(StateArray[0])
  StateList.push(S)
  NumOfOccur.push(1) 
 
  // Get 99th percentile
  for (i=1;i<nsamples+1;i++){

    // Pick a new state from the StateArray
    var Snew = gt.CloneState(StateArray[i])
    var SLlen = StateList.length

    // Check from each States already added
    for (var j=0;j<SLlen;j++){
      if ( util.StateCmp(Snew,StateList[j]) ){
        NumOfOccur[j] = NumOfOccur[j]+1
        break
      }else {
        if (j == SLlen-1){
          StateList.push(Snew)
          NumOfOccur.push(1)
        }
      }
    }

  }

  var NOO_Sorted = JSON.parse(JSON.stringify(NumOfOccur))
  NOO_Sorted =  NOO_Sorted.sort(function(a, b){return a-b})

  // Get the 99th percentile
  var S99;
  var p = NOO_Sorted[Math.floor(99/100*NumOfOccur.length)]
  for ( i=0;i<NumOfOccur.length;i++){
    if (p == NumOfOccur[i]){
      S99 = gt.CloneState(StateList[i])
      break;
    }
  }

  console.log('The 99th percentile graph is:')
  console.log(S99)
  console.log( ' ')


//  function maxarr(A){
//    //returns the maximum value in array A
//    var maxval = A[0]
//    for (var i=1;i<A.length;i++){
//      maxval = Math.max(maxval,A[i])
//    }
//    return maxval
//  }

  // Expected numbers
  var EdgesConToZero = new Array(StateList.length)
  var EdgesNumTot = new Array(StateList.length)
  var MaxSPToZero = new Array(StateList.length)
  for (i=0;i<StateList.length;i++){
    EdgesConToZero[i] = StateList[i].EdgeNumberConnectedTo0()
    EdgesNumTot[i] = StateList[i].EdgeNumber
    // getLenSP Get maximum shortest path to vartex 0
    StateList[i].ChangeSource(0)
    MaxSPToZero[i] = util.maxarr(gt.getLenSP(StateList[i]))
  }

  // Expected of edges connected to 0
  console.log('Expected number of edges connected to vertex 0 is:')
  console.log( EdgesConToZero.reduce(function(a,b){return a+b},0)/EdgesConToZero.length )
  console.log(' ')

  // Expected number of edges
  console.log('Expected number of edges in the entire graph is:')
  console.log( EdgesNumTot.reduce(function(a,b){return a+b},0)/EdgesConToZero.length )
  console.log(' ')

  // Expected Maximum SP distance to 0
  console.log('Expected maximum Shortest Path Distance from vertex 0:')
  console.log( MaxSPToZero.reduce(function(a,b){return a+b},0)/EdgesConToZero.length )


}


Main()
//var pts = [ [0,0], [1,0], [1,1], [0,1] ]
//var S = new State(pts, 3)
//console.log(S.AdjMatrix)
//console.log(getLenSP(S))
//var RemovableEdges = GetRemovableEdges(S)
//console.log(RemovableEdges)





module.exports = {  };
