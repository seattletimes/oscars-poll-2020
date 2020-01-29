var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycbzsbIC6oCOwBGlZpHyeiwzQtcNKmnnzvVlgRZKFOWsfCBDdIWE/exec';
var votes = require("../../data/predictions.sheet.json");

var total = 0;
var width = $(".entry").width();
const obj = {};
var savedPicks = [];

if (getCookie("OscVotes")) {
  var pickedArray = getCookie("OscVotes");
  var pickedSplitArray = pickedArray.split(",");
  // console.log(pickedArray);

  $.each(pickedSplitArray, function(index, element) {
    // showVoteTallies(elementAfterPipe);
    // highlight previously picked entry with elementBeforePipe
  });

} else {
  console.log("Vote with reckless abandon");
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
    return v ? v[2] : null;
}

function submitHandler(e, entry){
    var title = $( entry ).attr( "data-title" );
    var category = $( entry ).attr( "data-category" );
    var thisMovie = $( entry ).attr( "data-id" );
    savedPicks.push(thisMovie + "|" + category);
    console.log(savedPicks);


    var formData = new FormData();
    total = total + 1;


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


    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "OscVotes="+savedPicks + "; expires=" + d.toGMTString() + ";";
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));

    getCookie("OscVotes");
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
  $( `*[data-category="${ selectedCategory }"]` ).addClass("voted").css("opacity","0.6");
  $( `*[data-category="${ selectedCategory }"]` ).find(".entry").css("pointer-events","none");

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



// console.log(total);
// // console.log(width);
// console.log(obj);
