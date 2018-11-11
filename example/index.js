
const state = require("../lib/State_mod.js");
const gt = require("../lib/GraphTraversals_mod.js");
const util = require("../lib/Util_mod.js");
const prob = require("../lib/Prob_mod.js");
const mh = require("../lib/MetropolisHasting_mod.js");
const io = require("../lib/IO.js");



function Main(){



  var nsamples = 1000
  console.log(process.cwd())
  var pts = io.readPts('./pts.in');
  var s = 0
  var S0 = new state.State(pts,s)

  // RSD parameters
  var r = 1;
  var T = 10;
  
  // Performing Metropolis Hasting walk
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

  var out = prob.Get99thPercentile(StateArray)
  var StateList = out[1]
  var S99 = out[0]
 
  console.log('The 99th percentile graph is:')
  console.log(S99)
  console.log( ' ')

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




module.exports = {  };
