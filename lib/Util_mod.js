
// Conpare 2D array
function Arr2DCmp(A1, A2){
  // INPUT: 2D arrays A1 and A2
  // OUTPUT: true if A1 == A2 otherwise false
 
  var r1 = A1.length
  var c1 = A1[0].length

  var r2 = A2.length
  var c2 = A2[0].length

  if ( r1 != r2 || c1 != c2){
    return false
  }

  var isSame = true
  for (var i = 0;i<r1;i++){
    for (var j=0;j<c1;j++){
      isSame = isSame && A1[i][j] == A2[i][j]
    }
  }

  return isSame
}

// Check if the two states are the same
function StateCmp(S1,S2){
  // INPUT: State object S1 and S2
  // OUTPUT: true if S1 == S2

  var isSame = true
  isSame = isSame && Arr2DCmp(S1.Pts,S2.Pts)
  isSame = isSame && Arr2DCmp(S1.AdjMatrix,S2.AdjMatrix)
  isSame = isSame && S1.Source == S2.Source
  isSame = isSame && S1.EdgeNumber == S2.EdgeNumber

  return isSame

}

// maxarr
function maxarr(A){
  //returns the maximum value in an array
  var maxval = A[0]
  for (var i=1;i<A.length;i++){
    maxval = Math.max(maxval,A[i])
  }
  return maxval
}

module.exports = {Arr2DCmp, maxarr, StateCmp};
