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

var clothingObjects = [{ "name": "glasses", "weatherType": "sun" },
    { "name": "hat", "weatherType": "sun" },
    { "name": "rain-jacket", "weatherType": "rain" },
    { "name": "sweater", "weatherType": "temp" },
    { "name": "sunscreen", "weatherType": "sun" },
    { "name": "umbrella", "weatherType": "rain" }
]

var clothingItems = ["glasses", "hat", "jacket", "sweater", "sunscreen", "umbrella"];
//"<span class='imgCheckbox1'><img src='images/icons/glasses.png' alt='glasses' data-item='glasses' id='item-glasses' class='clothing-item'></span><span class='imgCheckbox1'><img src='images/icons/hat.png' alt='hat' data-item='hat' id='item-hat' class='clothing-item'></span><span class='imgCheckbox1'><img src='images/icons/jacket.png' alt='jacket' data-item='jacket' id='item-jacket' class='clothing-item'></span><span class='imgCheckbox1'><img src='images/icons/sweater.png' alt='sweater' data-item='sweater' id='item-sweater' class='clothing-item'></span><span class='imgCheckbox1'><img src='images/icons/sunscreen.png' alt='sunscreen' data-item='sunscreen' id='item-sunscreen' class='clothing-item'></span><span class='imgCheckbox1'><img src='images/icons/umbrella.png' alt='umbrella' data-item='umbrella' id='item-umbrella' class='clothing-item'></span>";
var selectedClothingItems;

var $checkMarkImg = $("img").attr({
    "class": "progress-check",
    "src": "images/checkmark.svg"
});

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

    console.log('renderProgressBar', 'currentStep:', currentStep)

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

    var slider = "<input type='range' min='1' max='100' value='50' class='slider' id='myRange'>";
    var $rainSlider = $("input").attr({
        "type": "range",
        "min": "1",
        "max": "100",
        "value": "50",
        "class": "slider",
        "id": "rainChance"
    });

    //empty the <div> container
    $("#clothing-items-container").empty();

    //go through the items and display them 1 per row on page
    for (var i = 0; i < selectedClothingItems.length; i++) {
        newRow = $("<div>").addClass("row");
        firstCol = $("<div>").addClass("col-4").append(selectedClothingItems[i]);

        //select the child element which contains the item data
        var child = selectedClothingItems[i].firstElementChild;
        //get the weather Type data
        var weatherType = $(child).attr("data-weather-type");

        var secondCol;
        var secondColText;

        console.log("weatherType", weatherType);
        var itemControls;

        switch (weatherType) {
            case 'sun':
                // itemControls = renderItemControls("sun");
                break;
            case 'temp':
                // itemControls = renderItemControls("temp");
                break;
            case 'rain':
                itemControls =  $('input[type="range"]').rangeslider();
                break;
            default:
                // itemControls = renderItemControls("temp");
        }
        // console.log(selectedClothingItems[i].attr("data-weather-type"));
        secondCol = $("<div>").addClass("col-8").append(itemControls);
        console.log('itemControls', itemControls)
        //append the rows to the page
        $("#clothing-items-container").append(newRow.append(firstCol).append(secondCol));
    }



    // $("#clothing-items-container").empty();
    // for (var i = 0; i < selectedClothingItems.length; i++) {
    //     newRow = $("<div>").addClass("row");
    //     firstCol = $("<div>").addClass("col-4").append(selectedClothingItems[i]);
    //     secondCol = $("<div>").addClass("col-8").text("sample user preferences go here");
    //     $("#clothing-items-container").append(newRow.append(firstCol).append(secondCol));
    // }
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

    console.log($('input[type="range"]').rangeslider());

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
        $("#google-auth").hide();
        hideStepButtons(1);
        //show step2 Buttons
        showStepButtons(2);
        //change progress bar
        renderProgressBar(2)

        console.log('renderClothingItems');

        //show the initial list of clothing items
        renderClothingItems();

        //change the subheading
        $("#step-subheading").text(headingStep2);
    });


    $(document).on("click", "#step2-previous", function() {
        //hide step1 Buttons
        hideStepButtons(2);
        //show step1 Buttons
        showStepButtons(1);
        $("#google-auth").show();
        renderProgressBar(1);

        $("#clothing-items-container").empty();
        //show the initial list of clothing items
        renderStep1();
    });


    //listen for click on Step 2 next button
    // -> takes user to Step 3
    $(document).on("click", "#step2-next", function() {
        //hide step2 Buttons
        hideStepButtons(2);
        //show step3 Buttons
        showStepButtons(3);
        //change progress bar
        renderProgressBar(3)

        //change the subheading
        $("#step-subheading").text(headingStep3);

        //create an jquery object of selected clothing item elements
        selectedClothingItems = $(".imgCheckbox1.imgChked");
        //display the selected items on the page
        renderSelectedItems();

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

        $("#step-subheading").text(headingStep4);

        $("#clothing-items-container").empty().text("Insert Alert Settings here");
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


        //change progress bar
        //change step3
        //append a 3 instead of the check mark
        $("#progress-icon-step3").empty().append("3");;
        $("#progress-text-step3").removeClass("doing").addClass("todo");
        //change step3
        $("#progress-icon-step3").empty().append("3")
        $("#progress-text-step3").removeClass("done").addClass("doing");

        //show the items the user slected
        renderSelectedItems();

    });

    $(document).on("click", "#step4-Next", function() {
        alert("don't click me, I don't do anything yet");
    });


});