{
  var width = 400;
  var height = 400;
  let sampleShapes = [];

  var stage = new Konva.Stage({
    container: 'stageCenter',
    width: width,
    height: width,
    id: 'stage',
  });

  var layer = new Konva.Layer({
    id: 'layer',
  });
  var clickCount = 0;
  var shapes = [];
  var selectedShape = null;
  stage.add(layer);

  var tr = new Konva.Transformer({
    ignoreStroke: true,
  });
  layer.add(tr);

  function resize() {
    let resizeShapes = layer.find('.rect, .triangle, .circle');
    resizeShapes.forEach(s => {
      if (s.name() == 'circle') {
        s.setAttrs({
          radiusX: s.radiusX() * s.scaleX(),
          radiusY: s.radiusY() * s.scaleY(),
          scaleX: 1,
          scaleY: 1,
        })
      } else if (s.name() == 'triangle' || s.name() == 'rect') {
        let points = s.points();
        let scale = s.getAttr('scale');
        for (let i = 0; i < points.length; i++) {
          i % 2 == 0 ? points[i] *= scale.x : points[i] *= scale.y;
        }
        s.setAttrs({
          points: points,
          scaleX: 1,
          scaleY: 1,
        })
      }
    });
  }

  document.getElementById('save').addEventListener(
    'click',
    function () {
      // scaleをwidth, heightへ変換
      resize();
      //顔を見つける
      let face = stage.findOne('#face');
      if (face != null) {
        let faceR = face.getClientRect();
        let checkPos = { x: faceR.x + faceR.width / 2, y: faceR.y + faceR.height / 2 };
        let targets = layer.getAllIntersections(checkPos);
        let tar;
        function compareFunc(a, b) {
          return b.zIndex() - a.zIndex();
        }
        targets.sort(compareFunc);
        targets.forEach(t => {
          if (t.id() != 'face' && t.name() != 'faceParts' && tar == null) tar = t;
        });
        tar.setAttr('face', true);
        face.setAttr('faceParent', tar.id());
        face.zIndex(tar.zIndex() + 1);
      }

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

  

  document.getElementById('destroyAll').addEventListener(
    'click',
    function () {
      shapes.forEach(s => {
        s.destroy();
      });
      tr.nodes([]);
    },
    false
  );

  stage.on('click tap', function (e) {
    if (e.target === stage) {
      tr.nodes([]);
      selectedShape = null;
    }
  });


  // 図形ボタン
  let shapesContainer = document.getElementById("stageLeft");
  let shapeNames =
    ['rect', 'circle', 'triangle', 'face'];

  shapeNames.forEach(s => {
    let shape = document.createElement('div');
    shape.id = s;
    shape.class = 'shape';
    shapesContainer.appendChild(shape);
    makeShapeButton(s);
  });

  
  function makeShapeButton(shapeName) {
    let partialStage = new Konva.Stage({
      container: shapeName,
      width: 120,
      height: 120,
      listening: false,
    });

    let partialLayer = new Konva.Layer();
    partialStage.add(partialLayer);
    let shape;
    switch (shapeName) {
      case 'rect':
        shape = new Konva.Line({
          points: [-50, -50, 50, -50, 50, 50, -50, 50],
          x: 60,
          y: 60,
          fill: '#F39800',
          stroke: 'black',
          strokeWidth: 4,
          closed: true,
          name: 'shapeButton',
        });
        break;
      case 'circle':
        shape = new Konva.Ellipse({
          x: 60,
          y: 60,
          radiusX: 50,
          radiusY: 50,
          fill: '#F39800',
          stroke: 'black',
          strokeWidth: 4,
          name: 'shapeButton',
        });
        break;
      case 'triangle':
        shape = new Konva.Line({
          x: 60,
          y: 60,
          points: [0, -36.6, 50, 50, -50, 50],
          fill: '#F39800',
          stroke: 'black',
          strokeWidth: 4,
          closed: true,
          name: 'shapeButton',
        });
        break;
      case 'face':
        shape = new Konva.Group({
          x: 60,
          y: 60,
          offsetX: 60,
          offsetY: 60,
          name: 'shapeButton',
        });

        data = 
          ['M34.7,49.2c-1,1.5-2.1,3-2.5,4.7s-0.3,3.7,1,5c1.3,1.4,3.6,1.6,5.4,0.9c2.9-1.1,4.9-4.5,4.1-7.5C41.7,49.3,36.7,46.3,34.7,49.2z',
          'M82,51c-1.8,2.2-3.7,4.9-2.8,7.6c0.9,2.6,4.4,3.6,6.9,2.6c2.1-0.8,3.7-2.8,4.1-5c0.3-2.2-0.7-4.6-2.6-5.8C85.7,49.3,83.2,49.6,82,51z',
          'M62.4,74.1c-0.7,0.2-1.4,0.2-2.2,0c-1.6-0.4-4.4-1.2-5.4-4.1c-0.3-1,1.1-2.1,2.5-2.2c1.3-0.1,6.2-0.2,8.1,0.2c1.4,0.3,1.9,1.2,1.7,2C66.6,72.1,65,73.3,62.4,74.1z']

        data.forEach(d => {
          let path = new Konva.Path({
            x: 0,
            y: 0,
            data: d,
            fill: 'black',
            name: 'faceParts',
          });
          shape.add(path);
        });

        let bg = new Konva.Rect({
          x: 20,
          y: 20,
          width: 80,
          height: 80,
          name: 'faceParts',
        });
        shape.add(bg);
        break;
    }
    partialLayer.add(shape);
    setShapeBtnFunc(shape, shapeName);
    if (shapeName != 'face') sampleShapes.push(shape);
  }
  colorPalette();

  function setShapeBtnFunc(shape, shapeName) {
    // let shape;
    document.getElementById(shapeName).addEventListener(
      'click',
      function () {
        let makeShape = shape.clone({
          draggable: true,
          name: shapeName,
          strokeScaleEnabled: false,
        }).moveTo(layer);
        makeShape.moveToTop();

        if (shapeName == 'face') {
          makeShape.id('face');
          makeShape.setAttr('faceParent', '');
        } else {
          makeShape.id('shape' + clickCount);
          makeShape.setAttr('eyelets', []);
          makeShape.setAttr('face', false);
        }

        tr.nodes([makeShape]);
        shapes.push(makeShape);
        clickCount++;
        tr.moveToTop();
        selectedShape = makeShape;
        startTween(makeShape);
        getTarget(selectedShape, tr);

        makeShape.on('mousedown click tap', function (e) {
          e.target.name() == 'faceParts' ? selectedShape = e.target.getParent() : selectedShape = e.target;
          tr.nodes([selectedShape]);
          tr.moveToTop();
          getTarget(selectedShape, tr);
        });
      },
      false
    );
  }

  function startTween(shape) {
    let tween = new Konva.Tween({
      node: shape,
      y: 300,
      easing: Konva.Easings['BounceEaseOut'],
      duration: 1,
    });
    tween.play();
  }

  // 色
  function colorPalette() {
    let colorContainer = document.getElementById("stageRight");
    let colorsName =
      ['E60012', 'F39800', 'FFF100', '8FC31F', '009944', '009E96',
        '00A0E9', '0068B7', '1D2088', '920783', 'E4007F', 'E5004F', 'FFFFFF', '000000'];
    colorsName.forEach(c => {
      let color = document.createElement('div');
      color.id = c;
      colorContainer.appendChild(color);
      makeContent(c);
      document.getElementById(c).addEventListener(
        'click',
        function () {
          if (selectedShape != null) selectedShape.fill('#' + c)
          sampleShapes.forEach(s => {
            s.fill('#' + c);
          })
        }, false
      );
    });
  }



  function makeContent(colorCode) {
    let data = [
      'M84,27.9c-2.7-2.7-5.4-5.5-8.1-8.2c-0.5-0.5-1-1.1-1-1.8c-0.1-1.4,1.8-2.5,3.2-2.3c1.4,0.2,2.4,1.2,3.3,2.2c5.6,6,10.9,12.3,16.2,18.5c0.8,0.9,1.6,1.9,1.6,3.1c0,1.2-1.1,2.7-2.4,2.6c-0.6-0.1-1.1-0.5-1.5-0.8C90.8,37.1,86.8,32.5,84,27.9z',
      'M76.3,20.8C65,31.5,53.4,41.9,41.6,51.9',
      'M95.1,41.1c-12,10.2-24,20.3-36.1,30.3',
      'M41.5,51.8c-0.5,4.3-0.7,8.9-1.2,13.1',
      'M43.1,55.7c2.8,5.6,7.2,10.3,12.6,13.6',
      'M44.5,70.8c-1.6-1.1-2.8-2.6-3.6-4.4',
      'M39.5,64.7c-0.4,0.1-0.8,0.2-1.2,0.3c0.1,0.2,0.2,0.5,0.2,0.7c-0.3,0.1-0.6,0.1-1,0.1s-0.7,0.2-0.8,0.5c0,0.2,0,0.5-0.2,0.6c-0.1,0-0.3-0.1-0.4,0c-0.1,0.1,0,0.1,0,0.2c0,0.2-0.2,0.4-0.4,0.5s-0.4,0.1-0.6,0c0,0.1,0.1,0.2,0,1c0.8,3.2,3.1,5.9,6,7.3',
      'M46.8,72.7c-0.4,0.1-0.8,0.4-0.9,0.9c0,0.1,0,0.1-0.1,0.2c-0.1,0.2-0.4,0.1-0.6,0.2C45,74,45,74.3,44.8,74.6c-0.3,0.4-1,0.3-1.2,0.8c0,0.2,0,0.4-0.1,0.5c-0.1,0.1-0.2,0-0.2,0.1c-0.3,0-0.6,0.3-0.9,0.5s-0.8,0.2-0.9-0.1',
      'M37.4,69.2c0.7,1.9,2.2,3.4,4,4.3',
      'M39.5,68.3c0.4,1.5,1.4,2.8,2.8,3.5',
      'M59.2,71.4c-4.3,0.2-8.9,0-13.2,0.2'

    ]

    let dataWFill = [
      { d: 'M35,69.4c-0.4,1.1-1.7,2.5-5.4,3.8c-1.1,0.4-4.5,1-6.6,1.6c-1.7,0.4-3.8,0.8-5.3,1.8c-3.5,2.4-4.7,3.7-5.3,8.3c-0.6,4,3.4,7.1,7,8.6c4,1.6,9,1.1,13-1.3c4-2.4,6.9-6.7,7.5-11.1c0.2-1.7,0.3-3.5,1.5-4.7', fill: '#' + colorCode },
      { d: 'M84.1,49.8c-2.9-1.1-5.1-3.2-7.1-5.4c-4-4.3-7.7-8.9-11.1-13.7L51.8,43.5c3.7,5,7.5,9.9,11.6,14.6c1.5,1.7,3.1,3.4,5.1,4.5', fill: '#' + colorCode },
      { d: 'M35.9,80.5c-0.6,1.1-1.2,2.2-2.1,3c-0.5,0.5-1.2,0.8-1.7,1.2c-0.5,0.4-1,1-1.1,1.7c0,0.2,0,0.3,0.1,0.4c0.1,0.3,0.5,0.3,0.8,0.3c2.4,0,4.5-1.9,5.5-4.1c0.2-0.5,0.4-1,0.4-1.5c0-0.5-0.3-1-0.7-1.3S35.9,80.3,35.9,80.5z', fill: 'white' },
      { d: 'M28.5,89.9c-0.5-0.4-1.1-1-0.9-1.6c0.1-0.2,0.2-0.3,0.4-0.5c0.6-0.4,1.6,0,1.7,0.7C29.8,89.3,28.9,90.2,28.5,89.9z', fill: 'white' },
    ]

    var partialStage = new Konva.Stage({
      container: colorCode,
      width: 110,
      height: 110,
      listening: false,
    });

    var partialLayer = new Konva.Layer();
    partialStage.add(partialLayer);
    console.log(partialLayer.isListening())

    dataWFill.forEach(d => {
      let path = new Konva.Path({
        data: d.d,
        strokeWidth: 1.5,
        stroke: '#696969',
        fill: d.fill,
        lineCap: 'round',
        lineJoin: 'round',
      });
      partialLayer.add(path);
    });

    data.forEach(d => {
      let path = new Konva.Path({
        data: d,
        strokeWidth: 1.5,
        stroke: '#696969',
        lineCap: 'round',
        lineJoin: 'round',
      });
      partialLayer.add(path);
    });
  }
}