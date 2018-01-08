// Initialize Firebase
var config = {
    apiKey: "AIzaSyBjJYbxHElru4s8Qfxd451Clcar9PnItkc",
    authDomain: "traintracker-cd7f8.firebaseapp.com",
    databaseURL: "https://traintracker-cd7f8.firebaseio.com",
    projectId: "traintracker-cd7f8",
    storageBucket: "traintracker-cd7f8.appspot.com",
    messagingSenderId: "477106688938"
};
firebase.initializeApp(config);

const database = firebase.database();
const ref = database.ref();

// Initial Values
var trainName = "";
var trainDestination = "";
var trainFrequency = 0;
var trainFirstTime = "";


// this fires for each train in the database, AND when a new train is added.
ref.on("child_added", function (snapshot) {
    // Log everything that's coming out of snapshot
    console.log(snapshot.val());

    // save the key for the child so we can add button that can remove it
    let childKey = snapshot.key;

    trainName = snapshot.val().trainName;
    trainDestination = snapshot.val().trainDestination;
    trainFrequency = snapshot.val().trainFrequency;
    trainFirstTime = snapshot.val().trainFirstTime;

    let currentDate = moment();
    let startDate = moment(trainFirstTime, "DD/MM/YYYY");

    // need to calculate
    let trainNextArrival = "5:00 PM";
    let trainMinutesAway = "5";

    let print = `
           <tr id="train-${trainName}">
                <td scope="row">${trainName}</td>
                <td>${trainDestination}</td>
                <td>${trainFrequency}</td>
                <td>${trainNextArrival}</td>
                <td>${trainMinutesAway}</td>
                <td><button id="${childKey}" class="btn btn-primary" class="remove-train-btn">Delete</button></td>
            </tr>`;
    $('#train-table-body').append(print);

    // Event handler for train deletion
    $('#'+childKey).on("click", function() {
        ref.child($(this).attr("id")).remove();
    });

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

// this fires when a train is removed, i.e., user clicked delete button
ref.on("child_removed", function (snapshot) {
    let trainName = snapshot.val().trainName;
    $("#train-"+trainName).remove();
});

$('#add-train-btn').on('click', function (event) {
    event.preventDefault();

    let trainName = $("#TrainName").val().trim();
    let trainDestination = $("#TrainDestination").val().trim();
    let trainFirstTime = $("#TrainFirstTime").val().trim();
    let trainFrequency = $("#TrainFrequency").val().trim();

    ref.push({
        trainName,
        trainDestination,
        trainFirstTime,
        trainFrequency
    });
});