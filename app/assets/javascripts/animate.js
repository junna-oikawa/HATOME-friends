{
  let jsonLoad = document.getElementById('data').value
  let stage = Konva.Node.create(jsonLoad, 'scene-container');
  let layer = stage.findOne('#layer');

  var width = stage.getAttr('width');
  var height = stage.getAttr('height');

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
          if (Math.floor(c[i]) >= Math.floor(Math.abs(maxAngle[i]))) {
            theta[i] *= -1;
            c[i] = 0;
          }
        }
      }, layer);
      anim.start();
    }
  }
}