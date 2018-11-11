function readPts(filepath){

  var fs = require('fs')
  var file = fs.readFileSync(filepath).toString().split("\n");
  file.pop()
  pts = new Array(0)
  var pt = file[0]
  for (var i=0;i<file.length;i++){
    var pt = file[i]
    pts.push( [ parseInt(pt.split(' ')[0]), parseInt(pt.split(' ')[1]) ] )
  }

  return pts

}


module.exports = {readPts};
