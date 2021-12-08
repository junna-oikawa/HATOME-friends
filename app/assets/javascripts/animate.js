let jsonLoad = document.getElementById('data').value
let stage = Konva.Node.create(jsonLoad, 'scene-container');
let layer = stage.findOne('#layer');
let group = stage.find('#characterGroup');
console.log(group);
for (let i = 0; i < group.length; i++) {
  group[i].draggable(false);
}

var width = stage.getAttr('width');
var height = stage.getAttr('height');


//はとめ操作 show-thirsより
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

let rotObj;
//操作
layer.on('mousedown', function (e) {
  targetShape = e.target;
  if (targetShape.getAttr('eyelets').length == 0) return;
  hasEyelet = true;
  mousedownPos = stage.getPointerPosition();
  selectEyelet(targetShape, mousedownPos);
  isDragging = true;
  rotObj = setInitData(rotShapes.concat(rotElt), axis);
});

stage.on('mousemove', function () {
  if (isDragging == false) return;
  if (hasEyelet == false) return;

  let mousePos = stage.getPointerPosition();
  let angle = calcAngle(mousePos);
  rotateObj(rotObj, angle);
});

stage.on('mouseup', function (e) {
  isDragging = false;
  targetShape = null;
});



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
    let scale;
    let groupPos = { x: 0, y: 0 };
    if (obj.obj.getDepth() == 3) {
      scale = (obj.obj.getParent().scale());
      groupPos.x = obj.obj.getParent().getAttr('x');
      groupPos.y = obj.obj.getParent().getAttr('y');
    } else if (obj.obj.getDepth() == 4) {
      scale = obj.obj.getParent().getParent().scale();
      groupPos.x = obj.obj.getParent().getParent().getAttr('x');
      groupPos.y = obj.obj.getParent().getParent().getAttr('y');
    }
    obj.obj.x((axis.x + (obj.horPosX - axis.x) * Math.cos(r) - (obj.horPosY - axis.y) * Math.sin(r) - groupPos.x) * 1 / scale.x);
    obj.obj.y((axis.y + (obj.horPosX - axis.x) * Math.sin(r) + (obj.horPosY - axis.y) * Math.cos(r) - groupPos.y) * 1 / scale.y);
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
    let eyelet = shape.getParent().findOne('#' + eyeletId[i]);
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
    let eyelet = shape.getParent().findOne('#' + eyeletId[i]);
    if (eyelet != useEyelet) {
      rotElt.push(eyelet);
      let relatedShapesId = eyelet.getAttr('overlappingShapes');
      for (var j = 0; j < relatedShapesId.length; j++) {
        let relatedShape = shape.getParent().findOne('#' + relatedShapesId[j]);
        if (relatedShape != shape) {
          rotShapes.push(relatedShape);
        }
      }
    }
  }

  for (let i = 0; i < rotShapes.length; i++) {
    let e = rotShapes[i].getAttr('eyelets');
    for (let j = 0; j < e.length; j++) {
      let eye = shape.getParent().findOne('#' + e[j]);
      if (rotElt.includes(eye) != true) {
        rotElt.push(eye);
        let s = eye.getAttr('overlappingShapes');
        for (let x = 0; x < s.length; x++) {
          let sha = shape.getParent().findOne('#' + s[x]);
          if (rotShapes.includes(sha) != true) {
            rotShapes.push(sha);
          }
        }
      }
    }
  }
  if (shape.getAttr('face') == true) {
     rotShapes.push(shape.getParent().findOne("#face"));
  }
}