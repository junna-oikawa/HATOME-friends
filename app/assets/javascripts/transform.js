{
  var $document = $(document);
  var supportTouch = 'ontouchend' in document;
  var eve_click = supportTouch ? 'touchend' : 'click';

  let tar;
  let tarTr;

  function getTarget(target, tr) {
    tar = target;
    tarTr = tr;
    if (tar == tarTr) tar = tarTr.nodes()[0];
  }


  document.getElementById('scaleUp').addEventListener(
    eve_click,
    function () {
      tar.scaleX(tar.scaleX() + 0.1);
      tar.scaleY(tar.scaleY() + 0.1);
      document.getElementById("up_sound").currentTime = 0;
      document.getElementById("up_sound").play();
    },
    false
  );

  document.getElementById('scaleDown').addEventListener(
    eve_click,
    function () {
      tar.scaleX(tar.scaleX() - 0.1);
      tar.scaleY(tar.scaleY() - 0.1);
      document.getElementById("down_sound").currentTime = 0;
      document.getElementById("down_sound").play();
    },
    false
  );

  document.getElementById('leftRot').addEventListener(
    eve_click,
    function () {
      tar.rotate(-10);
      document.getElementById("up_sound").currentTime = 0;
      document.getElementById("up_sound").play();
    },
    false
  );

  document.getElementById('rightRot').addEventListener(
    eve_click,
    function () {
      tar.rotate(10);
      document.getElementById("down_sound").currentTime = 0;
      document.getElementById("down_sound").play();
    },
    false
  );

  document.getElementById('destroy').addEventListener(
    eve_click,
    function () {
      tar.destroy();
      tarTr.nodes([]);
      document.getElementById("up_sound").currentTime = 0;
      document.getElementById("up_sound").play();
    },
    false
  );

  document.getElementById('toTop').addEventListener(
    eve_click,
    function () {
      tar.moveToTop();
      tarTr.moveToTop();
      document.getElementById("up_sound").currentTime = 0;
      document.getElementById("up_sound").play();
    },
    false
  );

  document.getElementById('toBottom').addEventListener(
    eve_click,
    function () {
      tar.moveToBottom();
      tarTr.moveToTop();
      document.getElementById("down_sound").currentTime = 0;
      document.getElementById("down_sound").play();
    },
    false
  );

  document.getElementById('up').addEventListener(
    eve_click,
    function () {
      tar.moveUp();
      tarTr.moveToTop();
      document.getElementById("up_sound").currentTime = 0;
      document.getElementById("up_sound").play();
    },
    false
  );

  document.getElementById('down').addEventListener(
    eve_click,
    function () {
      tar.moveDown();
      tarTr.moveToTop();
      document.getElementById("down_sound").currentTime = 0;
      document.getElementById("down_sound").play();
    },
    false
  );

  //左のボタン
  document.getElementById("stageLeftGoUp").onclick = function () {
    let rightContainer = document.getElementById("stageLeft");
    rightContainer.scrollBy({
      top: -rightContainer.clientHeight,
      behavior: 'smooth'
    });
  }
  document.getElementById("stageLeftGoDown").onclick = function () {
    let rightContainer = document.getElementById("stageLeft");
    rightContainer.scrollBy({
      top: rightContainer.clientHeight,
      behavior: 'smooth'
    });
  }

  //右のボタン
  document.getElementById("stageRightGoUp").onclick = function () {
    let leftContainer = document.getElementById("stageRight");
    leftContainer.scrollBy({
      top: -leftContainer.clientHeight,
      behavior: 'smooth'
    });
  }
  document.getElementById("stageRightGoDown").onclick = function () {
    let leftContainer = document.getElementById("stageRight");
    leftContainer.scrollBy({
      top: leftContainer.clientHeight,
      behavior: 'smooth'
    });
  }
}