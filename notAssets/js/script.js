// Get and display the current date and time
let currDateTime = setDateTime();

// Maintain the date and time every second...just for practice
setInterval(setDateTime, 1000);

// populate the hourly calendar rows
createHourRows();

// highlight the rows based on the current time.
highlightHours(Number(currDateTime.format("H")));

// listen for changes to the textareas
$(".row-text").on("input", changeTextArea);

// listen for button clicks to save textarea changes
$(".saveBtn").on("click", saveBtnClicked);

// set the screen's "currentDay" field and return the current moment()
function setDateTime() {

    let dateElement = $("#currentDay");
    let outputDate = moment();

    dateElement.html(outputDate.format("ddd, MMM DD YYYY"));

    return outputDate;
}

// Create the rows for the calendar
function createHourRows() {
    hourParent = $("#time-blocks");

    // must have 0 <= hourMin <= hourMax <= 24
    const hourMin = 9;
    const hourMax = 17;

    let hourIndex = hourMin;

    while (hourIndex <= hourMax) {
        hourText = ((hourIndex < 10) ? "0" + hourIndex : ((hourIndex < 13) ? hourIndex : ((hourIndex < 22) ? "0" + (hourIndex - 12) : hourIndex - 12)));
        ampmText = ((hourIndex >= 12) ? "pm" : "am");
        hourParent.append(`<div class='row' id='div-${hourText}-${ampmText}'>
              <span class='hour col-2 col-md-1'>${((hourIndex > 12) ? hourIndex - 12 : hourIndex)}${ampmText.toUpperCase()}</span>
              <textarea class = 'col-7 col-md-9 col-lg-10 row-text' id='textarea-${hourText}-${ampmText}'>${getLocalStorage(currDateTime.format("MMDDYYYY"),`textarea-${hourText}-${ampmText}`)}</textarea>
              <button class='saveBtn col-3 col-md-2 col-lg-1' id='save-btn-${hourText}-${ampmText}'>Locked</button>
            </div>`);
        hourIndex++;
    }
}

// highlight the rows based on whether they are past, present, or future
function highlightHours(currHour) {
    // input: a number from 0-23 designating the hour of the day.

    if (!(typeof currHour === "number" && currHour % 1 === 0 && currHour >= 0 && currHour <= 23)) {
        alert("Terrible program can't even call it's own highlightHours function properly!");
        return;
    }

    // set the appropriate class for each row based on the current hour
    $(".container").children(".row").each(function() {
        let thisHour = idToHour (this.id);
        if (thisHour < currHour) {
            setHighlightClass($("#" + this.id + " textarea"),"past");
        } else if (thisHour > currHour) {
            setHighlightClass($("#" + this.id + " textarea"),"future");
        } else {// so they must be equal
            setHighlightClass($("#" + this.id + " textarea"),"present");
        }
    })

    // internal function just to keep the code clear
    function idToHour(id) {
        // id is of the format div-hh-aa where aa is either am or pm and hh runs 09-12 then 01-05
        // the below looks complex, so I'll explain it in comments, it does this logic:
        // let isPM = (id.substr(id.length - 2, 1) == 'p') (if this is a pm entry it's true)
        // let hour = Number(id.substr(4,2));
        // if (isPM) {
        //    if hour == 12 {return 0 + hour}
        //    else {return 12 + hour}
        // else {return 0 + hour}
        return ((id.substr(id.length - 2, 1) == 'p' ? ((id.substr(4,2) == 12) ? 0 : 12) : 0) + Number(id.substr(4,2)));
    }

    // sets the class, ensuring that the other options are not set.
    function setHighlightClass(thisRow, thisClass) {
        $(thisRow).removeClass("past present future");
        $(thisRow).addClass(thisClass);        
    }
}

// listen for changes to the textareas
function changeTextArea() {

    btnElement = $("#save-btn" + this.id.substr(8,6));

    if (btnElement.text() !== "SAVE") {
        btnElement.text("SAVE");
        $(this).addClass("changed");
        btnElement.addClass("changed");
    }
}

// listen for button clicks to save textarea changes
function saveBtnClicked() {
    textareaId = "textarea" + this.id.substr(8,6);
    saveKey = currDateTime.format("MMDDYYYY ") + textareaId;
    saveText = $("#" + textareaId).val();

    localStorage.setItem(saveKey, saveText);

    $(this).text("Locked");
    $("#" + textareaId).removeClass("changed");
    $(this).removeClass("changed");
}

function getLocalStorage(keyDate, keyID) {
    outputText = localStorage.getItem(keyDate + ' ' + keyID);
    if (outputText === null) {
        return "";
    }
    return outputText;
}
