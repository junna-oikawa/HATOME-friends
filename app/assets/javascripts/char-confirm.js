var jsonLoad;
let layer;
let stage;
let eyeletsArray = [{}];
let save;

let axis = { x: 555, y: 300 }; //図形の中心
let eyeletCounter = 0;
let targetShape = null;
let isDragging = new Boolean(false);
let mousedownPos;
let hasEyelet = new Boolean(false);
let rotShapes = [];
let rotElt = [];


var centX = 0;
var centY = 0;

let mode = 'moveShape';

jsonLoad = document.getElementById('data').value
stage = Konva.Node.create(jsonLoad, 'stageCenter');
layer = stage.findOne('#layer');
let toGroup = [];
let group = new Konva.Group({
  x: 0,
  y: 0,
  id: "characterGroup",
  name: "element"
});
layer.add(group);
group.offsetX(group.getClientRect().width / 2);
group.offsetY(group.getClientRect().width / 2);

function compareFunc(a, b) {
  return a.zIndex() - b.zIndex();
}

toGroup = stage.find('.rect, .circle, .triangle, #face')
toGroup.sort(compareFunc);

toGroup.forEach(function (e) {
  e.draggable(false);
  if(e.id() != 'face') e.strokeScaleEnabled(true);
  group.add(e);
});


var width = stage.getAttr('width');
var height = stage.getAttr('height');

let polygons = layer.find('.rect, .circle, .triangle');
let coord = [];

for (var i = 0; i < polygons.length; i++) {
  let position = polygons[i].getAbsolutePosition();
  let array = [{}];
  // 丸の場合はポリゴン化
  if (polygons[i].getAttr('name') == 'circle') {
    let rx = polygons[i].getAttr('radiusX');
    let ry = polygons[i].getAttr('radiusY');
    for (var r = 0; r < 13; r++){
      array.push({ x: rx * Math.cos(Math.PI / 6 * r) + position.x, y: ry * Math.sin(Math.PI / 6 * r) + position.y});
    }
  } else {
    let points = polygons[i].points();
    for (var j = 0; j < points.length; j++) {
      array.push({ x: points[j] + position.x, y: points[j + 1] + position.y });
      j++;
    }
  }
  array.shift();
  coord.push(array);
}


for (var a = 0; a < coord.length; a++){
  for (var b = a; b < coord.length; b++){
    if (a != b) {
      drawNewPolygon(coord[a % coord.length], coord[(b) % coord.length]);
    }
  }
}


function drawNewPolygon(pol1, pol2) {
  intersect(pol1, pol2).forEach(function (p) {
    //Konva
    let polygon = [];
    for(var i = 0; i < p.length;i++){
      polygon.push(p[i].x);
      polygon.push(p[i].y);
    }
    calc(p);
  });
}

function drawCross(x, y){
  //はとめ作成
  var preShapes = stage.getAllIntersections({ x: x, y: y });
  var shapes = [];
  for (var i = 0; i < preShapes.length; i++){
    if (preShapes[i].getAttr("name") == "rect"||preShapes[i].getAttr("name") == "circle"||preShapes[i].getAttr("name") == "triangle") {
      shapes.push(preShapes[i])
    }
  }
  
  let shapesId = [];
  for (let i = 0; i < shapes.length; i++) {
    let array = shapes[i].getAttr('eyelets')
    array.push("eyelet" + eyeletCounter);
    shapes[i].setAttr('eyelets', array);
    shapesId.push(shapes[i].getAttr('id'))
  }
  let smallRect = new Konva.Circle({
    x: x,
    y: y,
    radius: 8,
    fill: 'white',
    stroke: '#dab300',
    strokeWidth: 4,
    name: "eyelet",
    id: "eyelet" + eyeletCounter,
    overlappingShapes: shapesId,
    draggable: true,
  });
  group.add(smallRect);
  eyeletCounter++;
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
    if( ((polygon[i].y <= point.y) && (polygon[i+1].y > point.y))|| ((polygon[i].y > point.y) && (polygon[i+1].y <= point.y)) ){
      vt = (point.y - polygon[i].y) / (polygon[i + 1].y - polygon[i].y);
      //交点を求めてそれが右側ならプラス　y-y1 = (y2-y1)/(x2-x1)*(x-x1) =>  x=(y-y1)/(y2-y1)*(x2-x1)+x1
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


let rotObj;
let selEyelet;

var tr = new Konva.Transformer({
  resizeEnabled: false,
  rotateEnabled: false,
  padding: 2,
  borderStroke: 'white',
  borderStrokeWidth: 4,
});
layer.add(tr);
tr.nodes([]);

//操作
layer.on('mousedown', function (e) {
  tr.nodes([]);
  targetShape = e.target;
  if (targetShape.name() == 'faceParts') targetShape = e.target.getParent();
  if (targetShape.id() == 'face') targetShape = layer.findOne('#'+targetShape.getAttr('faceParent'));
  if (targetShape.name() == 'eyelet' && mode!='makeEyelet') mode = 'editEyelet';
  switch (mode) {
    case 'editEyelet':
      selEyelet = targetShape;
      tr.nodes([selEyelet]);
      let shapesWithEye = selEyelet.getAttr('overlappingShapes');
      
      
      shapesWithEye.forEach(se => {
        var index = stage.findOne('#' + se).getAttr('eyelets').indexOf(selEyelet.id());
          let tmpEyelets = stage.findOne('#' + se).getAttr('eyelets');
          tmpEyelets.splice(index, 1);
        stage.findOne('#' + se).getAttr('eyelets', tmpEyelets);
      });
      
      break;
    case 'makeEyelet':
      // let moveEyelet = stage.findOne("#eyelet" + (eyeletCounter - 1));
      // moveEyelet.x(stage.getPointerPosition().x);
      // moveEyelet.y(stage.getPointerPosition().y);
      break;
    case 'moveShape':
      if (targetShape.getAttr('eyelets').length == 0) return;
      hasEyelet = true;
      mousedownPos = stage.getPointerPosition();
      selectEyelet(targetShape, mousedownPos);
      isDragging = true;
      rotObj = setInitData(rotShapes.concat(rotElt), axis);
      break;
  }
});

stage.on('mousemove', function () {
  switch (mode) {
    case 'editEyelet':
      
      break;
    case 'makeEyelet':
      let moveEyelet = stage.findOne("#eyelet" + (eyeletCounter - 1));
      moveEyelet.x(stage.getPointerPosition().x);
      moveEyelet.y(stage.getPointerPosition().y);
      break;
    case 'moveShape':
      if (isDragging == false) return;
      if (hasEyelet == false) return;
      let mousePos = stage.getPointerPosition();
      let angle = calcAngle(mousePos);
      rotateObj(rotObj, angle);
      break;
  }
});

stage.on('mouseup', function (e) {
  switch (mode) {
    case 'editEyelet': {
      var preShapes = stage.getAllIntersections({ x: selEyelet.x(), y: selEyelet.y() });
      var shapes = [];
      for (var i = 0; i < preShapes.length; i++) {
        if (preShapes[i].getAttr("name") == "rect" || preShapes[i].getAttr("name") == "circle" || preShapes[i].getAttr("name") == "triangle") {
          shapes.push(preShapes[i])
        }
      }
      let shapesId = [];
      for (let i = 0; i < shapes.length; i++) {
        let array = shapes[i].getAttr('eyelets')
        array.push(selEyelet.id());
        shapes[i].setAttr('eyelets', array);
        shapesId.push(shapes[i].getAttr('id'))
      }
      selEyelet.setAttr('overlappingShapes', shapesId);
      mode = 'moveShape';
      break;
    }
    case 'makeEyelet': {
      let moveEyelet = stage.findOne("#eyelet" + (eyeletCounter - 1));
      var preShapes = stage.getAllIntersections({ x: moveEyelet.x(), y: moveEyelet.y() });
      var shapes = [];
      for (var i = 0; i < preShapes.length; i++) {
        if (preShapes[i].getAttr("name") == "rect" || preShapes[i].getAttr("name") == "circle" || preShapes[i].getAttr("name") == "triangle") {
          shapes.push(preShapes[i])
        }
      }
      
      let shapesId = [];
      for (let i = 0; i < shapes.length; i++) {
        let array = shapes[i].getAttr('eyelets')
        array.push("eyelet" + (eyeletCounter - 1));
        shapes[i].setAttr('eyelets', array);
        shapesId.push(shapes[i].getAttr('id'))
      }
      moveEyelet.setAttr('overlappingShapes', shapesId)
      mode = 'moveShape';
      break;
    }
    case 'moveShape':
      isDragging = false;
      targetShape = null;
      break;
  }
});

document.getElementById('makeEyelet').addEventListener(
  'click',
  function () {
    mode = 'makeEyelet';
    let smallRect = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 8,
      fill: 'white',
      stroke: '#dab300',
      strokeWidth: 4,
      name: "eyelet",
      id: "eyelet" + eyeletCounter,
      overlappingShapes: [],
      draggable: true,
    });
    group.add(smallRect);
    eyeletCounter++;
  },
  false
);

document.getElementById('destroyEyelet').addEventListener(
  'click',
  function () {
    mode = 'moveShape';
    tr.nodes([]);
    let editAttrShapes = stage.find(node => {
      return node.getAttr('eyelets') != null && node.getAttr('eyelets').includes(selEyelet.id());
    });
    editAttrShapes.forEach(eas => {
      let tmpEyelets = [];
      eas.getAttr('eyelets').forEach(eye => {
        if (eye != selEyelet.id()) tmpEyelets.push(eye);
      })
      eas.setAttr('eyelets', tmpEyelets);
    });
    selEyelet.destroy();
    selEyelet = null;
  },
  false
);



function setInitData(paramRotObj) {
  let array = [];
  for (let i = 0; i < paramRotObj.length; i++){
    let tmpData = { obj: 0, horPosX: 0, horPosY: 0, initRot: 0 };
    let pos = paramRotObj[i].getAbsolutePosition();
    let rot = paramRotObj[i].getAbsoluteRotation();
    tmpData.obj = paramRotObj[i];
    tmpData.initRot = rot;
    tmpData.horPosX = axis.x + (pos.x - axis.x) * Math.cos(-rot / 180 * Math.PI) - (pos.y - axis.y) * Math.sin(-rot / 180 * Math.PI);
    tmpData.horPosY = axis.y + (pos.x - axis.x) * Math.sin(-rot / 180 * Math.PI) + (pos.y - axis.y) * Math.cos(-rot / 180 * Math.PI);
    array.push(tmpData);
  }
  return array;
}




function calcAngle(mousePos) {
  let vectorA = { x: mousedownPos.x - axis.x, y: mousedownPos.y - axis.y };
  let vectorC = { x: mousePos.x - axis.x, y: mousePos.y - axis.y };

  let numerator = vectorA.x * vectorC.x + vectorA.y * vectorC.y
  let denominator = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2) * Math.sqrt(vectorC.x ** 2 + vectorC.y ** 2)
  let innerProduct = numerator / denominator;
  if (innerProduct > 1) innerProduct = 1;
  if (innerProduct < -1) innerProduct = -1;
  let radian = Math.acos(innerProduct);
  let absAngle = radian * 180 / Math.PI;
  let s = vectorA.x * vectorC.y - vectorA.y * vectorC.x;
  let direction = 1;
  s > 0 ? direction = 1 : direction = -1;
  return direction * absAngle;
}

function rotateObj(paramRotObj, ang) {
  for (let i = 0; i < paramRotObj.length; i++){
    let obj = paramRotObj[i];
    let r = (obj.initRot + ang) / 180 * Math.PI;
    obj.obj.x(axis.x + (obj.horPosX - axis.x) * Math.cos(r) - (obj.horPosY - axis.y) * Math.sin(r));
    obj.obj.y(axis.y + (obj.horPosX - axis.x) * Math.sin(r) + (obj.horPosY - axis.y) * Math.cos(r));
    obj.obj.rotation(obj.initRot + ang);
  }
}



function selectEyelet(shape, mousePos) {
  rotShapes = [];
  rotElt = [];

  let eyeletId = shape.getAttr("eyelets");
  let maxDistance = 0;
  let useEyelet;

  //使うはとめの選定
  for (let i = 0; i < eyeletId.length; i++) {
    let eyelet = stage.findOne('#' + eyeletId[i]);
    let thisEyeletPos = eyelet.getAbsolutePosition();
    let distance = Math.sqrt((thisEyeletPos.x - mousePos.x) ** 2 + (thisEyeletPos.y - mousePos.y) ** 2);
    if (distance > maxDistance) {
      maxDistance = distance;
      axis = thisEyeletPos;
      useEyelet = eyelet;
    }
  }

  rotElt.push(useEyelet);
  rotShapes.push(shape);
  

  for (let i = 0; i < eyeletId.length; i++) {
    let eyelet = stage.findOne('#' + eyeletId[i]);
    if (eyelet != useEyelet) {
      rotElt.push(eyelet);
      let relatedShapesId = eyelet.getAttr('overlappingShapes');
      for (var j = 0; j < relatedShapesId.length; j++) {
        let relatedShape = stage.findOne('#' + relatedShapesId[j]);
        if (relatedShape != shape) {
          rotShapes.push(relatedShape);
        }
      }
    }
  }

  for (let i = 0; i < rotShapes.length; i++) {
    let e = rotShapes[i].getAttr('eyelets');
    for (let j = 0; j < e.length; j++) {
      let eye = stage.findOne('#' + e[j]);
      if (rotElt.includes(eye) != true) {
        rotElt.push(eye);
        let s = eye.getAttr('overlappingShapes');
        for (let x = 0; x < s.length; x++) {
          let sha = stage.findOne('#' + s[x]);
          if (rotShapes.includes(sha) != true) {
            rotShapes.push(sha);
          }
        }
      }
    }
  }
  let face = stage.findOne("#face");
  if (face != null) {
    let parent = stage.findOne('#' + face.getAttr('faceParent'));
    if (rotShapes.includes(parent) == true) {
      rotShapes.push(face);
    }
  }
}

document.getElementById('save').addEventListener(
  'click',
  function () {
    layer.findOne('#characterGroup').getChildren().forEach(c => {
      c.draggable(false);
    });

    var json = layer.toJSON();

    const form = document.createElement('form');
    form.method = "post";
    form.action = "/characters/create_tmp_eyelet";

    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "json_data";
    hiddenField.value = json;

    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
  },
  false
);


// function fitStageIntoParentContainer() {
//   var container = document.querySelector('#char');

//   // now we need to fit stage into parent container
//   var containerWidth = container.offsetWidth;

//   // but we also make the full scene visible
//   // so we need to scale all objects on canvas
//   var scale = containerWidth / width;

//   stage.width(width * scale);
//   stage.height(width * scale);
//   stage.scale({ x: scale, y: scale });
// }

// fitStageIntoParentContainer();
// // adapt the stage on any window resize
// window.addEventListener('resize', fitStageIntoParentContainer);