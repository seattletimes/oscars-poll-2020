var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycbzsbIC6oCOwBGlZpHyeiwzQtcNKmnnzvVlgRZKFOWsfCBDdIWE/exec';
var votes = require("../../data/predictions.sheet.json");

var total = 0;
var width = $(".entry").width();
const obj = {};

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function submitHandler(e, entry){
    var title = $( entry ).attr( "data-title" );
    var category = $( entry ).attr( "data-category" );
    var formData = new FormData();
    total = total + 1;
    var thisMovie = title + category;

    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    console.log(total);
    console.log(obj);


    formData.append("vote", title);
    formData.append("category", category);

    showVoteTallies(category);


    if (getCookie("asdasd")) {
        console.log("Hi im if");
        $('#nom-holder').append("Looks like you've already voted, come back tomorrow to vote again");
        // init();
        // svgContainer.style.display = "inline-block";
    } else{
        console.log("Hi im else");
        var d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = "vote="+title + "; expires=" + d.toGMTString() + ";";
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: formData })
          .then(response => console.log('Success!', response))
          .catch(error => console.error('Error!', error.message));
        // setTimeout(function() { init(); }, 1000);
        // svgContainer.style.display = "inline-block";
    }
}


$( ".entry" ).click(function(a) {
  var thisEntry = this;
  submitHandler(a, thisEntry);
  // console.log(this);
});



///////////////////////




$.each(votes, function(index, element) {
    total = total + 1;
    var thisMovie = element.vote + element.category;

    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }
});


function showVoteTallies(selectedCategory) {
  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];
      var percentage = (value / total) * 100;
      var perVotes = Math.round(percentage);

      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);
      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).find('.perVotes').append(`${perVotes}%`);
    }
  }
}



console.log(total);
// console.log(width);
console.log(obj);
