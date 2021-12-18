{
  let sceneContainer = document.getElementById("index-scene-container");
  let childrenLength = sceneContainer.childElementCount;
  let counter = 0;

  let n = 0;
  while (counter < childrenLength) {
    if (document.getElementById('scene' + n + '-data')) {
      let json = document.getElementById('scene' + n + '-data').value
      let stage = Konva.Node.create(json, 'scene' + n + '-stage');
      counter++;

      stage.scaleX(300 / stage.width());
      stage.scaleY(300 / stage.width());
      stage.width(300);
      stage.height(200);
    }
    n++;
  }
}
