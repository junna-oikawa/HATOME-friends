window.addEventListener('DOMContentLoaded', () => {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
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
        name: "rect",
        id: "shape" + clickCount,
        eyelets: [],
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
        name: "circle",
        id: "shape" + clickCount,
        eyelets: [],
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
        name: "rectangle",
        id: "shape" + clickCount,
        eyelets: [],
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
      selectedShape = null;
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

});
