var jsonLoad;
let layer;
let stage;
let eyeletsArray = [{}];
let save;

//前ページの読み込み
jsonLoad = document.getElementById('data').value
stage = Konva.Node.create(jsonLoad, 'container');
layer = stage.findOne('#layer');
var children = layer.getChildren();
for (let i = 0; i < children.length; i++) {
  children[i].draggable(false);
}
let width = stage.getAttr('width');
let height = stage.getAttr('height');
console.log(width, height);
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

save = layer;
layer.destroy();

var calcLayer = new Konva.Layer({
  id: 'layer2',
});
stage.add(calcLayer)

// for (var i = 0; i < coord.length; i++) {
//   for (var j = i+1; j < coord.length; j++) {
//     if (i < j) {
//       drawNewPolygon(coord[i], coord[j]);
//     }
//   }
// }
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
    calcLayer.add(poly);
    
  });
  calc();
}

function drawCross(x, y,w,h){
  var redLine1 = new Konva.Line({
    points: [0,y,w,y],
    stroke: 'red',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
  });
  calcLayer.add(redLine1);
  var redLine2 = new Konva.Line({
    points: [x,0,x,h],
    stroke: 'red',
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
  });
  calcLayer.add(redLine2);
}

function calc() {
  var canvas = document.querySelector("canvas");
  var g = canvas.getContext("2d");
  var imgD = new Image();
  w = canvas.width;
  h = canvas.height;
  console.log(w, h);
  imgD = g.getImageData(0, 0, w, h);
  var px = imgD.data;
  var k = 0;
  var n = 0;
  
  centX = 0;
  centY = 0;
  var ratio = width / w;
  

  for(var j=0; j<h; j++) {
    for(var i=0; i<w; i++) {
      k = j*w + i;
      if(px[k*4] == 0 && px[k*4+1] == 0) {
        centX += i;
        centY += j;
        n++;
        var circle = new Konva.Circle({
          x: i/2,
          y: j/2,
          radius: 1,
          fill: 'orange',
        });
  
        // add the shape to the layer
        calcLayer.add(circle);
      }
    }
  }
  console.log(w,h);
    centX /= n;
    centY /= n;
    drawCross(centX * ratio, centY * ratio, w,h);
}
