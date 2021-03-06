// Initialize Firebase

var config = {
  apiKey: "AIzaSyDZ1e9O_sGyk-zm49GIjZG-miWG-qf8jgI",
  authDomain: "traintime-bbaa9.firebaseapp.com",
  databaseURL: "https://traintime-bbaa9.firebaseio.com",
  projectId: "traintime-bbaa9",
  storageBucket: "",
  messagingSenderId: "1098155042334"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding new train information to table.
$("#addtrain-btn").on("click", function(event) {
  
  event.preventDefault();

  // Grabs new train info input.
  var trainName = $("#train-name-input").val().trim();
  var trainDest = $("#destination-input").val().trim();
  var trainFirstTime = $("#first-train-time-input").val().trim();
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temp" object for holding data.
  var newTrain = {
    name: trainName,
    destination: trainDest,
    first: trainFirstTime,
    frequency: trainFreq
  };

  // Push train data to the database.
  database.ref().push(newTrain);

  // Clears all text boxes in the new train info section.
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-time-input").val("");
  $("#frequency-input").val("");
});

// Add each new train to Firebase and add info to HTML.
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  // Store child info in a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var trainFirstTime = childSnapshot.val().first;
  var trainFreq = childSnapshot.val().frequency;

  var firstTrainConverted = moment(trainFirstTime, "hh:mm").subtract(1, "years");
  console.log(firstTrainConverted);

  var currentTime = moment();
  console.log("Current Time: " + moment(currentTime).format("hh:mm"));

  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("Difference In Time: " + diffTime);

  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  var tMinutesTillTrain = trainFreq - tRemainder;
  console.log("Minutes Till Train: " + tMinutesTillTrain);

  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainTime = moment(nextTrain).format("hh:mm A");
  console.log("Arrival Time: " + nextTrainTime);

  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextTrainTime + "</td><td>" + tMinutesTillTrain + "</td></tr>");

}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

