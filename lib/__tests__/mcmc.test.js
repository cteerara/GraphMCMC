const assert = require('assert');
const mcmc = require('../index.js');

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
    
    var SS = new mcmc.State(pts,s)
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
      var SS = new mcmc.State(pts,s);
    }
    catch(err){
      console.log(err)
      errcatch = errcatch & 'Error: The index for the source vertex must be less than the total number of vertices.' === err
    }
      assert(errcatch)
  });


  it('Add/Remove Edge and change source test', () => {
    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new mcmc.State(pts,s)
    SS.RemoveEdge(0,2)
    assert(SS.AdjMatrix[0][2] == 0)
    assert(SS.AdjMatrix[2][0] == 0)

    SS.AddEdge(0,2)
    assert(SS.AdjMatrix[0][2] != 0)
    assert(SS.AdjMatrix[2][0] != 0)

    SS.ChangeSource(2)
    assert(SS.Source != 0 & SS.Source == 2)    

  });

});


//************* Graph Traversal methods **********************************
describe('State Space object methods test', () =>{

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

    var minid = mcmc.getMinDist(dist, spt)
    assert(minid == 2)

  });

  //------ getLenSP METHOD -----------
  it('test getLenSP, getRSD, getTheta method', () =>{
    var n = 4
    var s = 0
    
    var pts = new Array(n)
    for (var k=0;k<n;k++) pts[k] = [0,0]
    
    var SS = new mcmc.State(pts,s)
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

    var dist = mcmc.getLenSP(SS)
    var mindist = [0,4,5,14]
    var test_getLenSP_Pass = true;
    for (var i=0;i<mindist.length;i++){
      test_getLenSP_Pass = test_getLenSP_Pass & mindist[i] == dist[i]
    }

    
    // Test getLenSP    
    assert(test_getLenSP_Pass);

    // Test getTheta 
    var theta = mcmc.getTheta(SS, 1)
    assert(theta == 144)
   
    //Test getRSD
    var SS2 = new mcmc.State(pts,s)
    SS2.AdjMatrix[0][1] = 4;
    SS2.AdjMatrix[1][0] = 4;
    
    SS2.AdjMatrix[0][2] = 6;
    SS2.AdjMatrix[2][0] = 6;

    SS2.AdjMatrix[1][3] = 10;
    SS2.AdjMatrix[3][1] = 10;

    SS2.AdjMatrix[2][3] = 100;
    SS2.AdjMatrix[3][2] = 100;
    
    var theta2 = mcmc.getTheta(SS2, 1)
    var RSD = mcmc.getRSD(SS,SS2,1,1)
    assert(RSD == 1)   
 
  });

  // Test DFS
  it('Test DFS', () => {
    
    var n = 3;
    var s = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var SS = new mcmc.State(pts,s)

    // Case connected
    var isconnected = mcmc.IsConnected(SS)
    assert(isconnected)
    // Case disconnected
    SS.AdjMatrix[0][2] = 0
    SS.AdjMatrix[1][2] = 0
    SS.AdjMatrix[2][0] = 0
    SS.AdjMatrix[2][1] = 0
    isconnected = mcmc.IsConnected(SS)
    assert(!isconnected) 

  });

  it('Test IsConnected', () => {
    
    var n = 3;
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var S = new mcmc.State(pts,source)
    // Test case of connected graph
    assert(mcmc.IsConnected(S))
    S.RemoveEdge(1,0)
    S.RemoveEdge(2,0)
    // Test case of disconnected graph
    assert(!mcmc.IsConnected(S))


  });

  it('Test CloneState', () => {

    var n = 3;
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [1,0]
    pts[2] = [0,1]
    var S = new mcmc.State(pts,source)
    S.RemoveEdge(1,2)
    var Sclone = mcmc.CloneState(S)
    assert(Sclone.AdjMatrix[1][2] == S.AdjMatrix[1][2])
    assert(Sclone.AdjMatrix[2][1] == S.AdjMatrix[2][1])
    assert(Sclone.Source == Sclone.Source)
    
  });

  it('Test BridgeNumber', () => {

    var n = 4
    var source = 0;
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var S = new mcmc.State(pts,source)
    S.RemoveEdge(0,2)
    S.RemoveEdge(1,3)
    S.RemoveEdge(2,3)
    assert(mcmc.BridgeNumber(S) == 3)

  });

  it('Test GetProposalDist', () => {

    var n = 4
    var s = 0
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new mcmc.State(pts,s)
    SS.RemoveEdge(0,2)
    SS.RemoveEdge(1,3)

    var SS2 = mcmc.CloneState(SS)
    SS2.AddEdge(2,0)


    var q10 = mcmc.GetProposalDist(SS,SS2)
    assert(q10 == 0.5)

    var SS3 = mcmc.CloneState(SS2)
    SS3.RemoveEdge(2,3)
    var q32 = mcmc.GetProposalDist(SS2,SS3)
    assert(q32 == 1/5)

  });

});

//----- Metropolis hasting functions -----
describe('Test Metropolis Hasting function groups', () => {

  it('Test candidate generation', () => {
    // Test whether the generated candidate is valid
    // To be valid, the candidate must be connected, and have only 1 edge added or deleted
    var n = 4;
    var s = 0 
    var pts = new Array(n)
    for (var i=0;i<n;i++) pts[i] = new Array(2)

    pts[0] = [0,0]
    pts[1] = [0,1]
    pts[2] = [1,1]
    pts[3] = [1,0]
    var SS = new mcmc.State(pts,s)
    SS.RemoveEdge(1,3)
    SS.RemoveEdge(0,3)
    var Scand = mcmc.GetCandidate(SS)
    assert(SS.EdgeNumber == (Scand.EdgeNumber+1) || SS.EdgeNumber == (Scand.EdgeNumber-1) )
    assert(mcmc.IsConnected(Scand))
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
    var S0 = new mcmc.State(pts,s)
    S0.RemoveEdge(1,3)
    S0.RemoveEdge(0,3)

    var S1 = mcmc.CloneState(S0)
    S1.AddEdge(1,3)
    // Case that accept
    var acpt = mcmc.MH(S0,S1,1,10,0.3)
    assert(acpt)
    // Case that not accpet
    acpt = mcmc.MH(S0,S1,1,10,0.4)
    assert(!acpt)
  });

});
