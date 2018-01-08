$(document).ready(function () {

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


    // this fires when a new train is added
    ref.on("child_added", function (snapshot) {
        // Log everything that's coming out of snapshot
        console.log(snapshot.val());
        // Change the HTML to reflect
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
          <tr>
                <td scope="row">${trainName}</td>
                <td>${trainDestination}</td>
                <td>${trainFrequency}</td>
                <td>${trainNextArrival}</td>
                <td>${trainMinutesAway}</td>
            </tr>`;
        $('#train-table-body').append(print);
        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
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
})