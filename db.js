//FIREBASE FUNCITONALITY HAS BEEN REMOVED BECAUSE I DONT WANNA DEAL WITH IT >:( all the data comes from data.json now
//This is now a fully static site, and presumably data should be updated through git version control, just update data.json as needed
//link to website to generate a new data.json here: [put link here once site made]

//this gets the data from data.json and spits it into the html files as requested
//if category is 'leaders', then it will pull leader names and sort them, and if its 'events', it will create calendar cards in createNewCalendarCard()
function get(category){

    //TESTS FOR checkIfDatePassed()
    /*
    //5th dec 2023 - false
    console.log(checkIfDatePassed(5, 12, 2023));
    //5th nov 2022 - true
    console.log(checkIfDatePassed(5, 11, 2023));
    //16th nov 2022 - false
    console.log(checkIfDatePassed(16, 11, 2023));
    //5th dec 2024 - false
    console.log(checkIfDatePassed(5, 12, 2024));
    //5th sept 2023 - true
    console.log(checkIfDatePassed(5, 9, 2023));
    */
    fetch("../data.json")
    .then((response) => response.json())
    .then(data => {
        const jsonData = data; // Assign the JSON data to a constant
        console.log(jsonData)
        //create the calendar cards
        if(category == "events"){
            Object.entries(jsonData.events).forEach(([key, value]) => {
                console.log(value.day, value.month, value.year)

                createNewCalendarCard(value.name, value.month, value.day, value.year, value.description, value.location, value.address, checkIfDatePassed(value.day, value.month, value.year));
            });
            //depending on leader position create new text box
        } else if(category == "leaders"){
            Object.entries(jsonData.leaders).forEach(([key, value]) => {
                var elementIdToGet = value.position;
                var newLeaderListItem = document.createElement("li")
                newLeaderListItem.className = "list-group-item text-bg-dark"
                newLeaderListItem.innerHTML = value.name;
                document.getElementById(elementIdToGet).appendChild(newLeaderListItem)
            });
        } else {
            //thank sai for this stuff below :)
            throw { 
                name:        "Invalid Category", 
                level:       "AMONGUS level threat!!11!!1", 
                message:     "Please use a valid category, either 'events' or 'leaders pretty please UwU", 
                htmlMessage: "there has been an error! please fixxy!11!1!??1",
                toString:    function(){return this.name + ": " + this.message;} 
              }; 
        }

        console.log(jsonData.leaders); // Do something with the JSON data
        Object.entries(jsonData.leaders).forEach(([key, value]) => {
            console.log(`${value.name}: ${value.position}`);
        });
    })
    .catch(error => {
        console.error('Error fetching JSON file. Msg:', error);
    });

}



//creates the actual html bootstrap cards and puts it in calendar.html, used by get()
//name, description, location and address are strings
//month, day, and year are numbers
//datePassed is a boolean
function createNewCalendarCard(name, month, day, year, description, location, address, datePassed){
    //create the outermost div that contains the card
    var outerDiv = document.createElement("div")
    if(datePassed) outerDiv.className = "card text-center border-secondary text-bg-dark mb-3";
    else outerDiv.className = "card text-center border-light text-bg-dark mb-3";
    outerDiv.style = "margin-left: 5em; margin-right: 5em; color: red;"
    document.getElementById("calendarrow").appendChild(outerDiv);

    //create the card header that shows the date
    var header = document.createElement("div");
    header.className = "card-header";
    if(datePassed) header.style = "color: gray;";
    var thingToAdd = datePassed ? " (Completed)" : ""; 
    header.innerHTML = numberToMonth(month)+" "+day+", "+year+ thingToAdd;
    outerDiv.appendChild(header);

    //create the div that holds the remaining text in the card
    var textDiv = document.createElement("div");
    textDiv.className = "card-body";
    outerDiv.appendChild(textDiv);

    //create the card title that shows the event name
    var title = document.createElement("h5");
    title.innerHTML = name;
    if(datePassed) title.style = "color: gray;";
    textDiv.appendChild(title);

    //create the body text that holds the event description
    var descriptionText = document.createElement("p");
    descriptionText.innerHTML = description;
    if(datePassed) descriptionText.style = "color: gray;";
    textDiv.appendChild(descriptionText);

    //create the body text that hold the location data
    var locationData = document.createElement("p");
    if(datePassed) locationData.style = "color: gray;";
    locationData.innerHTML = '<b>'+location+'</b>'+": "+address;
    textDiv.appendChild(locationData);
}

//simple function to convert the numerical month in the database to a human-readable name
function numberToMonth(number){
    var returnString = ""
    switch(number){
        case 1:
            returnString = "January"; break;
        case 2:
            returnString = "February"; break;
        case 3:
            returnString = "March"; break;
        case 4:
            returnString = "April"; break;
        case 5:
            returnString = "May"; break;
        case 6:
            returnString = "June"; break;
        case 7:
            returnString = "July"; break;
        case 8:
            returnString = "August"; break;
        case 9:
            returnString = "September"; break;
        case 10:
            returnString = "October"; break;
        case 11:
            returnString = "November"; break;
        case 12: 
            returnString = "December"; break;
        default:
            returnString = "InvalidMonth"; throw "Invalid month entered, please use an integer value between 1 and 12, inclusive"; break;
    }

    return returnString;
}

function checkIfDatePassed(day, month, year){
    if(year < 0){
        console.error("The year for an event is invalid.")
    }
    if(!verifyDate(day, month)){
        console.error("The date and month combination is invalid")
    }
    //turns the event in question into a date object
    var eventData = new Date(year, month-1, day);
    //creates a date object with the current date
    var currentData = new Date();

    if(eventData.valueOf() > currentData.valueOf()){
        return false;
    }
    return true;

}

//checks date and month combinations to make sure that they are valid
//good luck trying to figure out how without these comments
function verifyDate(day, month){
    //check if the day and month are positive values
    if(day < 0 || month < 0){
        return false;
    }
    //check if the months dont go higher than december
    if(month > 12){
        return false;
    }
    //checks for date violations in 31-day months
    if(
       month == 1  ||
       month == 3  ||
       month == 5  ||
       month == 7  ||
       month == 8  ||
       month == 10 ||
       month == 12
    ){
        if(day > 31)return false
    } 
    //checks for violations in february
    else if (month ==2){
        if(day>28) return false;
    }
    //checks for violations in 30-day months
    else {
        if (day > 30) return false;
    }

    //if it hasnt been returned yet, its probably a valid date and month combination
    return true;
}