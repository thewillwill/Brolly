// Initialize Firebase
var config = {
    apiKey: "AIzaSyDKNyh69deziNpJxi-XRro_OmuImyFj154",
    authDomain: "brolly-184217.firebaseapp.com",
    databaseURL: "https://brolly-184217.firebaseio.com",
    projectId: "brolly-184217",
    storageBucket: "brolly-184217.appspot.com",
    messagingSenderId: "240354309598"
};
firebase.initializeApp(config);

//this should eventually be made an array of clothing items?
var clothingItems = "<span class='imgCheckbox1 '><img src='icons/glasses.png' alt='glasses' data-item='glasses' id='item-glasses' class='clothing-item'></span><span class='imgCheckbox1'><img src='icons/hat.png' alt='hat' data-item='hat' id='item-hat' class='clothing-item'></span><span class='imgCheckbox1'><img src='icons/jacket.png' alt='jacket' data-item='jacket' id='item-jacket' class='clothing-item'></span><span class='imgCheckbox1'><img src='icons/sweater.png' alt='sweater' data-item='sweater' id='item-sweater' class='clothing-item'></span><span class='imgCheckbox1'><img src='icons/sunscreen.png' alt='sunscreen' data-item='sunscreen' id='item-sunscreen' class='clothing-item'></span><span class='imgCheckbox1'><img src='icons/umbrella.png' alt='umbrella' data-item='umbrella' id='item-umbrella' class='clothing-item'></span>";
var selectedClothingItems;

var checkMarkImg = "<img src='checkmark.svg' class='progress-check'/>";

$(document).ready(function() {

$("#progress-text-step1").removeClass("doing").addClass("done");    
$("#progress-text-step2").removeClass("todo").addClass("doing");

$(document).on("click",".imgCheckbox1 img", function() {
    console.log($(this));

    var selected = $(this).parent().hasClass("imgChked");
    console.log("selected", selected);
    //allow the user to unselect the item
    if (!selected) {
        $(this).parent().addClass("imgChked");
    }
    //if the item has not been selected allow the user to select it
    else {
        console.log('L26');
        $(this).parent().removeClass("imgChked");
    }
});


$(document).on("click","#step2-previous", function() {
    alert("don't click me, I don't do anything yet");
});


$(document).on("click","#step2-next", function() {
    //hide step2 Buttons
    $("#step2-previous").addClass("hidden");
    $("#step2-next").addClass("hidden");

    //show step3 Buttons
    $("#step3-previous").removeClass("hidden");
    $("#step3-next").removeClass("hidden");

    //change progress bar
    //change step2
    $("#progress-icon-step2").empty().append(checkMarkImg);
    $("#progress-text-step2").removeClass("doing").addClass("done");
    //change step3
    $("#progress-text-step3").removeClass("todo").addClass("doing");

    //change the subheading
    $("#step-subheading").text("Set Item Preferences");

    //create an jquery object of selected clothing item elements
    selectedClothingItems = $(".imgCheckbox1.imgChked");
    
    //empty the <div> container
    $("#clothing-items-container").empty();

    //go through the items and display them 1 per row on page
    for (var i = 0; i < selectedClothingItems.length; i++) {
        newRow = $("<div>").addClass("row");
        firstCol = $("<div>").addClass("col-4").append(selectedClothingItems[i]);

        //this is where the preferences for the item will go
        secondCol = $("<div>").addClass("col-8").text("sample user preferences go here");

        //append the rows to the page
        $("#clothing-items-container").append(newRow.append(firstCol).append(secondCol));
    }

});

$(document).on("click","#step3-previous", function() {
    //hide step3 Buttons
    $("#step2-previous").removeClass("hidden");
    $("#step2-next").removeClass("hidden");

    // show step3 Buttons
    $("#step3-previous").addClass("hidden");
    $("#step3-next").addClass("hidden");
    $("#clothing-items-container").html(clothingItems);

    //change the subheading
    $("#step-subheading").text("Select Items");

    //change progress bar
    //change step2
    //append a 2 instead of the check mark
    $("#progress-icon-step2").empty().append("2");;
    $("#progress-text-step2").removeClass("done").addClass("doing");
    //change step3
    $("#progress-icon-step3").empty().append("3")
    $("#progress-text-step3").removeClass("doing").addClass("todo");


});


$(document).on("click","#step3-next", function() {

    //change progress bar
    //change step3
    $("#progress-icon-step3").empty().append(checkMarkImg);
    $("#progress-text-step3").removeClass("doing").addClass("done");

    //update progress bar
    $("#progress-text-step3").removeClass("doing").addClass("done");
    
    //hide step3 Buttons
    $("#step3-next").addClass("hidden");
    $("#step3-previous").addClass("hidden");

    //change the subheading
    $("#step-subheading").text("Set User Alert Preferences");

    //show step4 Buttons
    $("#step4-previous").removeClass("hidden");
    $("#step4-next").removeClass("hidden");
    $("#clothing-items-container").empty().text("Insert Alert Settings here");
});

$(document).on("click","#step4-previous", function() {
    //hide step4 Buttons
    $("#step4-previous").addClass("hidden");
    $("#step4-next").addClass("hidden");

    // show step3 Buttons
    $("#step3-previous").removeClass("hidden");
    $("#step3-next").removeClass("hidden");
    $("#clothing-items-container").html(clothingItems);

    //change subheading
    $("#step-subheading").text("Set Item Preferences");


    //change progress bar
    //change step3
    //append a 3 instead of the check mark
    $("#progress-icon-step3").empty().append("3");;
    $("#progress-text-step3").removeClass("doing").addClass("todo");
    //change step3
    $("#progress-icon-step3").empty().append("3")
    $("#progress-text-step3").removeClass("done").addClass("doing");

    //show the items the user slected
    $("#clothing-items-container").empty();
    for (var i = 0; i < selectedClothingItems.length; i++) {
        newRow = $("<div>").addClass("row");
        firstCol = $("<div>").addClass("col-4").append(selectedClothingItems[i]);
        secondCol = $("<div>").addClass("col-8").text("sample user preferences go here");
        $("#clothing-items-container").append(newRow.append(firstCol).append(secondCol));
    }
});

$(document).on("click","#step4-Next", function() {
    alert("don't click me, I don't do anything yet");
});


});