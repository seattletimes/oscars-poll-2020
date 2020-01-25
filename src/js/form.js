//TODO: update the endpoint
var endpoint = "https://script.google.com/macros/s/AKfycbxFy5FcTr36Hf2Lug_yAdC_NZYeVSbxnmlqUepVRVAJcUYuRKGj/exec";

var ajax = require("./jsonp");
var formUtil = require("./form-utils");
var cookie = require("./cookies");
var placeUser = require("./graph");

// var panel = document.querySelector(".form-panel");
var container = document.querySelector(".nom-Holder");
//
// var message = panel.querySelector(".message");
var form = panel.querySelector(".entry");

var storageKey = `oscar-noms-2020`;

//do not show form if it has been submitted before
if (cookie.read(storageKey)) {
  container.classList.add("already-sent");
}

var packet = formUtil.package(form);

var stored = localStorage.getItem(storageKey);
if (stored) {
  console.log("I've already been stored");
  placeUser(stored);
}

form.addEventListener("click", function(e) {
  e.preventDefault();
  var self = this;
  if (self.disabled) return;


  self.disabled = true;

  var submission = ajax(endpoint, packet, function(data) {

    cookie.write(storageKey, true);
    var stored = packet.home + "-" + packet.opposing;
    localStorage.setItem(storageKey, stored);
    placeUser(stored);
  });

});

window.clearSent = function() {
  cookie.clear(storageKey);
  localStorage.removeItem(storageKey);
};
