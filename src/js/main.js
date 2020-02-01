require("component-responsive-frame/child");
var $ = require('jquery');
var scriptURL = 'https://script.google.com/macros/s/AKfycbzsbIC6oCOwBGlZpHyeiwzQtcNKmnnzvVlgRZKFOWsfCBDdIWE/exec';
var votes = require("../../data/predictions.sheet.json");

var width = $(".entry").width();
var obj = {};
var catObj = {};
var savedPicks = [];
// var userID = (Math.round(Math.random() * 1000000));
// console.log(userID);



function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
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


    formData.append("vote", title);
    formData.append("category", category);
    formData.append("actor", actor);
    // formData.append("usernum", userID);

    showVoteTallies(category);


    var d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = "OscVotesActor="+savedPicks + "; expires=" + d.toGMTString() + ";";
    e.preventDefault();
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message));

    // getCookie("OscVotesActor");
}


$( ".completeEntry" ).click(function(a) {
  var thisEntry = $(this).find('.entry');
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

console.log(catObj);

// for(var cat in catObj) {
//   var catTotal = catObj[cat];
//
// }

function highlightChosenFadeOthers( chosenEntry ){
  // $( chosenEntry ).closest('.catGroup').find('.img img').css("opacity","0.4");
  $( chosenEntry ).closest('.catGroup').find('.knockout').addClass('darken');
  $( chosenEntry ).closest('.catGroup').find(".completeEntry").css("pointer-events","none");
  $( chosenEntry ).closest('.catGroup').find(".crit_pics").show();
  // $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.img img').css('opacity','1');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').addClass('voted');
  $( chosenEntry ).closest('.completeEntry').addClass('voted').find('.knockout').append('<div class="youVote"><i class="fa fa-star" aria-hidden="true"></i>Your Vote</div>');
}


function showVoteTallies(selectedCategory) {
  var catTotal = catObj[selectedCategory];
  $('#nom-holder').find(`*[data-head-category="${ selectedCategory }"]`).prev('.pollHeads').find('.numVotes').append(`${catTotal} votes`);

  for(var propertyName in obj) {
    if( propertyName.includes(selectedCategory) ){
      var value = obj[propertyName];

      console.log( catTotal );
      var percentage = (value / catTotal) * 100;
      var perVotes = Math.round(percentage);


      // I work for the bar chart lines.
      // $('#nom-holder').find(`*[data-id="${ propertyName }"]`).css("background-size",`${percentage}% 100%`);
      $('#nom-holder').find(`*[data-id="${ propertyName }"]`).closest('.completeEntry').find('.perVotes').empty().append(`${perVotes}<span class="percentSign">%</span>`);
    }
  }
}

if (getCookie("OscVotesActor")) {
  var pickedArray = getCookie("OscVotesActor");
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

//(getCookie("OscVotesActor"))

// console.log(obj);
// console.log(catObj);



// // Select all links with hashes
// $('a[href*="#"]')
//   // Remove links that don't actually link to anything
//   .not('[href="#"]')
//   .not('[href="#0"]')
//   .click(function(event) {
//     // On-page links
//     if (
//       location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
//       &&
//       location.hostname == this.hostname
//     ) {
//       // Figure out element to scroll to
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       // Does a scroll target exist?
//       if (target.length) {
//         // Only prevent default if animation is actually gonna happen
//         event.preventDefault();
//         $('html, body').animate({
//           scrollTop: (target.offset().top - 50)
//         }, 1000, function() {
//           // Callback after animation
//           // Must change focus!
//           var $target = $(target);
//           $target.focus();
//           if ($target.is(":focus")) { // Checking if the target was focused
//             return false;
//           } else {
//             $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
//             $target.focus(); // Set focus again
//           };
//         });
//       }
//     }
//   });
