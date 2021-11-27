var jsonLoad;
let axis = { x: 555, y: 300 }; //図形の中心
let eyeletCounter = 0;
let targetShape = null;
let isDragging = new Boolean(false);
let mousedownPos;
let initialRotation = 0;
let horizontalPos = { x: 0, y: 0 };
let moveShapes = [];
let moveEyelets = [];
let otherShapesPos = [];
let otherShapesInitialRotation = [];
let otherShapesHorizontalPos = [];
let isMakingEyeletMode = new Boolean(false);
let layer;
let stage;
let hasEyelet = new Boolean(false);

// window.onload = function () {
jsonLoad = document.getElementById('data').value
// stage = new Konva.Stage({
//   container: 'container',
//   width: width,
//   height: height,
//   id: 'stage',
// });
// layer = Konva.Node.create(jsonLoad);
stage = Konva.Node.create(jsonLoad, 'container');
layer = stage.findOne('#layer');
var children = layer.getChildren();
for (let i = 0; i < children.length; i++) {
  children[i].draggable(false);
}
// }

window.addEventListener('DOMContentLoaded', () => {
  //カーソルの設定
  layer.on('mouseenter', function () {
    stage.container().style.cursor = 'grab';
  });

  layer.on('mousedown', function () {
    stage.container().style.cursor = 'grabbing';
  });

  layer.on('mouseup', function () {
    stage.container().style.cursor = 'grab';
  });

  layer.on('mouseleave', function () {
    stage.container().style.cursor = 'default';
  });

  //はとめ作成
  layer.on('click', function () {
    if (isMakingEyeletMode != true) return;
    let eyeletPos = stage.getRelativePointerPosition();
    var shapes = stage.getAllIntersections({ x: eyeletPos.x, y: eyeletPos.y });
    let shapesId = [];
    for (let i = 0; i < shapes.length; i++) {
      let array = shapes[i].getAttr('eyelets')
      array.push("eyelet" + eyeletCounter);
      shapes[i].setAttr('eyelets', array);
      shapesId.push(shapes[i].getAttr('id'))
    }
    let smallRect = new Konva.Rect({
      x: eyeletPos.x,
      y: eyeletPos.y,
      width: 10,
      height: 10,
      fill: "#FF0000",
      stroke: "#000",
      strokeWidth: 1,
      name: "eyelet",
      id: "eyelet" + eyeletCounter,
      offsetX: 5,
      offsetY: 5,
      overlappingShapes: shapesId,
    });
    layer.add(smallRect);
    eyeletCounter++;
  });

  layer.on('mousedown', function (e) {
    if (isMakingEyeletMode == true) return;
    targetShape = e.target;
    if (targetShape.getAttr('eyelets').length == 0) return;
    hasEyelet = true;
    mousedownPos = stage.getRelativePointerPosition();
    selectEyelet(targetShape, mousedownPos);
    isDragging = true;
    let shapePos = targetShape.getAbsolutePosition();
    initialRotation = targetShape.getAbsoluteRotation();
    horizontalPos.x = axis.x + (shapePos.x - axis.x) * Math.cos(-initialRotation / 180 * Math.PI) - (shapePos.y - axis.y) * Math.sin(-initialRotation / 180 * Math.PI);
    horizontalPos.y = axis.y + (shapePos.x - axis.x) * Math.sin(-initialRotation / 180 * Math.PI) + (shapePos.y - axis.y) * Math.cos(-initialRotation / 180 * Math.PI);
  });


  stage.on('mousemove', function () {

    if (isMakingEyeletMode == true) return;
    if (isDragging == false) return;
    if (hasEyelet == false) return;

    //targetShape = e.target;
    let mousePos = stage.getRelativePointerPosition();
    let vectorA = { x: mousedownPos.x - axis.x, y: mousedownPos.y - axis.y };
    let vectorC = { x: mousePos.x - axis.x, y: mousePos.y - axis.y };

    let numerator = vectorA.x * vectorC.x + vectorA.y * vectorC.y
    let denominator = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2) * Math.sqrt(vectorC.x ** 2 + vectorC.y ** 2)
    let innerProduct = numerator / denominator;
    if (innerProduct > 1) innerProduct = 1;
    if (innerProduct < -1) innerProduct = -1;
    let radian = Math.acos(innerProduct);
    let angle = radian * 180 / Math.PI;
    let s = vectorA.x * vectorC.y - vectorA.y * vectorC.x;
    let direction = 1;
    s > 0 ? direction = 1 : direction = -1;

    let rotation = (initialRotation + direction * angle) / 180 * Math.PI;
    targetShape.x(axis.x + (horizontalPos.x - axis.x) * Math.cos(rotation) - (horizontalPos.y - axis.y) * Math.sin(rotation));
    targetShape.y(axis.y + (horizontalPos.x - axis.x) * Math.sin(rotation) + (horizontalPos.y - axis.y) * Math.cos(rotation));
    targetShape.rotation(initialRotation + direction * angle);


    //moveShapes達を動かす
    for (let i = 0; i < moveShapes.length; i++) {
      moveShape(moveShapes[i], otherShapesInitialRotation[i], otherShapesHorizontalPos[i], direction, angle);
    }
    for (let i = 0; i < moveEyelets.length; i++) {
      moveShape(moveEyelets[i], otherEyeletsInitialRotation[i], otherEyeletsHorizontalPos[i], direction, angle);
    }
  });

  function moveShape(shape, initRot, hp, dir, ang) {
    let r = (initRot + dir * ang) / 180 * Math.PI;
    shape.x(axis.x + (hp.x - axis.x) * Math.cos(r) - (hp.y - axis.y) * Math.sin(r));
    shape.y(axis.y + (hp.x - axis.x) * Math.sin(r) + (hp.y - axis.y) * Math.cos(r));
    shape.rotation(initRot + dir * ang);
  }

  stage.on('mouseup', function (e) {
    isDragging = false;
    targetShape = null;
  });

  // layer.on('mouseout', function (e) {
  //   isDragging = false;
  //   targetShape = null;
  // });


  document.getElementById('makeEyelet').addEventListener(
    'click', () => isMakingEyeletMode = true, false
  );

  document.getElementById('stopMakeEyelet').addEventListener(
    'click', () => isMakingEyeletMode = false, false
  );

  document.getElementById('load').addEventListener(
    'click',
    function () {
      var nodes = layer.find('.rect, .circle, .triangle');
      for (var i = 0; i < nodes.length; i++) {

      }
    },
    false
  );

  function selectEyelet(shape, mousePos) {
    moveShapes = [];
    moveEyelets = [];
    otherShapesPos = [];
    otherShapesInitialRotation = [];
    otherShapesHorizontalPos = [];
    otherEyeletsPos = [];
    otherEyeletsInitialRotation = [];
    otherEyeletsHorizontalPos = [];

    let eyeletId = shape.getAttr("eyelets");
    let maxDistance = 0;
    let useEyelet;
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

    for (let i = 0; i < eyeletId.length; i++) {
      let eyelet = stage.findOne('#' + eyeletId[i]);
      if (eyelet != useEyelet) {
        moveEyelets.push(eyelet);
        let relatedShapes = eyelet.getAttr('overlappingShapes');
        for (var j = 0; j < relatedShapes.length; j++) {
          let contentShapes = stage.findOne('#' + relatedShapes[j]);
          if (contentShapes != shape) {
            moveShapes.push(contentShapes);
          }
        }
      }
    }

    for (let i = 0; i < moveShapes.length; i++) {
      let e = moveShapes[i].getAttr('eyelets');
      for (let j = 0; j < e.length; j++) {
        let eye = stage.findOne('#' + e[j]);
        if (moveEyelets.includes(eye) != true) {
          moveEyelets.push(eye);
          let s = eye.getAttr('overlappingShapes');
          for (let x = 0; x < s.length; x++) {
            let sha = stage.findOne('#' + s[x]);
            if (moveShapes.includes(sha) != true) {
              moveShapes.push(sha);
            }
          }
        }
      }
    }

    for (let i = 0; i < moveShapes.length; i++) {
      otherShapesPos[i] = moveShapes[i].getAbsolutePosition();
      otherShapesInitialRotation[i] = moveShapes[i].getAbsoluteRotation();
      otherShapesHorizontalPos[i] = { x: 0, y: 0 };
      otherShapesHorizontalPos[i].x = axis.x + (otherShapesPos[i].x - axis.x) * Math.cos(-otherShapesInitialRotation[i] / 180 * Math.PI) - (otherShapesPos[i].y - axis.y) * Math.sin(-otherShapesInitialRotation[i] / 180 * Math.PI);
      otherShapesHorizontalPos[i].y = axis.y + (otherShapesPos[i].x - axis.x) * Math.sin(-otherShapesInitialRotation[i] / 180 * Math.PI) + (otherShapesPos[i].y - axis.y) * Math.cos(-otherShapesInitialRotation[i] / 180 * Math.PI);
    }
    for (let i = 0; i < moveEyelets.length; i++) {
      otherEyeletsPos[i] = moveEyelets[i].getAbsolutePosition();
      otherEyeletsInitialRotation[i] = moveEyelets[i].getAbsoluteRotation();
      otherEyeletsHorizontalPos[i] = { x: 0, y: 0 };
      otherEyeletsHorizontalPos[i].x = axis.x + (otherEyeletsPos[i].x - axis.x) * Math.cos(-otherEyeletsInitialRotation[i] / 180 * Math.PI) - (otherEyeletsPos[i].y - axis.y) * Math.sin(-otherEyeletsInitialRotation[i] / 180 * Math.PI);
      otherEyeletsHorizontalPos[i].y = axis.y + (otherEyeletsPos[i].x - axis.x) * Math.sin(-otherEyeletsInitialRotation[i] / 180 * Math.PI) + (otherEyeletsPos[i].y - axis.y) * Math.cos(-otherEyeletsInitialRotation[i] / 180 * Math.PI);
    }
  }

  ///上部1123追加
  layer.draw();

});