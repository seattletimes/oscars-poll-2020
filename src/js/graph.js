var $ = require("./lib/qsa");
var dot = require("./lib/dot");
var template = dot.compile(require("./_dot.html"));

module.exports = function(score) {
  var match = document.querySelector(`.point-container[data-score="${score}"]`);
  if (match) {
    match.classList.add("user");
  } else {
    var [a, b] = score.split("-").map(Number);
    if (a > b) {
      var team = "home";
      var title = window.teams.home;
      var winner = a;
      var loser = b;
    } else {
      var team = "opposing";
      var title = window.teams.opposing;
      var winner = b;
      var loser = a;
    }

    var html = template({
      a, b,
      team: team,
      title: title,
      x: a / window.maxScore * 100,
      y: b / window.maxScore * 100,
      opacity: 1,
      count: 1,
      fade: "high",
      winner: winner,
      loser: loser,
      user: "user"
    });

    document.querySelector(".scatterplot").innerHTML += html;
  }
};