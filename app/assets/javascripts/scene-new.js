{
  //左側のキャラクターたち
  let charContainer = document.getElementById("charContainer");
  let childrenLength = charContainer.childElementCount;
  let counter = 0;
  let stages = [];
  let targetChar;

  let n = 0;
  while (counter < childrenLength) {
    if (document.getElementById('char' + n + '-data')) {
      let json = document.getElementById('char' + n + '-data').value
      stages[counter] = new Konva.Stage({
        container: 'char' + n + '-stage',
        width: 90,
        height: 90,
        id: 'stage' + counter,
        scaleX: 9 / 40,
        scaleY: 9 / 40,
      });
      let layer = Konva.Node.create(json);
      let changeStrokeShapes = layer.find('.rect, .circle, .triangle');
      changeStrokeShapes.forEach(s => {
        s.strokeWidth(0.8);
      });
      stages[counter].add(layer);
      setAddListener(stages[counter], 'char' + n);
      counter++;
    }
    n++;
  }

  let charCounter = 0;
  function setAddListener(charStage, charContainerId) {
    document.getElementById(charContainerId).addEventListener(
      'click',
      function () {
        let char = charStage.findOne('#characterGroup')
        let cloneChar = char.clone({
          draggable: true,
          name: 'characterGroup' + charCounter,
        }).moveTo(layer);
        cloneChar.offsetX(cloneChar.getClientRect().x + cloneChar.getClientRect().width / 2);
        cloneChar.offsetY(cloneChar.getClientRect().y + cloneChar.getClientRect().height / 2);
        cloneChar.scaleX(0.8);
        cloneChar.scaleY(0.8);
        cloneChar.x(110);
        cloneChar.y(-110);
        startTween(cloneChar);
        let changeStrokeShapes = cloneChar.find('.rect, .circle, .triangle');
        changeStrokeShapes.forEach(s => {
          s.strokeWidth(4);
        });
        charCounter++;
        tr.nodes([cloneChar]);
        tr.moveToTop();

        cloneChar.on('mousedown click tap', function (e) {
          console.log(e.target)
          e.target.name() == 'faceParts' ? console.log('face') : targetChar = e.target;
          if (targetChar.id() != ('characterGroup')) targetChar = targetChar.getParent();
          console.log(targetChar)
          targetChar.moveToTop();
          tr.nodes([targetChar]);
          tr.moveToTop();
          getTarget(targetChar, tr);
        });
      }, false
    );
  }

  function startTween(shape) {
    let tween = new Konva.Tween({
      node: shape,
      y: 200,
      easing: Konva.Easings['BounceEaseOut'],
      duration: 1,
    });
    tween.play();
  }

  //main-canvas
  var stage = new Konva.Stage({
    container: 'scene-container',
    width: 600,
    height: 400,
    id: 'stage',
  });

  var layer = new Konva.Layer({
    id: 'layer',
  });
  stage.add(layer);


  //バウンディングボックス
  var tr = new Konva.Transformer();
  layer.add(tr);

  stage.on('click tap', function (e) {
    if (e.target === stage) {
      tr.nodes([]);
    }
  });

  ////セーブ
  document.getElementById('save').addEventListener(
    'click',
    function () {
      var json = stage.toJSON();

      const form = document.createElement('form');
      form.method = "post";
      form.action = "/scenes/create_tmp";

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
      layer.find('#characterGroup').forEach(c => {
        c.destroy();
      });
      tr.nodes([]);
    },
    false
  );
}