module.exports = function(url, data = {}, fn) {
  data.callback = "_jsonp" + Date.now();
  var params = Object.keys(data).map(k => [k, data[k]].join("=")).join("&");
  console.log(url, url.indexOf("?"));
  url = url + (url.indexOf("?") > -1 ? "&" : "?") + params;
  var script = document.createElement("script");
  script.src = url;
  window[data.callback] = function() {
    fn.apply(null, arguments);
    delete window[data.callback];
    document.body.removeChild(script);
  };
  document.body.appendChild(script);
};