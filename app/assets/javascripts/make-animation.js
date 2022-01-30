let jsonLoad = document.getElementById('data').value
let stage = Konva.Node.create(jsonLoad, 'scene-animate-container');
let layer = stage.findOne('#layer');
let characterGroup = stage.find('#characterGroup');
for (let i = 0; i < characterGroup.length; i++) {
  characterGroup[i].draggable(false);
}
var width = stage.getAttr('width');
var height = stage.getAttr('height');

let bg = stage.findOne('.back-image');
let bgLayer = stage.findOne('#bgLayer');
var imageObj = new Image();
imageObj.onload = function () {
  var bg = new Konva.Image({
    x: 0,
    y: 0,
    image: imageObj,
    width: width,
    height: height,
  });
  bgLayer.add(bg);
};
if (bg!=undefined) imageObj.src = bg.getAttr('image-src');

let isSecond = new Boolean(false);

let targetGroup;
let targetZIndex;

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

let children = [];

let rotObj;
//操作
stage.on('mousedown touchstart', function (e) {
  targetShape = e.target;
  let depth = targetShape.getDepth() - 2; //stageとlayer分 characterGroupまでの階層
  let parent = targetShape;
  for (let i = 0; i < depth; i++){
    parent = parent.getParent();
  }
  if (targetShape.name() == 'faceParts') targetShape = e.target.getParent();
  //console.log(parent.findOne('#' + targetShape.getAttr('faceParent')));
  if (targetShape.id() == 'face') targetShape = parent.findOne('#'+targetShape.getAttr('faceParent'));

  if (targetShape.getAttr('eyelets').length == 0) return;
  hasEyelet = true;
  mousedownPos = stage.getPointerPosition();
  selectEyelet(targetShape, mousedownPos);
  isDragging = true;
  if (isSecond == false) {
    rotObj = setInitData(rotShapes.concat(rotElt), axis);
  } else {
    rotObj = rotShapes.concat(rotElt);
    setRotateGroup(rotObj, targetShape);
  }
});

stage.on('mousemove touchmove', function () {
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

stage.on('mouseup touched', function (e) {
  isDragging = false;
  targetShape = null;
  targetGroup = null;
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
  for (let i = 0; i < paramRotObj.length; i++) {
    let obj = paramRotObj[i];
    let r = (obj.initRot + ang) / 180 * Math.PI;
    let tar = obj.obj;
    tar.absolutePosition({
      x: (axis.x + (obj.horPosX - axis.x) * Math.cos(r) - (obj.horPosY - axis.y) * Math.sin(r)),
      y: (axis.y + (obj.horPosX - axis.x) * Math.sin(r) + (obj.horPosY - axis.y) * Math.cos(r))
    });
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
      if (rotElt.includes(eye) != true && eye != useEyelet) {
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
  //rotElt.push(useEyelet);

  // if (shape.getAttr('face') == true) {
  //    rotShapes.push(parent.findOne("#face"));
  // }
  // let face = stage.findOne("#face");
  // if (face != null) {
  //   let parent = stage.findOne('#' + face.getAttr('faceParent'));
  //   if (rotShapes.includes(parent) == true) {
  //     rotShapes.push(face);
  //   }
  // }
  rotShapes.forEach(r => {
    if (r.getAttr('face') == true) rotShapes.push(parent.findOne('#face'));
  });
  //(parent)

}

//////アニメーション機能
let layerJson;
let stageJson;
// let tmpLayer;
// let anim = [];

let tmpBackground;
layer.opacity(0.9);
document.getElementById('first').addEventListener(
  'click',
  function () {
    isSecond = true;
    let jsonBackGround = layer.toJSON();
    tmpBackground = Konva.Node.create(jsonBackGround);
    stage.add(tmpBackground);
    tmpBackground.moveToBottom();
    bgLayer.moveToBottom();
    tmpBackground.opacity(0.4);
    document.getElementById('first').style.display = 'none';
    document.getElementById('second').style.display = 'block';
    document.getElementById("captionAnimate").innerHTML ='<p class="step">① ② <span class="current-step">③</span> ④</p><p> つぎはアニメーションの <br> かくにんをするよ！</p> ';
    //changeCharPose();
    document.getElementById("explain").innerHTML = '<span id="second-pose">おわりのポーズ</span>をきめてね！';
    // demo用
    // let jsonForDemoFirst = characterGroup[0].toJSON();
    // console.log(jsonForDemoFirst);
  },
  false
);

document.getElementById('second').addEventListener(
  'click',
  function () {
    layer.opacity(1);
    layerJson = layer.toJSON();
    // demo用
    // let jsonForDemoSecond = characterGroup[0].toJSON();
    // console.log(jsonForDemoSecond);
    tmpBackground.destroy();
    stageJson = stage.toJSON();
    layer.visible(false);
    tmpLayer = Konva.Node.create(layerJson);
    tmpLayer.listening(false);
    stage.add(tmpLayer);
    animate();
    document.getElementById('second').style.display = 'none';
    document.getElementById('ok').style.display = 'block';
    document.getElementById('redo').style.display = 'block';
    // document.getElementById('guide').style.display = 'none';
    document.getElementById("explain").innerText = "かくにんしてみよう！";
    document.getElementById("captionAnimate").innerHTML ='<p class="step">① ② ③ <span class="current-step">④</span></p><p>かんせい！</p> ';
  },
  false
);

document.getElementById('ok').addEventListener(
  'click',
  function () {
    const form = document.createElement('form');
    form.method = "post";
    form.action = "/scenes";

    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = "json_data";
    hiddenField.value = stageJson;

    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
  },
  false
);

document.getElementById('redo').addEventListener(
  'click',
  function () {
    window.location.reload();
  },
  false
);

let initGroupAngle = 0;
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
  let existingGroups = [];
  let isNewInExisting = false;
  let isExistingInNew = false;
  let parentExGroup = [];
  let childExGroups = [];
  let groupInMatch = [];
  let hasTarget = false;
  groupAllChildren.forEach(function(gr, index){
    let existingInNew = [];
    let newInExisting = [];
    let has = [];
    
    if (gr.includes(targetShape)) hasTarget = true;
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
    if (type == 'other' && has.includes(false) == false) {
      type = 'isAllMatch'
      existingGroup = index;
    }
    else if (type == 'other' && existingInNew.includes(false) == false) { //どれかのgroupAllChildrenの要素を全て持っていたら
      // type = 'existingInNew';
      isExistingInNew = true;
      existingGroup = index;
      existingGroups.push(index);
      childExGroups.push(index);
    }
    else if (type == 'other'&& newInExisting.includes(false) == false) { 
      // type = 'newInExisting';
      isNewInExisting = true;
      existingGroups.push(index);
      parentExGroup.push(index);
      //existingGroup = index;
    }
    if ((type == 'other' || type == 'isAllMatch')&& existingInNew.includes(false) == false) {
      if (index != existingGroup) groupInMatch.push(index);
    }
  });
 
  if (type == 'other' && isPartialMatch.includes(true) == false) {  //新規
    type = 'new';
  }
  else if (type == 'other' && ((isExistingInNew && isNewInExisting)) || (isExistingInNew && hasTarget == true)) {
    type = 'exInNewInEx';
  }
  else if (type == 'other' && isExistingInNew && !isNewInExisting) {
    type = 'existingInNew';
  }
  else if (type == 'other' && !isExistingInNew && isNewInExisting) {
    type = 'newInExisting';
  }
  
  
  let targetParent = target.getParent();
  targetZIndex = target.zIndex();

  switch (type) {
    case 'isAllMatch':
      initGroupAngle = group[existingGroup].getAttr('rotation');
      targetGroup = group[existingGroup];
      
      //axis = { x: useEyelet.getAbsolutePosition(group[existingGroup]).x, y: useEyelet.getAbsolutePosition(group[existingGroup]).y };
      console.log('isAllMatch')

      //子要素があった時の処理
      // let children = targetGroup.find('.rotateGroup');
      children = [];
      let tmp = targetGroup.getChildren();
      tmp.forEach(t => {
        if (t.getAttr('name') == 'rotateGroup' && t.id() != 'tmpGroupAtAllMatch') children.push(t);
      });

      if (children.length != 0) {
        let tmpGrandChildren = [];
        let grandChildren = [];
        children.forEach(function (child) {
          if (groupInMatch.length == 0) {
            tmpGrandChildren = child.getChildren();
          } else {
            groupInMatch.forEach(gim => {
              if (child != group[gim]) {
                tmpGrandChildren = child.getChildren();
              }
            });
          }
        });
        
        tmpGrandChildren.forEach(tg => {
          if (groupAllChildren[existingGroup].includes(tg) == false && !targetShape.getAttr('eyelets').includes(tg.id())) {
            grandChildren.push(tg);
          }
        })
        if (grandChildren.length != 0) {
          let tmpRotation = group[existingGroup].rotation();
          //group[existingGroup].rotation(0);
          let tmpOffset = group[existingGroup].offset();
          axis = {
            x: useEyelet.getAbsolutePosition(group[existingGroup]).x,
            y: useEyelet.getAbsolutePosition(group[existingGroup]).y  
          };
          let prePos = target.getAbsolutePosition();
          group[existingGroup].offsetX(axis.x);
          group[existingGroup].offsetY(axis.y);
          group[existingGroup].absolutePosition({
            x: axis.x,
            y: axis.y
          });
          let afterPos = target.getAbsolutePosition();
          group[existingGroup].absolutePosition({
            x: axis.x - (afterPos.x - prePos.x),
            y: axis.y - (afterPos.y - prePos.y)
          });

          let zIndex = targetShape.zIndex();

          tmpAxis = { x: useEyelet.getAbsolutePosition(grandChildren[0].getParent()).x, y: useEyelet.getAbsolutePosition(grandChildren[0].getParent()).y };
          let tmpG = new Konva.Group({
            width: 600,
            height: 400,
            x: tmpAxis.x,
            y: tmpAxis.y,
            offsetX: tmpAxis.x,
            offsetY: tmpAxis.y,
            id: 'tmpGroupAtAllMatch',
            name: 'rotateGroup',
          });
          grandChildren[0].getParent().add(tmpG);
          grandChildren.forEach(gc => {
            gc.moveTo(tmpG);
          });
          zIndex != 0 ? tmpG.zIndex(0) : targetShape.zIndex(0);
          group.push(tmpG);
          groupAllChildren.push(grandChildren);
        }
      }

      break;
    case 'new':
      groupAxis = {x: useEyelet.getAbsolutePosition(targetParent).x, y:useEyelet.getAbsolutePosition(targetParent).y}
      g.x(groupAxis.x);
      g.y(groupAxis.y);
      g.offsetX(groupAxis.x);
      g.offsetY(groupAxis.y);
      addDest = targetParent;
      addObj = rotObj;
      add(addObj, g, addDest, rotObj, type);
      console.log('new');
      break;
    case 'existingInNew':
      axis = {x: useEyelet.getAbsolutePosition(targetParent).x, y:useEyelet.getAbsolutePosition(targetParent).y}
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);
      addDest = targetParent;
      // group[existingGroup].moveTo(g);
      // rotObj.forEach(ro => {
      //   if (group[existingGroup].getChildren().includes(ro) == false) addObj.push(ro);
      // });
      // childExGroups.sort(function (a, b) {
      //   return group[a].getDepth() - group[b].getDepth();
      // });
      childExGroups.sort(function (a, b) {
        return group[a].getDepth() - group[b].getDepth();
      });

      let characterChildren = group[childExGroups[0]].getParent().getChildren();
      let comparison = [];
      function compareFunc(a, b) {
        return a.zIndex() - b.zIndex();
      }
      characterChildren.sort(compareFunc);
      characterChildren.forEach(cc => {
        if (rotObj.includes(cc) || cc == targetShape || cc.name() == 'rotateGroup') {
          cc == group[childExGroups[0]] ? comparison.push('target') : comparison.push('other');
        }
      });

      group[childExGroups[0]].moveTo(g);
      rotObj.forEach(ro => {
        if (groupAllChildren[childExGroups[0]].includes(ro) == false) {
          addObj.push(ro);
        }
      });
      add(addObj, g, addDest, rotObj, type);
      group[childExGroups[0]].zIndex(comparison.indexOf('target'));
      console.log('existingInNew');
      break;
    case 'newInExisting':
      //existingGroupsのDepthで降順にsortして[0](末端)を使用
      existingGroups.sort(function (a, b) {
        return group[b].getDepth() - group[a].getDepth();
      });

      addDest = group[existingGroups[0]];
      addObj = rotObj;
      axis = { x: useEyelet.getAbsolutePosition(group[existingGroups[0]]).x, y: useEyelet.getAbsolutePosition(group[existingGroups[0]]).y };
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);
      add(addObj, g, addDest, rotObj, type);
      console.log('newInExisting');
      break;
    case 'exInNewInEx': {
      if (parentExGroup.length != 0) {
        //sort
        parentExGroup.sort(function (a, b) {
          return group[b].getDepth() - group[a].getDepth();
        });
        //group[parentExistingGroup[0]]のしたにまずつくる
        addDest = group[parentExGroup[0]];
      } else {
        addDest = target.getParent();
        // g.rotation(-addDest.rotation());
      }
      axis = { x: useEyelet.getAbsolutePosition(addDest).x, y: useEyelet.getAbsolutePosition(addDest).y };
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);
      //rotObjを整理
      childExGroups.sort(function (a, b) {
        return group[a].getDepth() - group[b].getDepth();
      });
      group[childExGroups[0]].rotate(-addDest.rotation());

      rotObj.forEach(ro => {
        if (groupAllChildren[childExGroups[0]].includes(ro) == false) {
          addObj.push(ro);
        }
      });
      add(addObj, g, addDest, rotObj, type);

      let characterChildren = group[childExGroups[0]].getParent().getChildren();
      let comparison = [];
      function compareFunc(a, b) {
        return a.zIndex() - b.zIndex();
      }
      characterChildren.sort(compareFunc);
      characterChildren.forEach(cc => {
        cc == group[childExGroups[0]] ? comparison.push('target') : comparison.push('other');
      });
      
      group[childExGroups[0]].moveTo(g);
      group[childExGroups[0]].zIndex(comparison.indexOf('target'));
      console.log('exInNewInEx');
      break;
    }
    default: {
      addDest = targetParent;
      addObj = rotObj;
      axis = { x: useEyelet.getAbsolutePosition(targetParent).x, y: useEyelet.getAbsolutePosition(targetParent).y };
      g.x(axis.x);
      g.y(axis.y);
      g.offsetX(axis.x);
      g.offsetY(axis.y);

      

      //target(既)はそのまま それ以外はparentのoffsetを中心として -parent.rotation
      let tmpRotObj = rotObj.slice(1); //shape削除
      // let index = tmpRotObj.findIndex(element => element == useEyelet);
      // tmpRotObj.splice(index, 1);
      rotObj.sort(compareRotFunc);
      function compareRotFunc(a, b) {
        if (a == targetShape) {
          return targetParent.zIndex() - b.zIndex();
          
        } else if (b == targetShape) {
          return a.zIndex() - targetParent.zIndex();
        } else {
          return a.zIndex() - b.zIndex();
        }
      }
      

      let tmpG = new Konva.Group({
        width: 600,
        height: 400,
        x: targetParent.offsetX(),
        y: targetParent.offsetY(),
        offsetX: targetParent.offsetX(),
        offsetY: targetParent.offsetY(),
      });

      let characterChildren = addDest.getChildren();
      let comparison = [];
      
      function compareFunc(a, b) {
        return a.zIndex() - b.zIndex();
      }
      characterChildren.sort(compareFunc);
      characterChildren.forEach(cc => {
        cc == targetShape ? comparison.push('target') : comparison.push('other');
      });
      tmpRotObj.sort(compareFunc);

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
      add(addObj, g, addDest, rotObj, type);
      g.zIndex(comparison.indexOf('target'));
      console.log('default');
      break;
    }
  }

  

}

function add(addObj, g, addDest, rotObj, type) {
  let targetAncestors = targetShape.getAncestors();
  let charG = targetAncestors[targetAncestors.length - 3];
  let characterChildren = addDest.getChildren();
  let a = [];
  let comparison = [];
  
  
  function compareFunc(a, b) {
    return a.zIndex() - b.zIndex();
  }
  characterChildren.sort(compareFunc);
  characterChildren.forEach(cc => {
    
    if (!rotObj.includes(cc) || cc == targetShape) {
      a.push(cc)
      cc == targetShape ? comparison.push('target') : comparison.push('other');
    }
  });
  if(type != 'other') addObj.sort(compareFunc);
  addObj.forEach(o => {
    o.moveTo(g);
  });
  addDest.add(g);
  group.push(g);
  groupAllChildren.push(rotObj);
  g.zIndex(comparison.indexOf('target'));
}


function rotateGroup(rotObj, angle) {
  
  let g = targetGroup;
  if (g == null) g = rotObj[0].getParent();
  
  g.rotation(initGroupAngle + angle);
  if (g.find('#tmpGroupAtAllMatch').length != 0 && children.length != 0) {
    let tmpGroup = stage.findOne('#tmpGroupAtAllMatch');
    tmpGroup.rotation(- angle);
  }
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
    }, tmpLayer);
    anim.start();
  }

  
}