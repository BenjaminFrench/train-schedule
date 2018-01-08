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
    let trainArrivalTimes = snapshot.val().trainArrivalTimes;

    var currentTime = moment();
    currentTime = moment(currentTime.format("HH:mm"), "HH:mm");
    var momentTrainFirstTime = moment(trainFirstTime, "HH:mm");

    var trainMinutesAway = null;
    var trainNextArrival = null;
    

    // need to calculate
    for (let index = 0; index < trainArrivalTimes.length; index++) {
        const element = trainArrivalTimes[index];
        let difference = moment(element, "HH:mm").diff(currentTime, "minutes");
        if (difference >= 0) {
            trainNextArrival = moment(element, "HH:mm").format("hh:mm A");
            trainMinutesAway = difference;
            break;
        }
        
    }


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
    let trainArrivalTimes = [];
    // calculate array of train arrival times
    let momentTrainFirstTime = moment(trainFirstTime, "HH:mm");

    trainArrivalTimes.push(trainFirstTime);
    
    // add frequency to time, push time to array, stop if we get to the next day
    while (parseInt(momentTrainFirstTime.add(parseInt(trainFrequency), "m").format("d")) < 1) {
        trainArrivalTimes.push(momentTrainFirstTime.format("HH:mm"));
    }

    ref.push({
        trainName,
        trainDestination,
        trainFirstTime,
        trainFrequency,
        trainArrivalTimes
    });
});