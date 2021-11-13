
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

document.getElementById('makeBox').addEventListener(
  'click',
  function () {
    shapes[clickCount] = new Konva.Rect({
      x: 300,
      y: 100,
      width: 100,
      height: 50,
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

document.getElementById('makeCircle').addEventListener(
  'click',
  function () {
    shapes[clickCount] = new Konva.Circle({
      x: 300,
      y: 100,
      radius: 40,
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

document.getElementById('toTop').addEventListener(
  'click',
  function () {
    selectedShape.moveToTop();
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
    var send_data = new XMLHttpRequest();
    send_data.open('POST', '/practices', false);
    send_data.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    send_data.send("data=" + json);


    // var form = document.createElement('form');
    // document.body.appendChild(form);
    // form.method = 'post';
    // form.action = '/practices';
    // var input = document.createElement('input');
    // input.type = 'hidden';
    // input.name = name;
    // input.value = json;
    // form.appendChild(input);
    // console.log(form);

    // form.submit();
  },
  false
);

layer.on('click', function (evt) {
  selectedShape = evt.target;
  // alert('you clicked on "' + selectedShape.name() + '"');
});

