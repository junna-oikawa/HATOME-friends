{
  var $document = $(document);
  var supportTouch = 'ontouchend' in document;
  var eve_click = supportTouch ? 'touchend' : 'click';

  let jsonLoad = document.getElementById('data').value
  let stage = Konva.Node.create(jsonLoad, 'scene-container');
  let layer = stage.findOne('#layer');
  stage.listening(false);

  var width = stage.getAttr('width');
  var height = stage.getAttr('height');

  let bg = stage.findOne('.back-image');
  let bsNumber = bg.getAttr('sound-num') + 1;
  let bgLayer = stage.findOne('#bgLayer');
  var imageObj = new Image();
  if (bg != undefined) {
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
    imageObj.src = bg.getAttr('image-src');
    
  }

  let isPlaying = false;
  document.getElementById('soundOn').addEventListener(
    eve_click,
    function () {
      if (!isPlaying) {
        document.getElementById("bs-"+bsNumber).play();
      } else {
        document.getElementById("bs-"+bsNumber).pause();
      }
      isPlaying = !isPlaying;
    },
    false
  );

  animate();

  function animate() {
    let rotateGroup = layer.find('.rotateGroup');
    let maxAngle = [];
    let theta = [];
    let thetaSign = [];
    let c = [];
    for (let i = 0; i < rotateGroup.length; i++) {
      maxAngle[i] = rotateGroup[i].getAttr('rotation')
      maxAngle[i] > 0 ? thetaSign[i] = -1 : thetaSign[i] = 1;
      theta[i] = Math.abs(maxAngle[i]) / 68;
      c[i] = 0;
      let anim = new Konva.Animation(function (frame) {
        if (maxAngle[i] != -0 || maxAngle[i] != 0) {
          rotateGroup[i].rotate(thetaSign[i] * theta[i]);
          c[i] += Math.abs(theta[i]);
          if (c[i] >= Math.abs(maxAngle[i])) {
            theta[i] *= -1;
            c[i] = 0;
          }
        }
      }, layer);
      anim.start();
    }
  }

  document.getElementById('visibility').addEventListener(
    eve_click,
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
}