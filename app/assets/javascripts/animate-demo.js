let anim;

document.getElementById('got-it').addEventListener(
  'click',
  function () {
    anim.stop();
    document.getElementById('animation-demo').style.display = 'none';
    document.getElementById('got-it').style.display = 'none';
    document.getElementById('first').style.display = 'block';
    // document.getElementById('guide').style.display = 'block';
    document.getElementById('captionAnimate').style.display = 'block';
    document.getElementById("explain").innerHTML = '<span id="first-pose">はじめのポーズ</span>をきめてね！';
  },
  false
);

let first_json = '{ "attrs": { "id": "characterGroup", "name": "characterGroup3" }, "className": "Group", "children": [{ "attrs": { "x": 255.9999999999999, "y": 252.4999999999999, "radiusX": 102.99999999999984, "radiusY": 83.49999999999984, "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "name": "circle", "id": "shape4", "eyelets": ["eyelet0", "eyelet1", "eyelet2"], "face": false }, "className": "Ellipse" }, { "attrs": { "x": 126.2910356310214, "y": 121.15579255313673, "points": [0, -28.497851164815167, 38.931490662315696, 38.93149066231578, -38.931490662315696, 38.93149066231578], "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "closed": true, "name": "rect", "id": "shape3", "eyelets": ["eyelet3"], "face": false, "rotation": -94.01273097424664, "skewX": -7.216449660063518e-16 }, "className": "Line" }, { "attrs": { "x": 266.56536855087734, "y": 44.951738173653126, "points": [0, -26.97214968101306, 36.84719901777723, 36.84719901777744, -36.84719901777723, 36.84719901777744], "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "closed": true, "name": "rect", "id": "shape2", "eyelets": ["eyelet4"], "face": false, "rotation": 38.364625639139895, "skewX": 2.4424906541753444e-15 }, "className": "Line" }, { "attrs": { "x": 226.70413332080096, "y": 135.47394717766443, "radiusX": 86.71674227265545, "radiusY": 72.79106529575806, "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "name": "circle", "id": "shape0", "eyelets": ["eyelet0", "eyelet3", "eyelet4"], "face": true, "rotation": -29.603234122736083 }, "className": "Ellipse" }, { "attrs": { "x": 228.65411611251693, "y": 140.3570084460161, "offsetX": 100, "offsetY": 100, "id": "face", "rotation": -29.603234122736083 }, "className": "Group", "children": [{ "attrs": { "data": "MM73.59,88.11c-1.02,1.46-2.06,2.96-2.53,4.68c-0.47,1.72-0.26,3.73,0.98,5.01c1.33,1.38,3.56,1.58,5.36,0.93c2.95-1.07,4.95-4.5,4.08-7.51C80.6,88.2,75.61,85.21,73.59,88.11z", "fill": "black", "name": "face", "id": "a" }, "className": "Path" }, { "attrs": { "data": "M120.9,89.9c-1.8,2.17-3.72,4.92-2.79,7.58c0.91,2.6,4.37,3.6,6.93,2.59c2.09-0.82,3.73-2.76,4.06-4.98c0.34-2.22-0.71-4.62-2.62-5.78C124.56,88.14,122.06,88.5,120.9,89.9z", "fill": "black", "name": "face", "id": "a" }, "className": "Path" }, { "attrs": { "data": "M101.24,112.92c-0.71,0.21-1.43,0.19-2.15-0.01c-1.58-0.44-4.4-1.19-5.41-4.07c-0.34-0.98,1.14-2.13,2.47-2.22c1.27-0.08,6.19-0.2,8.07,0.19c1.42,0.3,1.92,1.16,1.72,2.02C105.48,110.93,103.87,112.14,101.24,112.92z", "fill": "black", "name": "face", "id": "a" }, "className": "Path" }] }, { "attrs": { "x": 208.5817974519696, "y": 314.66433544595117, "radiusX": 38.76984812448333, "radiusY": 24.231155077802075, "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "name": "circle", "id": "shape6", "eyelets": ["eyelet1"], "face": false, "rotation": 44.201496981607036 }, "className": "Ellipse" }, { "attrs": { "x": 308.4045538395439, "y": 321.1221538502849, "radiusX": 41.40455383954374, "radiusY": 25.87784614971483, "fill": "#ffc107", "stroke": "black", "strokeWidth": 4, "name": "circle", "id": "shape5", "eyelets": ["eyelet2"], "face": false }, "className": "Ellipse" }, { "attrs": { "x": 255.248046875, "y": 184.63818359375, "radius": 8, "fill": "white", "stroke": "#dab300", "strokeWidth": 4, "name": "eyelet", "id": "eyelet0", "overlappingShapes": ["shape4", "shape0"] }, "className": "Circle" }, { "attrs": { "x": 220.15494880546075, "y": 314.7911262798635, "radius": 8, "fill": "white", "stroke": "#dab300", "strokeWidth": 4, "name": "eyelet", "id": "eyelet1", "overlappingShapes": ["shape4", "shape6"] }, "className": "Circle" }, { "attrs": { "x": 297.28411338167433, "y": 312.318391562294, "radius": 8, "fill": "white", "stroke": "#dab300", "strokeWidth": 4, "name": "eyelet", "id": "eyelet2", "overlappingShapes": ["shape4", "shape5"] }, "className": "Circle" }, { "attrs": { "x": 161.02887653223746, "y": 123.84221884940432, "radius": 8, "fill": "white", "stroke": "#dab300", "strokeWidth": 4, "name": "eyelet", "id": "eyelet3", "overlappingShapes": ["shape3", "shape0"], "rotation": -29.603234122736083 }, "className": "Circle" }, { "attrs": { "x": 247.0467221021161, "y": 71.4329215966434, "radius": 8, "fill": "white", "stroke": "#dab300", "strokeWidth": 4, "name": "eyelet", "id": "eyelet4", "overlappingShapes": ["shape2", "shape0"], "rotation": -25.26817046099091 }, "className": "Circle" }] }';
let second_json = '{"attrs":{"id":"characterGroup","name":"characterGroup3"},"className":"Group","children":[{"attrs":{"x":255.9999999999999,"y":252.4999999999999,"radiusX":102.99999999999984,"radiusY":83.49999999999984,"fill":"#ffc107","stroke":"black","strokeWidth":4,"name":"circle","id":"shape4","eyelets":["eyelet0","eyelet1","eyelet2"],"face":false},"className":"Ellipse"},{"attrs":{"width":600,"height":400,"name":"rotateGroup","x":255.248046875,"y":184.63818359375,"offsetX":255.248046875,"offsetY":184.63818359375,"rotation":62.75436450081052},"className":"Group","children":[{"attrs":{"width":600,"height":400,"name":"rotateGroup","x":161.02887653223746,"y":123.84221884940432,"offsetX":161.02887653223746,"offsetY":123.84221884940432,"rotation":38.639747075744104},"className":"Group","children":[{"attrs":{"x":126.2910356310214,"y":121.15579255313673,"points":[0,-28.497851164815167,38.931490662315696,38.93149066231578,-38.931490662315696,38.93149066231578],"fill":"#ffc107","stroke":"black","strokeWidth":4,"closed":true,"name":"rect","id":"shape3","eyelets":["eyelet3"],"face":false,"rotation":-94.01273097424664,"skewX":-7.216449660063518e-16},"className":"Line"}]},{"attrs":{"width":600,"height":400,"name":"rotateGroup","x":247.0467221021161,"y":71.4329215966434,"offsetX":247.0467221021161,"offsetY":71.4329215966434,"rotation":-36.167057904417184},"className":"Group","children":[{"attrs":{"x":266.56536855087734,"y":44.951738173653126,"points":[0,-26.97214968101306,36.84719901777723,36.84719901777744,-36.84719901777723,36.84719901777744],"fill":"#ffc107","stroke":"black","strokeWidth":4,"closed":true,"name":"rect","id":"shape2","eyelets":["eyelet4"],"face":false,"rotation":38.364625639139895,"skewX":2.4424906541753444e-15},"className":"Line"}]},{"attrs":{"x":226.70413332080096,"y":135.47394717766443,"radiusX":86.71674227265545,"radiusY":72.79106529575806,"fill":"#ffc107","stroke":"black","strokeWidth":4,"name":"circle","id":"shape0","eyelets":["eyelet0","eyelet3","eyelet4"],"face":true,"rotation":-29.603234122736083},"className":"Ellipse"},{"attrs":{"x":228.65411611251693,"y":140.3570084460161,"offsetX":100,"offsetY":100,"id":"face","rotation":-29.603234122736083},"className":"Group","children":[{"attrs":{"data":"MM73.59,88.11c-1.02,1.46-2.06,2.96-2.53,4.68c-0.47,1.72-0.26,3.73,0.98,5.01c1.33,1.38,3.56,1.58,5.36,0.93c2.95-1.07,4.95-4.5,4.08-7.51C80.6,88.2,75.61,85.21,73.59,88.11z","fill":"black","name":"face","id":"a"},"className":"Path"},{"attrs":{"data":"M120.9,89.9c-1.8,2.17-3.72,4.92-2.79,7.58c0.91,2.6,4.37,3.6,6.93,2.59c2.09-0.82,3.73-2.76,4.06-4.98c0.34-2.22-0.71-4.62-2.62-5.78C124.56,88.14,122.06,88.5,120.9,89.9z","fill":"black","name":"face","id":"a"},"className":"Path"},{"attrs":{"data":"M101.24,112.92c-0.71,0.21-1.43,0.19-2.15-0.01c-1.58-0.44-4.4-1.19-5.41-4.07c-0.34-0.98,1.14-2.13,2.47-2.22c1.27-0.08,6.19-0.2,8.07,0.19c1.42,0.3,1.92,1.16,1.72,2.02C105.48,110.93,103.87,112.14,101.24,112.92z","fill":"black","name":"face","id":"a"},"className":"Path"}]},{"attrs":{"x":161.02887653223746,"y":123.84221884940432,"radius":8,"fill":"white","stroke":"#dab300","strokeWidth":4,"name":"eyelet","id":"eyelet3","overlappingShapes":["shape3","shape0"],"rotation":-29.603234122736083},"className":"Circle"},{"attrs":{"x":247.0467221021161,"y":71.4329215966434,"radius":8,"fill":"white","stroke":"#dab300","strokeWidth":4,"name":"eyelet","id":"eyelet4","overlappingShapes":["shape2","shape0"],"rotation":-25.26817046099091},"className":"Circle"}]},{"attrs":{"width":600,"height":400,"name":"rotateGroup","x":220.15494880546075,"y":314.7911262798635,"offsetX":220.15494880546075,"offsetY":314.7911262798635,"rotation":-40.163310476291784},"className":"Group","children":[{"attrs":{"x":208.5817974519696,"y":314.66433544595117,"radiusX":38.76984812448333,"radiusY":24.231155077802075,"fill":"#ffc107","stroke":"black","strokeWidth":4,"name":"circle","id":"shape6","eyelets":["eyelet1"],"face":false,"rotation":44.201496981607036},"className":"Ellipse"}]},{"attrs":{"width":600,"height":400,"name":"rotateGroup","x":297.28411338167433,"y":312.318391562294,"offsetX":297.28411338167433,"offsetY":312.318391562294,"rotation":-47.24940059511429},"className":"Group","children":[{"attrs":{"x":308.4045538395439,"y":321.1221538502849,"radiusX":41.40455383954374,"radiusY":25.87784614971483,"fill":"#ffc107","stroke":"black","strokeWidth":4,"name":"circle","id":"shape5","eyelets":["eyelet2"],"face":false},"className":"Ellipse"}]},{"attrs":{"x":255.248046875,"y":184.63818359375,"radius":8,"fill":"white","stroke":"#dab300","strokeWidth":4,"name":"eyelet","id":"eyelet0","overlappingShapes":["shape4","shape0"]},"className":"Circle"},{"attrs":{"x":220.15494880546075,"y":314.7911262798635,"radius":8,"fill":"white","stroke":"#dab300","strokeWidth":4,"name":"eyelet","id":"eyelet1","overlappingShapes":["shape4","shape6"]},"className":"Circle"},{"attrs":{"x":297.28411338167433,"y":312.318391562294,"radius":8,"fill":"white","stroke":"#dab300","strokeWidth":4,"name":"eyelet","id":"eyelet2","overlappingShapes":["shape4","shape5"]},"className":"Circle"}]}'

let firstChar = Konva.Node.create(first_json);
let secondChar = Konva.Node.create(second_json);
let animationChar = Konva.Node.create(second_json);


var width = window.innerWidth;
var height = 400;

var stageDemo = new Konva.Stage({
  container: 'animation-demo',
  width: width,
  height: height,
  listening: false,
});

var layerDemo = new Konva.Layer();
stageDemo.add(layerDemo);



layerDemo.add(firstChar);
layerDemo.add(secondChar);
layerDemo.add(animationChar);

firstChar.x(- firstChar.getClientRect().x + width / 2 - 400);
firstChar.offsetX(firstChar.getClientRect().width / 2);

secondChar.x(- secondChar.getClientRect().x + width / 2 + 30);
secondChar.offsetX(secondChar.getClientRect().width / 2);

animationChar.x(- animationChar.getClientRect().x + width / 2 + 400 + 30);
animationChar.offsetX(animationChar.getClientRect().width / 2);

let color = ['#f19580', '#54bfad', '#ffde50'];
let text = ['はじめのポーズ', 'おわりのポーズ', 'かんせい']

for (let i = 0; i < 3; i++){
  let background = new Konva.Rect({
    x: width / 2 + 380 * (i-1),
    y: 0,
    width: 310,
    height: 400,
    fill: color[i],
    offsetX: 155,
    cornerRadius: 30,
  });
  layerDemo.add(background);
  background.moveToBottom();

  var simpleText = new Konva.Text({
    x: width / 2 + 380 * (i-1),
    y: 360,
    text: text[i],
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'white',
    fontStyle: 'bold',
  });
  simpleText.offsetX(simpleText.width() / 2);
  layerDemo.add(simpleText);

}



animate();

function animate() {
  let gs = animationChar.find('.rotateGroup');
  let maxAngle = [];
  let theta = [];
  let thetaSign = [];
  let c = [];
  for (let i = 0; i < gs.length; i++){
    maxAngle[i] = gs[i].getAttr('rotation')
    maxAngle[i] > 0 ? thetaSign[i] = -1 : thetaSign[i] = 1;
    theta[i] = Math.abs(maxAngle[i]) / 68;
    c[i] = 0;
    anim = new Konva.Animation(function (frame) {
      // gs[i].rotate(1);
      if (maxAngle[i] != -0||maxAngle[i] != 0) {
        gs[i].rotate(thetaSign[i] * theta[i]);
        c[i] += Math.abs(theta[i]);
        if (c[i] >= Math.abs(maxAngle[i])) {
          theta[i] *= -1;
          c[i] = 0;
        }
      }
    }, layerDemo);
    anim.start();
  }
}



//説明キャラクターについて
// var width = window.innerWidth;
// var height = 400;

// var stageEx = new Konva.Stage({
//   container: 'char-to-explain',
//   width: width,
//   height: height,
//   listening: false,
// });

// var layerEx = new Konva.Layer();
// stageEx.add(layerEx);

// let exChar = Konva.Node.create(first_json);
// layerEx.add(exChar);
// exChar.scaleX(0.5);
// exChar.scaleY(0.5);
// exChar.x(-30);

// // 2つ目に変更
// function changeCharPose() {
//   // document.getElementById("guide-sentence").innerHTML = 'ぼくの<br><span id="second-pose">はじめのポーズ</span><br>はこれ！';
//   exChar.destroy();
//   exChar = Konva.Node.create(second_json);
//   layerEx.add(exChar);
//   exChar.scaleX(0.5);
//   exChar.scaleY(0.5);
//   exChar.x(-30);
// }