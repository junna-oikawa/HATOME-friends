let jsonLoad = document.getElementById('data').value
let stage = Konva.Node.create(jsonLoad, 'scene-container');
let layer = stage.findOne('#layer');
let characterGroup = stage.find('#characterGroup');
for (let i = 0; i < characterGroup.length; i++) {
  characterGroup[i].draggable(false);
}

var width = stage.getAttr('width');
var height = stage.getAttr('height');

let isSecond = new Boolean(false);



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
stage.on('mousedown', function (e) {
  // console.log(stage.getPointerPosition());
  targetShape = e.target;
  if (targetShape.getAttr('eyelets').length == 0) return;
  hasEyelet = true;
  mousedownPos = stage.getPointerPosition();
  selectEyelet(targetShape, mousedownPos);
  isDragging = true;
  if (isSecond == false) {
    rotObj = setInitData(rotShapes.concat(rotElt), axis);
  } else {
    rotObj = rotShapes.concat(rotElt);
    setRotateGroup(rotObj, e.target);
  }
});

stage.on('mousemove', function () {
  if (isDragging == false) return;
  if (hasEyelet == false) return;

  let mousePos = stage.getPointerPosition();
  let angle = calcAngle(mousePos);
  if (isSecond == false) {
    rotateObj(rotObj, angle);
  } else {
    rotateGroup(rotObj, angle);
  }
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


let useEyelet;
function selectEyelet(shape, mousePos) {
  rotShapes = [];
  rotElt = [];

  let eyeletId = shape.getAttr("eyelets");
  let maxDistance = 0;

  //階層
  let depth = shape.getDepth() - 2; //stageとlayer分 characterGroupまでの階層
  let parent = shape;
  for (let i = 0; i < depth; i++){ 
    parent = parent.getParent();
  }
  

  //使うはとめの選定
  for (let i = 0; i < eyeletId.length; i++) {
    let eyelet = parent.findOne('#' + eyeletId[i]);
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
    let eyelet = parent.findOne('#' + eyeletId[i]);
    if (eyelet != useEyelet) {
      rotElt.push(eyelet);
      let relatedShapesId = eyelet.getAttr('overlappingShapes');
      for (var j = 0; j < relatedShapesId.length; j++) {
        let relatedShape = parent.findOne('#' + relatedShapesId[j]);
        if (relatedShape != shape) {
          rotShapes.push(relatedShape);
        }
      }
    }
  }

  for (let i = 0; i < rotShapes.length; i++) {
  
    let e = rotShapes[i].getAttr('eyelets');
    for (let j = 0; j < e.length; j++) {
      let eye = parent.findOne('#' + e[j]);
      if (rotElt.includes(eye) != true) {
        rotElt.push(eye);
        let s = eye.getAttr('overlappingShapes');
        for (let x = 0; x < s.length; x++) {
          let sha = parent.findOne('#' + s[x]);
          if (rotShapes.includes(sha) != true) {
            rotShapes.push(sha);
          }
        }
      }
    }
  }
  if (shape.getAttr('face') == true) {
     rotShapes.push(parent.findOne("#face"));
  }

}

//////アニメーション機能
// let layerJson;
// let tmpLayer;
// let anim = [];

document.getElementById('first').addEventListener(
  'click',
  function () {
    layerJson = layer.toJSON();
    var nodes = layer.find('.rect, .triangle, .circle');
    nodes.forEach(function (n) {
      n.setAttr('first-angle', n.getAbsoluteRotation());
    });
  },
  false
);



document.getElementById('second').addEventListener(
  'click',
  function () {
    var nodes = layer.find('.rect, .triangle, .circle');
    nodes.forEach(function (n) {
      n.setAttr('second-angle', n.getAbsoluteRotation());
      let rotAngle = n.getAttr('first-angle') - n.getAttr('second-angle');
      n.setAttr('rot-angle', rotAngle);
    });
  },
  false
);

document.getElementById('ff').addEventListener(
  'click',
  function () {
    
    // layer.destroy();
    
    
    // stage.add(Konva.Node.create(layerJson));
    // layer = stage.findOne('#layer');
    // layer.zIndex(0);
    // characterGroup = stage.find('#characterGroup');
    isSecond = true;
  },
  false
);

document.getElementById('ss').addEventListener(
  'click',
  function () {
    layerJson = layer.toJSON();
  },
  false
);

document.getElementById('start').addEventListener(
  'click',
  function () {
    layer.visible(false);
    tmpLayer = Konva.Node.create(layerJson);
    stage.add(tmpLayer);
    animate();
  },
  false
);

document.getElementById('stop').addEventListener(
  'click',
  function () {
    layer.visible(true);
    tmpLayer.destroy();
  },
  false
);

let initGroupAngle = 0;
// function setRotateGroup(rotObj, target) {
//   initGroupAngle = 0;
//   let parent = target.getParent();
//   let g = new Konva.Group({
//     x: axis.x - parent.getAbsolutePosition().x,
//     y: axis.y - parent.getAbsolutePosition().y,
//     width: 600,
//     height: 400,
//     offsetX: axis.x - parent.getAbsolutePosition().x,
//     offsetY: axis.y - parent.getAbsolutePosition().y,
//     name: 'rotateGroup',
//   });

//   //targetがどのグループにも含まれていない 
//   if (target.getDepth() == 3) {
//     let c = 0;
//     let nc = 0; // new count

//     group.forEach(function (gr) {
//       rotObj.forEach(function (o) {
//         if (gr.getChildren().includes(o) == true) {
//           nc++;
//         }
//       });
//     });


//     if (nc == 0) { // && 全要素新しい
//       parent.add(g);
//       rotObj.forEach(function (o) {
//         o.moveTo(g);
//       });
//       group.push(g);
//       return;
//     } else {
      

//       let newRotObj;
//       group.forEach(function (gr) {
//         let nmc = 0; // not match count
//         gr.getChildren().forEach(function (child) {
//           if (!rotObj.includes(child)) {
//             nmc++;
//           }
//         });
//         if (nmc == 0) { // && 他グループの要素を全て持つ
//           newRotObj.push(gr);
//           for (let i = 0; i < rotObj.length; i++) {
//             if (!newRotObj.includes(rotObj[i])) {
//               newRotObj.push(rotObj[i]);
//             }
//           }
//         }
//       });
//       parent.add(g);
//       newRotObj.forEach(function (o) {
//         o.moveTo(g);
//       });
//       group.push(g);
//     }
//   } else if (target.getDepth() >= 4) {
//     let includeGroup; //全要素が入っているGroup
//     group.forEach(function (gr) {
//       let c = 0;
//       rotObj.forEach(function (o) {
//         if (gr.getChildren().includes(o) == true) {
//           c++;
//         }
//       });
//       if (c == rotObj.length) includeGroup = gr;
//     });
//     includeGroup.add(g)
//     axis = { x: useEyelet.getAbsolutePosition(includeGroup).x, y:useEyelet.getAbsolutePosition(includeGroup).y };
//     g.x(axis.x)
//     g.y(axis.y)
//     g.offsetX(axis.x)
//     g.offsetY(axis.y)
//     rotObj.forEach(function (o) {
//       o.moveTo(g);
//     });
//     group.push(g);


//     if (c == parent.getChildren().length) {　//グループが既にある時
//       initGroupAngle = parent.rotation();
//       return;
//     } else if (c == rotObj.length) {
//       target.getParent().add(g)
//       axis = { x: useEyelet.getAbsolutePosition(target.getParent()).x, y:useEyelet.getAbsolutePosition(target.getParent()).y };
//       g.x(axis.x)
//       g.y(axis.y)
//       g.offsetX(axis.x)
//       g.offsetY(axis.y)
//       group.push(g);

//       rotObj.forEach(function (o) {
//       o.moveTo(g);
//       });
//     } else {
//       target.getParent().getParent().add(g)
//       group.push(g);

//       rotObj.forEach(function (o) {
//       o.moveTo(g);
//   });
//     }
//   }
// }
let group = [];
let groupAllChildren = [];
function setRotateGroup(rotObj, target) {
  //初期設定
  let g = new Konva.Group({
    width: 600,
    height: 400,
    name: 'rotateGroup',
    x: axis.x,
    y: axis.y,
    offsetX: axis.x,
    offsetY: axis.y,
  });
  let addDest; //gの追加先
  let addObj = []; //gに追加するオブジェクト

  let isPartialMatch = [];
  let type = 'other';
  let existingGroup;
  groupAllChildren.forEach(function(gr, index){
    let existingInNew = [];
    let newInExisting = [];
    let has = [];
    gr.forEach(ge => {
      has.push(rotObj.includes(ge));  //rotObjがexistGroupの要素を全て持っているか？
      existingInNew.push(rotObj.includes(ge));// どれかのgrの要素を全て持つか？
    });
    rotObj.forEach(ro => {
      has.push(gr.includes(ro));  //groupAllChildrenの各配列がrotObjの要素を全て持っているか？
      isPartialMatch.push(gr.includes(ro));
      newInExisting.push(gr.includes(ro));
    });
    // if (has.some(b => b == false) == false && isAllMatch == false) {
    if (has.includes(false) == false) {
      type = 'isAllMatch'
      existingGroup = index;
    }
    else if (existingInNew.includes(false) == false) { //どれかのgroupAllChildrenの要素を全て持っていたら
      type = 'existingInNew';
      existingGroup = index;
    }
    else if (newInExisting.includes(false) == false) { //どれかのgroupAllChildrenの要素を全て持っていたら
      type = 'newInExisting';
      existingGroup = index;
    }
  });
    if (isPartialMatch.includes(true) == false) {  //新規
      type = 'new';
    }
  
  let targetParent = target.getParent();

  switch (type) {
    case 'isAllMatch':
      initGroupAngle = group[existingGroup].rotation();
      console.log('isAllMatch')
      break;
    case 'new':
      g.x(axis.x - targetParent.getAbsolutePosition().x);
      g.y(axis.y - targetParent.getAbsolutePosition().y);
      g.offsetX(axis.x - targetParent.getAbsolutePosition().x);
      g.offsetY(axis.y - targetParent.getAbsolutePosition().y);
      addDest = targetParent;
      addObj = rotObj;
      add(addObj, g, addDest, rotObj);
      console.log('new');
      break;
    case 'existingInNew':
      g.x(axis.x - targetParent.getAbsolutePosition().x);
      g.y(axis.y - targetParent.getAbsolutePosition().y);
      g.offsetX(axis.x - targetParent.getAbsolutePosition().x);
      g.offsetY(axis.y - targetParent.getAbsolutePosition().y);
      addDest = targetParent;
      group[existingGroup].moveTo(g);
      rotObj.forEach(ro => {
        if (group[existingGroup].getChildren().includes(ro) == false) addObj.push(ro);
      });
      add(addObj, g, addDest, rotObj);
      console.log('existingInNew');
      break;
    case 'newInExisting':
      addDest = group[existingGroup];
      addObj = rotObj;
      axis = { x: useEyelet.getAbsolutePosition(group[existingGroup]).x, y: useEyelet.getAbsolutePosition(group[existingGroup]).y };
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);
      add(addObj, g, addDest, rotObj);
      console.log('newInExisting');
      break;
    default:
      addDest = targetParent;
      addObj = rotObj;
      axis = { x: useEyelet.getAbsolutePosition(targetParent).x, y: useEyelet.getAbsolutePosition(targetParent).y };
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);

      //target(既)はそのまま それ以外はparentのoffsetを中心として -parent.rotation
      let tmpRotObj = rotObj.slice(1); //shape削除
      let index = tmpRotObj.findIndex(element => element == useEyelet);
      tmpRotObj.splice(index, 1);

      let tmpG = new Konva.Group({
        width: 600,
        height: 400,
        x: targetParent.offsetX(),
        y: targetParent.offsetY(),
        offsetX: targetParent.offsetX(),
        offsetY: targetParent.offsetY(),
      });
      targetParent.add(tmpG);
      tmpRotObj.forEach(o => {
        o.moveTo(tmpG);
      });
      tmpG.rotation(-targetParent.rotation());
      tmpRotObj.forEach(o => {
        tmpPos = o.getAbsolutePosition(targetParent);
        o.x(tmpPos.x);
        o.y(tmpPos.y);
        o.rotation(- targetParent.rotation());
        o.moveTo(targetParent);
      });
      tmpG.destroy();
      add(addObj, g, addDest, rotObj);
      console.log('default');
      break;
  }
















  ////////////////////////////////
  // let newCount = 0;
  // let existCount = 0;
  // let targetIsExit = false;
  // groupAllChildren.forEach(gr => {
  //   rotObj.forEach(o => {
      
  //   });
  // });

  // if (targetIsExit == false) {
  //   if (existCount == 0) { //全要素新しい
  //     console.log('全要素新しい');
  //     let parent = target.getParent();
  //     g.x(axis.x - parent.getAbsolutePosition().x);
  //     g.y(axis.y - parent.getAbsolutePosition().y);
  //     g.offsetX(axis.x - parent.getAbsolutePosition().x);
  //     g.offsetY(axis.y - parent.getAbsolutePosition().y);
  //     addDest = parent;
  //     addObj = rotObj;
  //     add(addObj, g, addDest, rotObj);
  //   } else { //新>既
  //     console.log('新>既');
  //   }
    
  // } else if (targetIsExit == true) {
  //   if (newCount != 0) { //既の下に入る　ターゲットはexist いくつかnew
  //     let parent = target.getParent();
  //     addDest = parent;
  //     addObj = rotObj;
  //     axis = { x: useEyelet.getAbsolutePosition(parent).x, y: useEyelet.getAbsolutePosition(parent).y };
  //     g.x(axis.x);
  //     g.y(axis.y);
  //     g.offsetX(axis.x);
  //     g.offsetY(axis.y);

  //     //target(既)はそのまま それ以外はparentのoffsetを中心として -parent.rotation
  //     let tmpRotObj = rotObj.slice(1); //shape削除
  //     let index = tmpRotObj.findIndex(element => element == useEyelet);
  //     tmpRotObj.splice(index, 1);

  //     //一時的にグループを作る
  //     // let depth = parent.getDepth() - 2; //stageとlayer分 characterGroupまでの階層
  //     // let charGr = parent;//実際のcharGrではない
  //     // let tmpAxis = parent.offset();
  //     // console.log(tmpAxis);
  //     // for (let i = 0; i < depth; i++){ 
  //     //   charGr = parent.getParent();
  //     // }

  //     let tmpG = new Konva.Group({
  //       width: 600,
  //       height: 400,
  //       x: parent.offsetX(),
  //       y: parent.offsetY(),
  //       offsetX: parent.offsetX(),
  //       offsetY: parent.offsetY(),
  //     });
  //     parent.add(tmpG);
  //     // var rect1 = new Konva.Rect({
  //     //   x: parent.offsetX(),
  //     //   y: parent.offsetY(),
  //     //   width: 10,
  //     //   height: 10,
  //     //   fill: 'green',
  //     //   stroke: 'black',
  //     //   strokeWidth: 4,
  //     // });
  //     // tmpG.add(rect1);
  //     tmpRotObj.forEach(o => {
  //       o.moveTo(tmpG);
  //     });
  //     tmpG.rotation(-parent.rotation());
  //     tmpRotObj.forEach(o => {
  //       tmpPos = o.getAbsolutePosition(parent);
  //       o.x(tmpPos.x);
  //       o.y(tmpPos.y);
  //       o.rotation(- parent.rotation());
  //       o.moveTo(parent);
  //     });
  //     tmpG.destroy();


  //     // let depth = parent.getDepth() - 2; //stageとlayer分 characterGroupまでの階層
  //     // let charGr = parent;//実際のcharGrではない
  //     // let tmpAxis = parent.offset();
  //     // console.log(tmpAxis);
  //     // for (let i = 0; i < depth; i++){ 
  //     //   charGr = parent.getParent();
  //     // }
  //     // for (let i = 0; i < tmpRotObj.length; i++) {
  //     //   let tmpPos = tmpRotObj[i].getAbsolutePosition(parent)
  //     //   let r = - parent.rotation() * (Math.PI / 180);
  //     //   tmpRotObj[i].x(tmpPos.x * Math.cos(r) - tmpPos.y * Math.sin(r) - charGr.getAbsolutePosition().x);
  //     //   tmpRotObj[i].y(tmpPos.x * Math.sin(r) + tmpPos.y * Math.cos(r));
  //     //   tmpRotObj[i].rotation(-parent.rotation());
  //     // }
    
  //     // let scale = charGr.scale;//characterGroupのscale?
  //     // for (let i = 0; i < tmpRotObj.length; i++){
  //     //   tmpRotObj[i].x((tmpAxis.x + ( - tmpAxis.x) * Math.cos(parent.rotation()) - ( - tmpAxis.y) * Math.sin(parent.rotation())) * 1 / scale.x);
  //     //   tmpRotObj[i].y((tmpAxis.y + (- tmpAxis.x) * Math.sin(parent.rotation()) + ( - tmpAxis.y) * Math.cos(parent.rotation())) * 1 / scale.y);
  //     //   tmpRotObj[i].rotation(parent.rotation());
  //     // }

  //     add(addObj, g, addDest, rotObj);
  //     console.log('ターゲットはexist いくつかnew 既存の下に入る');
  //   } else {
  //     //全一致か部分一致かの判断の処理
  //     let isAllMatch = false;
  //     let matchIndex;
  //     groupAllChildren.forEach(gr => {
  //       let has = [];
  //       gr.forEach(ge => {
  //         has.push(rotObj.includes(ge));  //rotObjがexistGroupの要素を全て持っているか？
  //       });
  //       rotObj.forEach(ro => {
  //         has.push(gr.includes(ro));  //rotObjがexistGroupの要素を全て持っているか？
  //       });
  //       if (has.some(b => b == false) == false && isAllMatch == false) {
  //         isAllMatch = true;
  //       }
  //     });
  //     if (isAllMatch == true) { // 完全一致
  //       console.log('完全一致');
  //     } else { //部分一致
        
  //     }

  //     //else {
  //     //   let depth = target.getDepth() - 3;
  //     //   let parents = [target];
  //     //   for (let i = 0; i < depth; i++){
  //     //     parents[i] = parents[i-1].getParent();
  //     //   }

  //     // let jsonArray = "";
  //     // rotObj.forEach(o => {
  //     //   jsonArray += JSON.stringify(o);
  //     // })
  //     // let groupIsExist = groupJson.findIndex(element => element == jsonArray);
  //     // if (groupIsExist != -1) {
  //     //   console.log('全一致');
  //     //   initGroupAngle = group[groupIsExist].rotation();
  //     // }
  //     // group.forEach(gr => {

  //     //   gr.includes
  //     // });
  //     // if () { //全一致
  //     //   console.log('全一致');
  //     //   initGroupAngle = group[groupIsExist].rotation();
  //     // } else { //部分一致
  //     //   console.log('部分一致');
  //     // }
  //   }
  // }
}

function add(addObj, g, addDest, rotObj) {
  addObj.forEach(o => {
    o.moveTo(g);
  });
  addDest.add(g);
  group.push(g);
  groupAllChildren.push(rotObj);
  // let groupJsonArray = "";
  // rotObj.forEach(o => {
  //   groupJsonArray+=JSON.stringify(o);
  // })
  // groupJson.push(groupJsonArray);
  console.log(groupAllChildren);
}


function rotateGroup(rotObj, angle) {
  let g = rotObj[0].getParent();
  g.rotation(initGroupAngle + angle);
}

function animate() {
  let gs = tmpLayer.find('.rotateGroup');
  let maxAngle = [];
  let theta = [];
  let thetaSign = [];
  let c = [];
  for (let i = 0; i < gs.length; i++){
    maxAngle[i] = gs[i].getAttr('rotation')
    maxAngle[i] > 0 ? thetaSign[i] = -1 : thetaSign[i] = 1;
    theta[i] = Math.abs(maxAngle[i]) / 68;
    c[i] = 0;
    let anim = new Konva.Animation(function (frame) {
      // gs[i].rotate(1);
      if (maxAngle[i] != -0||maxAngle[i] != 0) {
        gs[i].rotate(thetaSign[i] * theta[i]);
        c[i] += Math.abs(theta[i]);
        if (Math.floor(c[i]) >= Math.floor(Math.abs(maxAngle[i]))) {
          theta[i] *= -1;
          c[i] = 0;
        }
      }

    }, layer);
    anim.start();
  }
}