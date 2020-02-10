$(document).ready(function(){
    var firebaseConfig = {
        apiKey: "AIzaSyAIy5XAZFefBMd-AsgaXd2Y5OOjfRdcRAU",
        authDomain: "train-schedule-890ce.firebaseapp.com",
        databaseURL: "https://train-schedule-890ce.firebaseio.com",
        projectId: "train-schedule-890ce",
        storageBucket: "train-schedule-890ce.appspot.com",
        messagingSenderId: "646938678096",
        appId: "1:646938678096:web:66ec56c4e6ee78fb96d255"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // Variable to reference firebase database
    var database = firebase.database();
    // Initialize onClick event variables
    var name;
    var destination;
    var firstTrain;
    var frequency;
    // onClick function for submit button
    $("#add-train").on("click", function(){
        event.preventDefault();
        // Grab new train data
        name = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();
        // Push to database
        database.ref().push({
            name: name,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // Clear form input
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
        // Prevent page from refreshing
        //return false;
    });
    // Calculate column information and append train information to schedule
    database.ref().on(
        "child_added",
        function(childSnapshot){
            var sv = childSnapshot.val();
            var minAway;
            var firstTrainTime = moment(sv.firstTrain, "hh:mm A").subtract(1, "years");
            // Difference between current train and first train
            var timeDiff = moment().diff(moment(firstTrainTime), "minutes");
            var remain = timeDiff % sv.frequency;
            // Minutes left until next train arrives
            var minAway = sv.frequency - remain;
            // Next train time
            var nextTime = moment().add(minAway, "minutes");
            // Format time to be hh:mm
            nextTime = moment(nextTime).format("hh:mm A");
            // Append input train information to schedule
            $("#add-row").append("<tr><td id='name-display'>" + sv.name +
            "</td><td id='destination-display'>" + sv.destination +
            "</td><td id='frequency-display'>" + sv.frequency +
            "</td><td id='next-arrival-display'>" + nextTime +
            "</td><td id='minutes-away-display'>" + minAway + "</td></tr>");
        },
        function(errorObject){ // Console log handled errors
        console.log("Errors: " + errorObject.code);
    });
});