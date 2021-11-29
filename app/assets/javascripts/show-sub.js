var jsonLoad;
let layer;
let stage;

//前ページの読み込み
jsonLoad = document.getElementById('data').value
stage = Konva.Node.create(jsonLoad, 'container');
layer = stage.findOne('#layer');
var children = layer.getChildren();
for (let i = 0; i < children.length; i++) {
  children[i].draggable(false);
}

//

let polygons = layer.find('.rect, .circle, .triangle');
let coord = [];
for (var i = 0; i < polygons.length; i++) {
  let points = polygons[i].points();
  let position = polygons[i].getAbsolutePosition();
  let array = [{}];
  for (var j = 0; j < points.length; j++) {
    array.push({ x: points[j]+position.x, y: points[j + 1]+position.y });
    j++;
  }
  array.shift();
  coord.push(array);
}

for (var i = 0; i < coord.length; i++) {
  for (var j = i+1; j < coord.length; j++) {
    if (i < j) {
      drawNewPolygon(coord[i], coord[j]);
    }
  }
}



function drawNewPolygon(pol1, pol2) {
  intersect(pol1, pol2).forEach(function (p) {
    //drawPolygon(p, document.querySelector('svg.intersections'), 'red');
    //Konva
    let polygon = [];
    for(var i = 0; i < p.length;i++){
      polygon.push(p[i].x);
      polygon.push(p[i].y);
    }
    var poly = new Konva.Line({
      points: polygon,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 5,
      closed: true,
    });
    
    // add the shape to the layer
    layer.add(poly);
    
    // add the layer to the stage
    

  });
}
