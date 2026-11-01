/* Rejilla adaptativa por encima de 1920px (1rem crece con el ancho) */
(function () {
  var BASE = 16, W = 1920, K = .6666;
  function apply() {
    var w = innerWidth, red = ((W - w) / W) * 100 * K, size = BASE - (BASE * red) / 100;
    if (size > BASE) document.documentElement.style.fontSize = size + "px";
    else document.documentElement.style.removeProperty("font-size");
  }
  apply(); addEventListener("resize", apply);
})();
