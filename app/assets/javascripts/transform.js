let tarStage;
let tarLayer;
let tar;
let tarTr;

function getVariable(stage, layer) {
  tarStage = stage;
  tarLayer = layer;
  console.log(tarLayer)
}

// function getShapes(shapes) {
  
// }

function getTarget(target, tr) {
  tar = target;
  tarTr = tr;
}

function scaleUp() {
  if (tar == tarTr) tar = tarTr.nodes()[0];
  tar.scaleX(tar.scaleX() + 0.1);
  tar.scaleY(tar.scaleY() + 0.1);
  console.log(tar);
}

document.getElementById('scaleUp').addEventListener(
  'click',
  function () {
    scaleUp();
  },
  false
);

document.getElementById('scaleDown').addEventListener(
  'click',
  function () {
  },
  false
);

document.getElementById('toTop').addEventListener(
  'click',
  function () {
    // selectedShape.moveToTop();
    // tr.moveToTop();
  },
  false
);

document.getElementById('toBottom').addEventListener(
  'click',
  function () {
    // selectedShape.moveToBottom();
  },
  false
);

document.getElementById('up').addEventListener(
  'click',
  function () {
    // selectedShape.moveUp();
  },
  false
);

document.getElementById('down').addEventListener(
  'click',
  function () {
    // selectedShape.moveDown();
  },
  false
);