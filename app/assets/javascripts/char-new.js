// window.addEventListener('DOMContentLoaded', () => {
  // var width = window.innerWidth;
  // var height = window.innerHeight;
var width = 400;
var height = 400;
let face;
let toGroup = [];

  var stage = new Konva.Stage({
    container: 'char-stage',
    width: width,
    height: width,
    id: 'stage',
  });



  var layer = new Konva.Layer({
    id: 'layer',
  });
  var offsetX = 0;
  var offsetY = 0;
  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
  var selectedBox = null;
  var clickCount = 0;
  var colorCount = 0;
  var shapes = [];
  var selectedShape = null;
stage.add(layer);
  
let group = new Konva.Group({
  x: 0,
  y: 0,
  id: "characterGroup",
  name: "element"
});
layer.add(group);

  var tr = new Konva.Transformer({
    ignoreStroke: true,
  });
  layer.add(tr);


  document.getElementById('makeBox').addEventListener(
    'click',
    function () {
      shapes[clickCount] = new Konva.Line({
        points: [-50, -50, 50, -50, 50, 50, -50, 50],
        x: 200,
        y: 200,
        fill: colors[colorCount],
        stroke: 'black',
        strokeWidth: 4,
        closed: true,
        draggable: true,
        name: "rect",
        id: "shape" + clickCount,
        eyelets: [],
        face: false,
      });

      shapes[clickCount].on('mouseover', function () {
        document.body.style.cursor = 'pointer';
      });
      shapes[clickCount].on('mouseout', function () {
        document.body.style.cursor = 'default';
      });
      layer.add(shapes[clickCount]);
      toGroup.push(shapes[clickCount]);
      

      clickCount += 1;
      colorCount += 1;
      if (colorCount > 5) colorCount = 0;
    },
    false
  );

  document.getElementById('makeCircle').addEventListener(
    'click',
    function () {
      shapes[clickCount] = new Konva.Ellipse({
        x: 200,
        y: 200,
        radiusX: 50,
        radiusY: 50,
        fill: colors[colorCount],
        stroke: 'black',
        strokeWidth: 4,
        draggable: true,
        name: "circle",
        id: "shape" + clickCount,
        eyelets: [],
        face: false,
      });
      shapes[clickCount].on('mouseover', function () {
        document.body.style.cursor = 'pointer';
      });
      shapes[clickCount].on('mouseout', function () {
        document.body.style.cursor = 'default';
      });
      layer.add(shapes[clickCount]);
      toGroup.push(shapes[clickCount]);

      clickCount += 1;
      colorCount += 1;
      if (colorCount > 5) colorCount = 0;
    },
    false
  );

  document.getElementById('makeTriangle').addEventListener(
    'click',
    function () {
      shapes[clickCount] = new Konva.Line({
        x: 0,
        y: 0,
        points: [0, -36.6, 50, 50, -50, 50],
        fill: colors[colorCount],
        stroke: 'black',
        strokeWidth: 4,
        closed: true,
        draggable: true,
        name: "rect",
        id: "shape" + clickCount,
        eyelets: [],
        face: false,
      });
      shapes[clickCount].on('mouseover', function () {
        document.body.style.cursor = 'pointer';
      });
      shapes[clickCount].on('mouseout', function () {
        document.body.style.cursor = 'default';
      });
      layer.add(shapes[clickCount]);
      toGroup.push(shapes[clickCount]);
      
      clickCount += 1;
      colorCount += 1;
      if (colorCount > 5) colorCount = 0;

    },
    false
  );

  document.getElementById('face').addEventListener(
    'click',
    function () {
      shapes[clickCount] = new Konva.Group({
        x: 0,
        y: 0,
        offsetX: 100, //200pxで顔を作ったから？
        offsetY: 100,
        draggable: true,
        id: "face",
        // faceParent: '',
      });

      var path1 = new Konva.Path({
        x: 0,
        y:0,
        data:
          'MM73.59,88.11c-1.02,1.46-2.06,2.96-2.53,4.68c-0.47,1.72-0.26,3.73,0.98,5.01c1.33,1.38,3.56,1.58,5.36,0.93c2.95-1.07,4.95-4.5,4.08-7.51C80.6,88.2,75.61,85.21,73.59,88.11z',
        fill: 'black',
        name: "face",
        id: "a",
      });
      shapes[clickCount].add(path1);

      var path2 = new Konva.Path({
        data:
          'M120.9,89.9c-1.8,2.17-3.72,4.92-2.79,7.58c0.91,2.6,4.37,3.6,6.93,2.59c2.09-0.82,3.73-2.76,4.06-4.98c0.34-2.22-0.71-4.62-2.62-5.78C124.56,88.14,122.06,88.5,120.9,89.9z',
        fill: 'black',
        name: "face",
        id: "a",
      });
      shapes[clickCount].add(path2);

      var path3 = new Konva.Path({
        data:
          'M101.24,112.92c-0.71,0.21-1.43,0.19-2.15-0.01c-1.58-0.44-4.4-1.19-5.41-4.07c-0.34-0.98,1.14-2.13,2.47-2.22c1.27-0.08,6.19-0.2,8.07,0.19c1.42,0.3,1.92,1.16,1.72,2.02C105.48,110.93,103.87,112.14,101.24,112.92z',
        fill: 'black',
        name: "face",
        id: "a",
      });
      shapes[clickCount].add(path3);
      layer.add(shapes[clickCount]);
      toGroup.push(shapes[clickCount]);
      face = shapes[clickCount];
      
      
      clickCount += 1;

      
    },
    false
  );

  

  

  document.getElementById('toTop').addEventListener(
    'click',
    function () {
      selectedShape.moveToTop();
      tr.moveToTop();
    },
    false
  );

  document.getElementById('toBottom').addEventListener(
    'click',
    function () {
      selectedShape.moveToBottom();
    },
    false
  );

  document.getElementById('up').addEventListener(
    'click',
    function () {
      selectedShape.moveUp();
    },
    false
  );

  document.getElementById('down').addEventListener(
    'click',
    function () {
      selectedShape.moveDown();
    },
    false
  );

  document.getElementById('save-kari').addEventListener(
    'click',
    function () {
        
        if (face != null) {
          let faceR = face.getClientRect();
          let checkPos = { x: faceR.x + faceR.width / 2, y: faceR.y + faceR.height / 2 };
          let tar = layer.getIntersection(checkPos);
          tar.setAttr('face', true);
          face.setAttr('faceParent', tar);
        }
        
    },
    false
  );


  document.getElementById('save').addEventListener(
    'click',
    function () {
      //顔を見つける
        
      if (face != null) {
        let faceR = face.getClientRect();
        let checkPos = { x: faceR.x + faceR.width / 2, y: faceR.y + faceR.height / 2 };
        let tar = layer.getIntersection(checkPos);
        tar.setAttr('face', true);
        face.setAttr('faceParent', tar.getAttr('id'));
      }

      function compareFunc(a, b) {
        return a.zIndex() - b.zIndex();
      }
       
      toGroup.sort(compareFunc);

      toGroup.forEach(function (e) {
        group.add(e);
      });

      // let group = new Konva.Group({});
      // for (let i = 0; shapes.length; i++){
      //   group.add(shapes[i]);
      // }
      // group.add(face);

      var json = stage.toJSON();

      const form = document.createElement('form');
      form.method = "post";
      form.action = "/characters/create_tmp_character";

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

  document.getElementById('destroy').addEventListener(
    'click',
    function () {
      selectedShape.destroy();
      tr.nodes([]);
    },
    false
  );

  document.getElementById('destroy_all').addEventListener(
    'click',
    function () {
      for (var i = 0; i < shapes.length; i++) {
        shapes[i].destroy();
      }
      tr.nodes([]);
    },
    false
  );


  layer.on('mousedown', function (e) {
    
    if (e.target.getDepth() == 2) {
      selectedShape = e.target;
    } else if (e.target.getDepth() == 3) {
      selectedShape = e.target.getParent();
    }
    selectedShape.moveToTop();
    tr.moveToTop();

    // alert('you clicked on "' + selectedShape.name() + '"');
  });

layer.on('click tap', function (e) {
  if (e.target.getDepth() == 2) {
    tr.nodes([e.target]);
  } else if (e.target.getDepth() == 3) {
    tr.nodes([e.target.getParent()]);
  }
    
    tr.moveToTop();
  });

  let trWidth;
  let trHeight;
  stage.on('click tap', function (e) {
    if (e.target === stage) {
      tr.nodes([]);
      selectedShape = null;
    }
  });

  stage.on('mousemove', function (e) {
    let tgt = tr.nodes()[0]
    if (tgt == null) return;
    if (tgt.getAttr('name') == 'circle') {
      tgt.setAttrs({
        radiusX: tgt.radiusX() * tgt.scaleX(),
        radiusY: tgt.radiusY() * tgt.scaleY(),
        scaleX: 1,
        scaleY: 1,
      })
    } else if (tgt.getAttr('name') == 'triangle'||tgt.getAttr('name') == 'rect'){
      let points = tgt.points();
      let scale = tgt.getAttr('scale');
      for (let i = 0; i < points.length; i++) {
        i % 2 == 0 ? points[i] *= scale.x : points[i] *= scale.y;
      }
      tgt.setAttrs({
        points: points,
        scaleX: 1,
        scaleY: 1,
      })
    }
  });
  



  document.getElementById('white').addEventListener(
    'click', () => selectedShape.fill('white'), false
  );
  document.getElementById('black').addEventListener(
    'click', () => selectedShape.fill('black'), false
  );
  document.getElementById('orange').addEventListener(
    'click', () => selectedShape.fill('#fd7e14'), false
  );
  document.getElementById('red').addEventListener(
    'click', () => selectedShape.fill('#dc3545'), false
  );
  document.getElementById('blue').addEventListener(
    'click', () => selectedShape.fill('#0d6efd'), false
  );
  document.getElementById('yellow').addEventListener(
    'click', () => selectedShape.fill('#ffc107'), false
  );
  document.getElementById('green').addEventListener(
    'click', () => selectedShape.fill('#20c997'), false
  );

//});


// //レスポンシブ
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