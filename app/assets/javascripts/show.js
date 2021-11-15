var jsonLoad;

window.onload = function () {
  jsonLoad = document.getElementById('data').value
  // alert(jsonLoad);
  var stage = Konva.Node.create(jsonLoad, 'container');
}
