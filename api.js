console.log("hello");
// Client ID and API key from the Developer Console
var CLIENT_ID = '1027881161846-37hl8uvkg7d389d0dj4a86m0iuskimpc.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}


/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': '8fu4c92egkfud0c16574n09h2c@group.calendar.google.com',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 50,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    appendPre('Upcoming events:');
    makeEventObject(events);
        
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + ' (' + when + ')')
      }
    } else {
      appendPre('No upcoming events found.');
    }
  });
}


//--------------------------------------
// Create Local Variables
//--------------------------------------

//Create array of objects containing event info from google calendar. 
var eventCalendarList = [];
var counter = 0;
var eventWeatherList =[];

//Function that will get info from google calendar then send that info to dark sky.
function makeEventObject(events) {
    
   var email;
   var address;
   var startTime;
   var endTime;
   var description;
   var brollyEvent;

  for(var i = 0; i < events.length; i++) {
     
    // create variables that will go into our object.
    email = events[i].creator.email;
    address = events[i].location;
    description = events[i].summary;
    brollyEvent = events[i].description;

    startDateTime = moment(events[i].start.dateTime).format("DD:MM:YYYY hh:mm");
    startDate = startDateTime.split(" ")[0];
    startTime = startDateTime.split(" ")[1];
    startTimeIndex = startTime.split(":")[0];
    if (startTimeIndex[0] == 0) {
      startTimeIndex = startTimeIndex[1];
    };

    endDateTime = moment(events[i].end.dateTime).format("DD:MM:YYYY hh:mm");
    endDate = endDateTime.split(" ")[0];
    endTime = endDateTime.split(" ")[1];
    endTimeIndex = endTime.split(":")[0];

     var calendarEventObject = {};

     // Fill our object with previous variables created
     calendarEventObject.email = email;
     calendarEventObject.location = address;
     calendarEventObject.startTime = startTime;
     calendarEventObject.startDate = startDate;
     calendarEventObject.endTime = endTime;
     calendarEventObject.endDate = endDate;
     calendarEventObject.startTimeIndex = startTimeIndex;
     calendarEventObject.endTimeIndex = endTimeIndex;


     // Put our objects into the array
     eventCalendarList.push(calendarEventObject);


     // Create an event #Brolly for important events. 
     if(brollyEvent === "#Brolly" ) {

       calendarEventObject["Event"] = brollyEvent;

       eventCalendarList.push(calendarEventObject);

      }   
    getLatLong(address);
    
    }
    return eventCalendarList;
}

function getLatLong(address){
  query = address;

  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': query }, function(results, status) {
      addresses = {};
      $.each(results, function(index, value){
        var cordinates ={"lat":value.geometry.location.lat(),"lng":value.geometry.location.lng()};
        var lt = cordinates.lat;
        var lng = cordinates.lng;
        getWeatherData(lt, lng);
      })
  });
}

function getWeatherData(lt, lng) {
  // Dark Sky.....
    var APIKey = "1eafa61017eb7332bc3c46235ce8e800";
    var lat = lt;
    var long = lng;
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.darksky.net/forecast/" + APIKey + "/" + lat + "," + long;
    // Here we run our AJAX call to the dark sky API
    $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "jsonp"
        })
        // We store all of the retrieved data inside of an object called "response"
        .done(function(response) {

          counter ++;

          // Log the queryURL
          // console.log(queryURL);

          var hourlyData = response.hourly.data;
          var currentEvent = eventCalendarList[counter];
          var index = currentEvent.startTimeIndex;
          var appTemp = (hourlyData[index].apparentTemperature);
          var precProb = (hourlyData[index].precipProbability);
          var precInt = (hourlyData[index].precipIntensity);
          var uvIndex = (hourlyData[index].uvIndex);
          var cloudCover = (hourlyData[index].cloudCover);

          var weatherObject = {};

          weatherObject.userName = currentEvent.email;
          weatherObject.location = currentEvent.location;
          weatherObject.startTime = currentEvent.startTime;
          weatherObject.startDate = currentEvent.startDate;
          weatherObject.appTemp = appTemp;
          weatherObject.precProb = precProb;
          weatherObject.precInt = precInt;
          weatherObject.uvIndex = uvIndex;
          weatherObject.cloudCover = cloudCover;


          eventWeatherList.push(weatherObject);

    });
  return eventWeatherList;      
}
console.log(eventWeatherList);