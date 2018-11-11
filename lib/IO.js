function readPts(filepath){

  var fs = require('fs')
  var file = fs.readFileSync(filepath).toString().split("\n");
  file.pop()
  pts = new Array(0)
  var pt = file[0]
  for (var i=0;i<file.length;i++){
    var pt = file[i]
    pt.split(' ')
    pts.push( [ parseInt(pt[0]), parseInt(pt[2]) ] )
  }

  return pts

}

module.exports = {readPts};
