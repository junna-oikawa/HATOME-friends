{
  let tar;
  let tarTr;

  function getTarget(target, tr) {
    tar = target;
    tarTr = tr;
    if (tar == tarTr) tar = tarTr.nodes()[0];
  }


  document.getElementById('scaleUp').addEventListener(
    'click',
    function () {
      tar.scaleX(tar.scaleX() + 0.1);
      tar.scaleY(tar.scaleY() + 0.1);
    },
    false
  );

  document.getElementById('scaleDown').addEventListener(
    'click',
    function () {
      tar.scaleX(tar.scaleX() - 0.1);
      tar.scaleY(tar.scaleY() - 0.1);
    },
    false
  );

  document.getElementById('leftRot').addEventListener(
    'click',
    function () {
      tar.rotate(-10);
    },
    false
  );

  document.getElementById('rightRot').addEventListener(
    'click',
    function () {
      tar.rotate(10);
    },
    false
  );

  document.getElementById('destroy').addEventListener(
    'click',
    function () {
      tar.destroy();
      tarTr.nodes([]);
    },
    false
  );

  document.getElementById('toTop').addEventListener(
    'click',
    function () {
      tar.moveToTop();
      tarTr.moveToTop();
    },
    false
  );

  document.getElementById('toBottom').addEventListener(
    'click',
    function () {
      tar.moveToBottom();
      tarTr.moveToTop();
    },
    false
  );

  document.getElementById('up').addEventListener(
    'click',
    function () {
      tar.moveUp();
      tarTr.moveToTop();
    },
    false
  );

  document.getElementById('down').addEventListener(
    'click',
    function () {
      tar.moveDown();
      tarTr.moveToTop();
    },
    false
  );
}