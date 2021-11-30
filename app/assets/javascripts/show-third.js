var jsonLoad;
let layer;
let stage;
let eyeletsArray = [{}];
let save;


var width = 500;
var height = 375;
var centX = 0;
var centY = 0;

jsonLoad = document.getElementById('data').value
stage = Konva.Node.create(jsonLoad, 'container');
layer = stage.findOne('#layer');

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

var background = new Konva.Rect({
  x: 0,
  y: 0,
  width: width,
  height: height,
  fill: 'white',
});
// add the shape to the layer
layer.add(background);

drawNewPolygon(coord[0], coord[1]);



function drawNewPolygon(pol1, pol2) {
  intersect(pol1, pol2).forEach(function (p) {
    //drawPolygon(p, document.querySelector('svg.intersections'), 'red');
    //Konva
    let polygon = [];
    for(var i = 0; i < p.length;i++){
      polygon.push(p[i].x);
      polygon.push(p[i].y);
    }
    // var background = new Konva.Rect({
    //   x: 0,
    //   y: 0,
    //   width: width,
    //   height: height,
    //   fill: 'white',
    // });

    // calcLayer.add(background);
    var poly = new Konva.Line({
      points: polygon,
      fill: 'rgb(0,0,255)',
      closed: true,
    });
    layer.add(poly);
    calc(p);
  });
}

// var poly = new Konva.Line({
//   //points: [253,217,250,77],
//   points: [20,20,30,250,140,100],
//   fill: 'red',
//   // stroke: 'black',
//   // strokeWidth: 5,
//   closed: true,
// });

// layer.add(poly);


document.getElementById('gravity').addEventListener(
  'click',
  function () {
    calc();
  },
  false
);


function drawCross(x, y){
  var redLine1 = new Konva.Line({
    points: [0,y,width,y],
    stroke: 'red',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
  });
  layer.add(redLine1);
  var redLine2 = new Konva.Line({
    points: [x,0,x,height],
    stroke: 'red',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
  });
  layer.add(redLine2);
}

function calc(polygon) {
  var n = 0;
  centX = 0;
  centY = 0;
  polygon[polygon.length] = polygon[0];

  for(var j=0; j<height; j++) {
    for(var i=0; i<width; i++) {
      if (cn(polygon, i, j) == true) {
        centX += i;
        centY += j;
        n++;
        // var circle = new Konva.Circle({
        //   x: i,
        //   y: j,
        //   radius: 1,
        //   fill: 'red',
        // });
  
        // // add the shape to the layer
        // layer.add(circle);
      }
    }
  }
    centX /= n;
    centY /= n;
    drawCross(centX, centY);
}

function cn(polygon, x, y){
  var cn = 0;
  point = { x: x, y: y };
  for(i = 0; i < polygon.length - 1; i++){
      if( ((polygon[i].y <= point.y) && (polygon[i+1].y > point.y))
          || ((polygon[i].y > point.y) && (polygon[i+1].y <= point.y)) ){
          vt = (point.y - polygon[i].y) / (polygon[i+1].y - polygon[i].y);
          if(point.x < (polygon[i].x + (vt * (polygon[i+1].x - polygon[i].x)))){
              ++cn;
          }
      }
  }
  if (cn % 2 == 1) {
    return true;

  } else {
    return false;
  }
}

