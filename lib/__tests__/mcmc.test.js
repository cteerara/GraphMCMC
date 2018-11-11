const assert = require('assert');
const state = require("../State_mod.js");
const util = require("../Util_mod.js");
const gt = require("../GraphTraversals_mod.js");
const prob = require("../Prob_mod.js");
const mh = require("../MetropolisHasting_mod.js");
const io = require("../IO.js");

describe('State Space object test', () => {

//------ CONSTRUCTOR NORMAL CASE------------------
  it('constructor test. No Error case', () => {
    n = 3
    s = 1
    var pts = new Array(n)
    for (var k=0;k<n;k++) pts[k] = new Array(2)
    
    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    
    var SS = new state.State(pts,s)
    // Test source
    assert(SS.Source == 1);

    var  tmparrcheck = true
    for (var i=0;i<n;i++){
      for (var j=0;j<n;j++){
        tmparrcheck = tmparrcheck && (SS.AdjMatrix[i][j] == Math.sqrt( Math.pow(pts[i][0]-pts[j][0],2) + Math.pow(pts[i][1]-pts[j][1],2) ) )
      }
    }

    assert(tmparrcheck)
  });

//------- CONSTRUCTOR ERROR CASE --------------
  it('constructor test. Error s>n', () => {
    n = 10
    s = 11
    var pts = new Array(n)
    for (var k=0;k<n;k++) pts[k] = [0,0]
    errcatch = true
    try {
      var SS = new state.State(pts,s);
    }
    catch(err){
      console.log(err)
      errcatch = errcatch & 'Error: The index for the source vertex must be less than the total number of vertices.' === err
    }
      assert(errcatch)
  });


  it('Test class methods', () => {
    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    SS.RemoveEdge(0,2)
    assert(SS.AdjMatrix[0][2] == 0)
    assert(SS.AdjMatrix[2][0] == 0)

    SS.AddEdge(0,2)
    assert(SS.AdjMatrix[0][2] != 0)
    assert(SS.AdjMatrix[2][0] != 0)

    SS.ChangeSource(2)
    assert(SS.Source != 0 & SS.Source == 2)    

    assert(SS.EdgeNumberConnectedTo0() == 3)

  });


});


//************* Graph Traversal methods **********************************
describe('Graph Traversal methods', () =>{

  //------ GET MIN METHOD ------------------
  it('getMinDist method', () => {
    n = 5;
    var spt = new Array(n);
    var dist = new Array(n);

    for (var i=0;i<n;i++){
      spt[i] = false;
      dist[i] = Infinity;
    }

    dist[0] = 0;
    dist[1] = 20;
    dist[2] = 8;
    spt[0] = true;

    var minid = gt.getMinDist(dist, spt)
    assert(minid == 2)

  });

  //------ getLenSP METHOD -----------
  it('test getLenSP, getRSD, getTheta method', () =>{
    var n = 4
    var s = 0
    
    var pts = new Array(n)
    for (var k=0;k<n;k++) pts[k] = [0,0]
    
    var SS = new state.State(pts,s)
    SS.AdjMatrix[0][1] = 4;
    SS.AdjMatrix[1][0] = 4;
    
    SS.AdjMatrix[0][2] = 6;
    SS.AdjMatrix[2][0] = 6;

    SS.AdjMatrix[1][2] = 1;
    SS.AdjMatrix[2][1] = 1;

    SS.AdjMatrix[1][3] = 10;
    SS.AdjMatrix[3][1] = 10;

    SS.AdjMatrix[2][3] = 100;
    SS.AdjMatrix[3][2] = 100;

    var dist = gt.getLenSP(SS)
    var mindist = [0,4,5,14]
    var test_getLenSP_Pass = true;
    for (var i=0;i<mindist.length;i++){
      test_getLenSP_Pass = test_getLenSP_Pass & mindist[i] == dist[i]
    }

    
    // Test getLenSP    
    assert(test_getLenSP_Pass);

    // Test getTheta 
    var theta = prob.getTheta(SS, 1)
    assert(theta == 144)
   
    //Test getRSD
    var SS2 = new state.State(pts,s)
    SS2.AdjMatrix[0][1] = 4;
    SS2.AdjMatrix[1][0] = 4;
    
    SS2.AdjMatrix[0][2] = 6;
    SS2.AdjMatrix[2][0] = 6;

    SS2.AdjMatrix[1][3] = 10;
    SS2.AdjMatrix[3][1] = 10;

    SS2.AdjMatrix[2][3] = 100;
    SS2.AdjMatrix[3][2] = 100;
    
    var theta2 = prob.getTheta(SS2, 1)
    var RSD = prob.getRSD(SS,SS2,1,1)
    assert(RSD == 1)   
 
  });

  it('test Get99thPercentile', () => {

    var n = 3;
    var s = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var SS = new state.State(pts,s)
    var StateList = new Array(0) 
    var StateArray = new Array(0)
    StateList.push(SS)
    for (var i = 0;i<4;i++){
      StateArray.push(SS)
    }
    SS.RemoveEdge(0,1)
    StateArray.push(SS)
    StateList.push(SS)
    var pct = prob.Get99thPercentile(StateArray)
    assert(util.StateCmp(pct[1][0],StateList[0]))
    assert(util.StateCmp(pct[0],SS))    

  });

  // ----- TEST DFS ------
  it('Test DFS', () => {
    
    var n = 3;
    var s = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var SS = new state.State(pts,s)
    // Case connected
    var isconnected = gt.IsConnected(SS)
    assert(isconnected)
    // Case disconnected
    SS.AdjMatrix[0][2] = 0
    SS.AdjMatrix[1][2] = 0
    SS.AdjMatrix[2][0] = 0
    SS.AdjMatrix[2][1] = 0
    isconnected = gt.IsConnected(SS)
    assert(!isconnected) 

  });

  // ----- TEST ISCONNECTED ------
  it('Test IsConnected', () => {
    
    var n = 3;
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var S = new state.State(pts,source)
    // Test case of connected graph
    assert(gt.IsConnected(S))
    S.RemoveEdge(1,0)
    S.RemoveEdge(2,0)
    // Test case of disconnected graph
    assert(!gt.IsConnected(S))


  });

  // ----- TEST CLONE STATE ------
  it('Test CloneState', () => {

    var n = 3;
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var S = new state.State(pts,source)
    S.RemoveEdge(1,2)
    var Sclone = gt.CloneState(S)
    assert(Sclone.AdjMatrix[1][2] == S.AdjMatrix[1][2])
    assert(Sclone.AdjMatrix[2][1] == S.AdjMatrix[2][1])
    assert(Sclone.Source == Sclone.Source)
    
  });

  // ----- TEST BRIDGENUMBER -----
  it('Test BridgeNumber', () => {

    var n = 4
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var S = new state.State(pts,source)
    S.RemoveEdge(0,2)
    S.RemoveEdge(1,3)
    S.RemoveEdge(2,3)
    assert(gt.BridgeNumber(S) == 3)

  });

  // ----- TEST GET PROPOSAL DIST ------
  it('Test GetProposalDist', () => {

    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    SS.RemoveEdge(0,2)
    SS.RemoveEdge(1,3)

    var SS2 = gt.CloneState(SS)
    SS2.AddEdge(2,0)


    var q10 = prob.GetProposalDist(SS,SS2)
    assert(q10 == 0.5)

    var SS3 = gt.CloneState(SS2)
    SS3.RemoveEdge(2,3)
    var q32 = prob.GetProposalDist(SS2,SS3)
    assert(q32 == 1/5)

  });

});

describe('Test Utility functions', () => {

  // ----- TEST STATECMP
  it('Test StateCmp', () => {

    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    SS.RemoveEdge(0,2)
    SS.RemoveEdge(1,3)

    var SS2 = gt.CloneState(SS)
    assert(util.StateCmp(SS,SS2))

    SS.AddEdge(0,2)
    assert(!util.StateCmp(SS,SS2))

  });

  // ----- TEST Arr2DCmp
  it('Test Arr2DCmp', () => {
    
    var x = new Array(3)
    x[0] = [0,0]
    x[1] = [1,2]
    x[2] = [3,4]

    var y = new Array(4)
    y[0] = [0,0]
    y[1] = [1,2]
    y[2] = [3,4]
    y[3] = [4,5]
        
    // Case with dimension mismatch
    assert(!util.Arr2DCmp(x,y))
    
    // Case with the same array
    y.pop()
    assert(util.Arr2DCmp(x,y))
    
    // Case with same dimension, but different element
    y[0][0] = -1
    assert(!util.Arr2DCmp(x,y)) 
    
  });

  // ----- TEST maxarr
  it('Test maxarr', () => {
    var x = [1,2,3,4,5]
    assert(util.maxarr(x) == 5);
  });
  


});

//----- Metropolis hasting functions -----
describe('Test Metropolis Hasting function groups', () => {

  it('Test GetAddableEdges', () => {

    var n = 4
    var s = 0
  
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    SS.RemoveEdge(0,1)
    var remedge = mh.GetAddableEdges(SS)
    assert(remedge[0][0] == 1 && remedge[0][1] == 0) 
  
  });


  it('test GetRemovableEdges', () => {
  
    var n = 4
    var s = 0
  
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    SS.RemoveEdge(0,2)
    SS.RemoveEdge(1,3)
    var remedge = mh.GetRemovableEdges(SS)
    
    function isinarr(V,elem){
      var isin = false
      for (var i=0;i<V.length;i++){ 
        if ( (V[i][0] == elem[0] && V[i][1] == elem[1]) || (V[i][1] == elem[0] && V[i][0] == elem[1]) )
        {
          isin=true;
          break; 
        }
      }
      return isin;
    }
    
    assert(isinarr(remedge,[1,0]) && isinarr(remedge,[2,1]) && isinarr(remedge,[0,3]) && isinarr(remedge, [2,3]));

  });

  it('Test candidate generation', () => {
    // Test whether the generated candidate is valid
    // To be valid, the candidate must be connected, and have only 1 edge added or deleted
    // Has 4 cases
    // 1. All connected - resulting in an edge removed
    // 2. BridgeNumber(S) == S.EdgeNumber - resulting in an edge added
    // 3. add or delete based on a random number generator. Will loop through until we get bot choices of add or deleter.
    var n = 4;
    var s = 0 
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new state.State(pts,s)
    var Scand = mh.GetCandidate(SS)
    
    assert( SS.EdgeNumber-1 == (Scand.EdgeNumber) )
    assert(gt.IsConnected(Scand))

    // Test case of BridgeNumber == S.edgeNumber
    SS.RemoveEdge(0,2)
    SS.RemoveEdge(1,3)
    SS.RemoveEdge(0,1)
    Scand = mh.GetCandidate(SS)
    assert( SS.EdgeNumber+1 == (Scand.EdgeNumber))
    assert( gt.IsConnected(Scand))

    // The rest of the case
    SS.AddEdge(0,1)
    var NotTestBothCase = true
    var iscon = true
    var TestedAdd = false
    var TestedRem = false
    while (NotTestBothCase){
      
      Scand = mh.GetCandidate(SS)
      
      if (SS.EdgeNumber == (Scand.EdgeNumber+1)){
        TestedAdd = true
      }else if (SS.EdgeNumber == (Scand.EdgeNumber-1)){
        TestedRem = true
      }
      NotTestBothCase = !(TestedAdd && TestedRem) 

    }

    assert(!NotTestBothCase)
    
    
  });

  it('Test Metropolis Hastings', () => {
    //Test metropolis hastings with a set acceptance rate
    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var S0 = new state.State(pts,s)
    S0.RemoveEdge(1,3)
    S0.RemoveEdge(0,3)

    var S1 = gt.CloneState(S0)
    S1.AddEdge(1,3)
    // Case that accept
    var acpt = mh.MH(S0,S1,1,10,0.3)
    assert(acpt)
    // Case that not accpet
    acpt = mh.MH(S0,S1,1,10,0.4)
    console.log(process.cwd())
    assert(!acpt)
  });

});

describe('Test IO', () => {
 
   
  it('test IO', () => {

    console.log(process.cwd())
    var iopts = io.readPts('./lib/__tests__/testpts.in');
    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)
    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    assert(util.Arr2DCmp(pts,iopts))

  });

  
  

});
