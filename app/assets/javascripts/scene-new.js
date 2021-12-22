{

//   // ページをreloadする方法
// // reloadの応用方法
// // キャッシュを無視してリロードする方法
// function doReloadNoCache() {
 
//   // キャッシュを無視してサーバーからリロード
//   window.location.reload(true);

// }

// window.addEventListener('load', function () {
//   console.log('a')
//   // ページ表示完了した5秒後にリロード
//   setTimeout(doReloadNoCache, 5000);
  

// });
  
  //左側のキャラクターたち
  let charContainer = document.getElementById("stageLeft");
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
        charCounter++;
        tr.nodes([cloneChar]);
        tr.moveToTop();

        cloneChar.on('mousedown click tap', function (e) {
          e.target.name() == 'faceParts' ? console.log('face') : targetChar = e.target;
          if (targetChar.id() != ('characterGroup')) targetChar = targetChar.getParent();
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
  let stage = new Konva.Stage({
    container: 'stageCenter',
    width: 600,
    height: 400,
    id: 'stage',
  });

  var layer = new Konva.Layer({
    id: 'layer',
  });
  stage.add(layer);

  let bgLayer = new Konva.Layer({
    id: 'bgLayer',
  });
  stage.add(bgLayer);
  bgLayer.moveToBottom();

  //バウンディングボックス
  var tr = new Konva.Transformer();
  layer.add(tr);

  stage.on('click tap', function (e) {
    if (e.target == stage || e.target.name() == 'back-image') {
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

  document.getElementById('visibility').addEventListener(
    'click',
    function () {
      let eyelets = stage.find('.eyelet');
      if (eyelets[0].visible() == true) {
        eyelets.forEach(e => {
          e.visible(false);
        });
      } else {
        eyelets.forEach(e => {
          e.visible(true);
        });
      }
    },
    false
  );

  //背景
  let sources = [];
  for (let i = 0; i < 15; i++) {
    sources[i] = '/assets/bg-' + (i + 1) + '.jpg'
  }
  bgPalette();
  function bgPalette() {
    let bgContainer = document.getElementById("stageRight");
    for (let i = 0; i < sources.length; i++) {
      let bg = document.createElement('div');
      bg.id = 'bgImage-' + i;
      bg.classList.add('bg-image');
      bgContainer.appendChild(bg);
      makeContent('bgImage-' + i, i);
    }
  }

  function makeContent(containerId, index) {
    var partialStage = new Konva.Stage({
      container: containerId,
      width: 200,
      height: 400 / 3,
    });

    var partialLayer = new Konva.Layer();
    partialStage.add(partialLayer);

    let imageObj = new Image();
    let bg;
    imageObj.onload = function () {
      bg = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: 200,
        height: 400 / 3,
        name: 'back-image',
        id: 'bg' + index,
        'image-src': sources[index],
      });
      partialLayer.add(bg);
    }
    imageObj.src = sources[index];

    document.getElementById(containerId).addEventListener(
      'click',
      function () {
        bgLayer.destroyChildren();
        partialLayer.findOne('#bg' + index).clone({
          width: 600,
          height: 400,
        }).moveTo(bgLayer);
      }, false
    );
  }
}