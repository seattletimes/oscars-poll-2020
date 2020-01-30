var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycbzsbIC6oCOwBGlZpHyeiwzQtcNKmnnzvVlgRZKFOWsfCBDdIWE/exec';
var votes = require("../../data/predictions.sheet.json");

var width = $(".entry").width();
var obj = {};
var catObj = {};
var savedPicks = [];



function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    // console.log(v);
    return v ? v[2] : null;
}

function submitHandler(e, entry){
    var title = $( entry ).attr( "data-title" );
    var category = $( entry ).attr( "data-category" );
    var actor = $( entry ).attr( "data-actor" );
    var thisMovie = $( entry ).attr( "data-id" );
    savedPicks.push(thisMovie + "|" + category);
    // console.log(savedPicks);


    var formData = new FormData();


    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( category ) ) {
      catObj[category] = (catObj[category] + 1);
    } else {
      catObj[category] = 1;
    }

    console.log(catObj);
    console.log(obj);


    formData.append("vote", title);
    formData.append("category", category);
    formData.append("actor", actor);

    showVoteTallies(category);


    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "OscVotes="+savedPicks + "; expires=" + d.toGMTString() + ";";
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));

    // getCookie("OscVotes");
}


$( ".entry" ).click(function(a) {
  var thisEntry = this;
  submitHandler(a, thisEntry);
  highlightChosenFadeOthers(thisEntry);
});





///////////////////////




$.each(votes, function(index, element) {
    // total = total + 1;
    var thisMovie = element.vote + element.category + element.actor;

    if ( obj.hasOwnProperty(thisMovie) ) {
      obj[thisMovie] = (obj[thisMovie] + 1);
    } else {
      obj[thisMovie] = 1;
    }

    if ( catObj.hasOwnProperty( element.category ) ) {
      catObj[element.category] = (catObj[element.category] + 1);
    } else {
      catObj[element.category] = 1;
    }
});

function highlightChosenFadeOthers( chosenEntry ){
  $( chosenEntry ).closest('.catGroup').find('.completeEntry').css("opacity","0.6");
  $( chosenEntry ).closest('.catGroup').find(".entry").css("pointer-events","none");
  $( chosenEntry ).closest('.completeEntry').addClass('voted').css('opacity','1');
}


function showVoteTallies(selectedCategory) {
  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];
      var catTotal = catObj[selectedCategory];
      // console.log(catTotal);
      var percentage = (value / catTotal) * 100;
      var perVotes = Math.round(percentage);

      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);
      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).find('.perVotes').append(`${perVotes}%`);
    }
  }
}

if (getCookie("asdasd")) {
  var pickedArray = getCookie("OscVotes");
  savedPicks.push(pickedArray);
  var pickedSplitArray = pickedArray.split(",");
  // console.log(savedPicks);

  $.each(pickedSplitArray, function(index, element) {
    var movAndCat = element.split("|");
    // console.log(movAndCat);
    showVoteTallies(movAndCat[1]);
    highlightChosenFadeOthers( $(`*[data-id="${ movAndCat[0] }"]`)  );
  });

} else {
  console.log("Vote with reckless abandon");
}

//(getCookie("OscVotes"))

console.log(obj);
console.log(catObj);
