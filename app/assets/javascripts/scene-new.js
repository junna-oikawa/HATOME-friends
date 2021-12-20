{
  //左側のキャラクターたち
  let charContainer = document.getElementById("char-container");
  let childrenLength = charContainer.childElementCount;
  let counter = 0;
  let stages = [];

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
      stages[counter].add(layer);
      counter++;
      //number.push(n);
      //stages.push(stage);
    }
    n++;
  }

  //もしくは最初から90x90にする
  // function fitStageIntoParentContainer() {
  //   for (let j = 0; j < number.length; j++){
  //     var container = document.querySelector('#char' + number[j]);

  //     // now we need to fit stage into parent container
  //     var containerWidth = container.clientWidth;
  //     var scale = containerWidth / 500;
  //     let stage = stages[j];
  //     stage.width(400 * scale);
  //     stage.height(400 * scale);
  //     stage.scale({ x: scale*0.7, y: scale*0.7 });

  //     container.style.height = (containerWidth) + "px";
  //   }
  // }

  // fitStageIntoParentContainer();
  // // adapt the stage on any window resize
  // window.addEventListener('load', fitStageIntoParentContainer);

  //////////////////////////

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
  getVariable(stage, layer);

  ///////キャラがクリックされたら
  for (let i = 0; i < stages.length; i++) {
    stages[i].on('click', function (e) {
      let char = stages[i].findOne('#characterGroup')
      char.clone({
        draggable: true,
        name: 'characterGroup' + i,
      }).moveTo(layer);
    });
  }

  //バウンディングボックス
  var tr = new Konva.Transformer();
  layer.add(tr);

  layer.on('mousedown', function (e) {
    if (e.target.getDepth() == 2) {
      selectedShape = e.target;
    } else if (e.target.getDepth() >= 3) {
      selectedShape = e.target.getParent();
    }
    getTarget(selectedShape, tr);
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

  stage.on('click tap', function (e) {
    if (e.target === stage) {
      tr.nodes([]);
    }
  });

  // stage.on('mousemove', function (e) {
  //   let tgt = tr.nodes()[0]
  //   if (tgt == null) return;
  //   if (tgt.getAttr('name') == 'circle') {
  //     tgt.setAttrs({
  //       radiusX: tgt.radiusX() * tgt.scaleX(),
  //       radiusY: tgt.radiusY() * tgt.scaleY(),
  //       scaleX: 1,
  //       scaleY: 1,
  //     })
  //   } else if (tgt.getAttr('name') == 'triangle'||tgt.getAttr('name') == 'rect'){
  //     let points = tgt.points();
  //     let scale = tgt.getAttr('scale');
  //     for (let i = 0; i < points.length; i++) {
  //       i % 2 == 0 ? points[i] *= scale.x : points[i] *= scale.y;
  //     }
  //     tgt.setAttrs({
  //       points: points,
  //       scaleX: 1,
  //       scaleY: 1,
  //     })
  //   }
  // });


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


}