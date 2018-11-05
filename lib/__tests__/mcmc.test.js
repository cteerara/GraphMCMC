const assert = require('assert');
const mcmc = require('../index.js');

describe('State Space object test', () => {

//------ CONSTRUCTOR NORMAL CASE------------------
  it('constructor test. No Error case', () => {
    n = 10
    s = 1
    var SS = new mcmc.State(n,s)

    // Test source
    assert(SS.Source == 1);

    // Test initial adjacency matrix. Must be all zero
    isAllZero = true
    for (var i=0;i<n;i++){
      for (var j=0;j<n;j++){
        isAllZero = isAllZero & (SS.AdjMatrix[i][j] == 0)
      }
    }
    assert(isAllZero);

  });

//------- CONSTRUCTOR ERROR CASE --------------
  it('constructor test. Error s>n', () => {
    n = 10
    s = 11
    errcatch = true
    try {
      var SS = new mcmc.State(n,s);
    }
    catch(err){
      console.log(err)
      errcatch = errcatch & 'Error: The index for the source vertex must be less than the total number of vertices.' === err
    }
      assert(errcatch)
  });
//-------------------------------------------
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
  it('test getLenSP method', () =>{
    var n = 4
    var s = 0
    var SS = new mcmc.State(n,s)
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
    var SS2 = new mcmc.State(n,s)
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


});
