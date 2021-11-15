
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

var layer = new Konva.Layer();
var offsetX = 0;
var offsetY = 0;
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
var selectedBox = null;
var clickCount = 0;
var colorCount = 0;
var shapes = [];
var selectedShape = null;




stage.add(layer);

var tr = new Konva.Transformer();
layer.add(tr);


document.getElementById('makeBox').addEventListener(
  'click',
  function () {
    shapes[clickCount] = new Konva.Rect({
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      fill: colors[colorCount],
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      name: "number" + clickCount,
      offset: { x: 50, y: 50 },
    });

    shapes[clickCount].on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    shapes[clickCount].on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    layer.add(shapes[clickCount]);

    clickCount += 1;
    colorCount += 1;
    if (colorCount > 5) colorCount = 0;
  },
  false
);

document.getElementById('makeCircle').addEventListener(
  'click',
  function () {
    shapes[clickCount] = new Konva.Circle({
      x: 200,
      y: 200,
      radius: 50,
      fill: colors[colorCount],
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      name: "number" + clickCount,
    });
    shapes[clickCount].on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    shapes[clickCount].on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    layer.add(shapes[clickCount]);

    clickCount += 1;
    colorCount += 1;
    if (colorCount > 5) colorCount = 0;
  },
  false
);

document.getElementById('makeTriangle').addEventListener(
  'click',
  function () {
    shapes[clickCount] = new Konva.RegularPolygon({
      x: 200,
      y: 200,
      sides: 3,
      radius: 60,
      fill: colors[colorCount],
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
      name: "number" + clickCount,
      offset: { x: 0, y: -10 },
    });
    shapes[clickCount].on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    shapes[clickCount].on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    layer.add(shapes[clickCount]);

    clickCount += 1;
    colorCount += 1;
    if (colorCount > 5) colorCount = 0;
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

document.getElementById('save').addEventListener(
  'click',
  function () {
    var json = stage.toJSON();
    console.log(json);

    const form = document.createElement('form');
    form.method = "post";
    form.action = "/practices";

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
  if (e.target === layer) {
    tr.nodes([]);
    return;
  }
  selectedShape = e.target;
  selectedShape.moveToTop();
  tr.moveToTop();

  // alert('you clicked on "' + selectedShape.name() + '"');
});

layer.on('click tap', function (e) {
  tr.nodes([e.target]);
  tr.moveToTop();
});

stage.on('click tap', function (e) {
  if (e.target === stage) {
    tr.nodes([]);
    return;
  }
});