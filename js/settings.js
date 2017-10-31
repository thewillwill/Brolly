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

//----------------------------------
// Global Variables
//----------------------------------

//this should eventually be made an array of clothing items?

var initialglassesPref = 5;
var initialHatPref = 5;
var initialRainJacketPref = 50;
var initialSweaterPref = 55;
var initialSunscreenPref = 5;
var initialUmbrellaPref = 50;

var clothingObjects = [{ "name": "glasses", "weatherType": "sun", "pref": initialglassesPref },
    { "name": "hat", "weatherType": "sun", "pref": initialHatPref },
    { "name": "rain-jacket", "weatherType": "rain", "pref": initialRainJacketPref },
    { "name": "sweater", "weatherType": "temp", "pref": initialSweaterPref },
    { "name": "sunscreen", "weatherType": "sun", "pref": initialSunscreenPref },
    { "name": "umbrella", "weatherType": "rain", "pref": initialUmbrellaPref }
]

var selectedClothingItems;

//array of all slider elements for selected clothing items
var $allSliders;

var checkMarkImg = "<img src='images/checkmark.svg' class='progress-check'/>"

var headingStep1 = "Click Authorise to Connect Your Google Calendar";
var headingStep2 = "Select Items";
var headingStep3 = "Set Item Preferences";
var headingStep4 = "Set User Alert Preferences";


//----------------------------------
// helper functions
//----------------------------------


function renderStep1() {
    $("#clothing-items-container").empty().text(headingStep1);
    showStepButtons(1);
    $("#authorize-button").show();
    renderProgressBar(1);

    $("#clothing-items-container").empty();
    //show the initial list of clothing items
}

function showStepButtons(stepNumber) {
    $("#step" + stepNumber + "-previous").removeClass("hidden");
    $("#step" + stepNumber + "-next").removeClass("hidden");
};

function hideStepButtons(stepNumber) {
    $("#step" + stepNumber + "-previous").addClass("hidden");
    $("#step" + stepNumber + "-next").addClass("hidden");
};

//Takes in the current step number and formats the progresss bar (text and checkmark icon)
function renderProgressBar(currentStep) {

    // console.log('renderProgressBar', 'currentStep:', currentStep)

    var previousStep = currentStep - 1;
    var nextStep = currentStep + 1;

    //put a checkmark on the previous step
    $("#progress-icon-step" + previousStep).empty().append(checkMarkImg);
    $("#progress-text-step" + previousStep).removeClass("doing").addClass("done");

    //remove the checkmark from the current step -> put a number back
    $("#progress-icon-step" + currentStep).empty().text(currentStep);

    $("#progress-text-step" + currentStep).removeClass("todo").addClass("doing");
    //Change the class of the next step
    $("#progress-text-step" + nextStep).removeClass("doing").addClass("todo");

}

function renderClothingItems() {
    $("#clothing-items-container").empty();
    for (var i = 0; i < clothingObjects.length; i++) {
        var $span = $("<span>").addClass("imgCheckbox1");
        $img = $("<img>").attr({
            "class": "clothing-item",
            "data-item": clothingObjects[i].name,
            "data-weather-type": clothingObjects[i].weatherType,
            "alt": clothingObjects[i].name,
            "id": "item-" + clothingObjects[i].name,
            "src": "images/icons/" + clothingObjects[i].name + ".png"
        });
        $span.append($img);
        $("#clothing-items-container").append($span);
    }
}


function renderSelectedItems() {

    //empty the <div> container
    $("#clothing-items-container").empty();

    var textStart = "Alert me to bring ";
    var $itemID = $("<span>").addClass("item-name");
    var textEnd;

    //go through the items and display them 1 per row on page
    for (var i = 0; i < selectedClothingItems.length; i++) {
        newRow = $("<div>").addClass("row");
        col1 = $("<div>").addClass("col-4").append(selectedClothingItems[i]);
        //select the child element which contains the item data
        var child = selectedClothingItems[i].firstElementChild;
        //get the weather Type data
        var weatherType = $(child).attr("data-weather-type");
        var clothingItem = $(child).attr("data-item");

        // console.log("weatherType", weatherType);

        var $itemControls;

        var $slider = $("<input>").addClass("slider").attr("data-item", clothingItem);
        switch (weatherType) {
            case 'sun':
                textEnd = " when UV index greater than ";
                sunSlider = $slider.attr({ "type": "range", "value": getPref(clothingItem), "max": 10, "id": "uv-slider" + i });
                break;
            case 'temp':
                textEnd = " when temperature less than ";
                tempSlider = $slider.attr({ "type": "range", "min": 30, "value": getPref(clothingItem), "max": 80, "id": "temp-slider" + i });
                break;
            case 'rain':
                // elements for the rain preferences
                textEnd = " when chance of rain greater than ";
                //give each rain slider a unique ID.
                $slider = $slider.attr({ "type": "range", "value": getPref(clothingItem), "id": "rain-slider" + i });
                break;
            default:
                textEnd = " when temperature less than ";
                tempSlider = $slider.attr({ "type": "range", "min": 30, "value": getPref(clothingItem), "max": 80, "id": "temp-slider" + i });

        }

        //set the name of the item in the span.
        $itemID.text($(child).attr("data-item"));
        console.log('$itemID.text', '$(child).attr("...m"):', $itemID.text())

        $itemControls = $("<p>").append(textStart).append($itemID).append(textEnd).append(" ");

        // console.log(selectedClothingItems[i].attr("data-weather-type"));
        var col2 = $("<div>").addClass("col-8").append($("<div>").addClass("row").append($itemControls).append($slider));
        // console.log('itemControls', $itemControls)
        //append the rows to the page

        $("#clothing-items-container").append(newRow.append(col1).append(col2));
    }

    //set up each of the sliders to display correct values
    $allSliders = $(".slider");

    //go through each slider and add styling and set listeners for change to values    
    for (var i = 0; i < $allSliders.length; i++) {
        var sliderID = $allSliders[i].id;
        var sliderIDSet;



        $("#" + sliderID).rangeslider({

            polyfill: false,
            onInit: function() {
                var clothingItem = $(child).attr("data-item");
                if (sliderID.indexOf("rain") != -1) {
                    this.output = $('<div class="range-output" />').insertBefore(this.$range).html(getPref(clothingItem) + "%");

                } else {
                    this.output = $('<div class="range-output" />').insertBefore(this.$range).html(getPref(clothingItem));
                }

            },
            onSlide: function(position, value) {
                //display the new value on the screen
                if (sliderID.indexOf("rain") != -1) {
                    this.output.html(value + "%");
                } else {
                    this.output.html(value);
                }
                updatePref($(this.$element[0]).attr("data-item"), this.$element.val())
            }
        });
    }

}

function updatePref(clothingItem, value) {
    //go through the clothing objects array and update the preference for the matching item
    for (var i = 0; i < clothingObjects.length; i++) {
        if (clothingObjects[i].name.indexOf(clothingItem) != -1) {
            // console.log('clothingObject found at pos: ', i)
            clothingObjects[i].pref = parseInt(value);
        }
    }
}

function getPref(clothingItem) {
    console.log('getPref', 'clothingItem:', clothingItem)
    //go through the clothing objects array and update the preference for the matching item
    for (var i = 0; i < clothingObjects.length; i++) {
        if (clothingObjects[i].name.indexOf(clothingItem) != -1) {
            // console.log('clothingObject found at pos: ', i)
            console.log('return', 'clothingObjects...ref:', clothingObjects[i].pref)
            return clothingObjects[i].pref;
        }
    }
}


//----------------------------------
// on Document Load
//----------------------------------

//wait for the document to load before executing below
$(document).ready(function() {

    //load the step2 elements
    renderProgressBar(1);

    //show the initial list of clothing items
    renderStep1();

    //----------------------------------
    // on click listners
    //----------------------------------


    //listener for clothing icons to add checkmarks
    $(document).on("click", ".imgCheckbox1 img", function() {
        console.log($(this));

        var selected = $(this).parent().hasClass("imgChked");

        //allow the user to select the item and add a check mark
        if (!selected) {
            $(this).parent().addClass("imgChked");
        }
        //unselect the item
        else {
            $(this).parent().removeClass("imgChked");
        }
    });

    $(document).on("click", "#step1-next", function() {

        //hide step1 Buttons
        $("#authorize-button").hide();
        hideStepButtons(1);
        //show step2 Buttons
        showStepButtons(2);
        //change progress bar
        renderProgressBar(2)

        //show the initial list of clothing items
        renderClothingItems();

        //change the subheading
        $("#step-subheading").text(headingStep2);
    });


    $(document).on("click", "#step2-previous", function() {
        //hide step1 Buttons
        hideStepButtons(2);
        //show step1 Buttons
        renderStep1();
    });


    //listen for click on Step 2 next button
    // -> takes user to Step 3
    $(document).on("click", "#step2-next", function() {

        //create an jquery object of selected clothing item elements
        selectedClothingItems = $(".imgCheckbox1.imgChked");
        if (selectedClothingItems.length > 0) {
            //hide warning text if its there
            $("#alert").empty();

            //hide step2 Buttons
            hideStepButtons(2);
            //show step3 Buttons
            showStepButtons(3);
            //change progress bar
            renderProgressBar(3)

            //change the subheading
            $("#step-subheading").text(headingStep3);


            //display the selected items on the page
            renderSelectedItems();
        } else {
            $("#alert").empty().append("Please Select at least one item");
        }



    });

    //listener for click on Step 3 previous button
    // -> takes user to Step 2
    $(document).on("click", "#step3-previous", function() {
        //hide step2 Buttons
        hideStepButtons(3);
        //show step3 Buttons
        showStepButtons(2);
        //change progress bar
        renderProgressBar(2)

        console.log('renderClothingItems');

        //show the initial list of clothing items
        renderClothingItems();

        //change the subheading
        $("#step-subheading").text(headingStep2);

    });


    $(document).on("click", "#step3-next", function() {
        //hide step3 Buttons
        hideStepButtons(3);
        //show step4 Buttons
        showStepButtons(4);
        //change progress bar
        renderProgressBar(4)

        //save the user preferences



        $("#step-subheading").text(headingStep4);

        $("#clothing-items-container").empty().text("Insert Alert Settings. E.g. Receive Alert 2 hours before event (x)");
    });

    $(document).on("click", "#step4-previous", function() {
        //hide step4 Buttons
        hideStepButtons(4);
        //show step3 Buttons
        showStepButtons(3);
        //change progress bar
        renderProgressBar(3)

        //change subheading
        $("#step-subheading").text(headingStep3);

        //show the items the user slected
        renderSelectedItems();

    });

    $(document).on("click", "#step4-next", function() {
        //hide step4 Buttons
        hideStepButtons(4);

        $("#alert").text("Check preferences against todays calendar items and display items required");
    });


});