//Declare Constants
const typeClasses = {
    Mod: "success"
    , Musik: "danger"
    , Beitrag: "info"
};
//Load on Page Load
loadFromDatabase();
var listObject = [];
var draggedItemIndex;
var unsavedChanges = false;
//Autosave
//Autosave Timer
window.setInterval(function () {
    saveToDatabase();
}, 100000);
//Warnung beim Schließen der Seite
window.onbeforeunload = function () {
    if (unsavedChanges == true) {
        return ' Sie haben ungespeicherte Änderungen - Möchten Sie die Seite wirklich verlassen?';
    }
};
//Sortable Functionality
$(".sortable").sortable({
    update: function (event, ui) {
        changeItemPos(draggedItemIndex, ui.item.index());
    }
    , start: function (event, ui) {
        draggedItemIndex = ui.item.index();
    }
});

function addListItem(type, title, assignee, length) {
    listObject.push({
        type: type
        , title: title
        , assignee: assignee
        , length: length
    });
    unsavedChanges = true;
    showListObject();
}

function addReport() {
    addListItem("Beitrag", "Beitrag", "", 0);
    showModal(listObject.length - 1);
}
//Renders the LIstObject to Html
function showListObject() {
    $("#mainList").html("");
    var time = new Date(0);
    for (var i in listObject) {
        var length = new Date(listObject[i].length * 1000);
        length = length.getMinutes() + ":" + addZeros(length.getSeconds(), 2);
        var start = time.getMinutes() + ":" + addZeros(time.getSeconds(), 2);
        time.setSeconds(time.getSeconds() + listObject[i].length);
        var end = time.getMinutes() + ":" + addZeros(time.getSeconds(), 2);
        var newItem = '<li><div class="row"><div class="panel panel-default full-width"><div class="panel-body"><div class="col-md-1"><span class="label label-' + typeClasses[listObject[i].type] + '">' + listObject[i].type + '</span></div><div class="col-md-3">' + listObject[i].title + '</div><div class="col-md-2"><span class="glyphicon glyphicon-user" aria-hidden="true"></span>' + listObject[i].assignee + '</div><div class="col-md-2">' + length + '</div><div class="col-md-1">' + start + '</div><div class="col-md-1">' + end + '</div><div class="col-md-2 text-right">'
            //Add DOwnload Button, if it's a music
        if (listObject[i].type == "Musik") {
            newItem += '<a href="http://convert2mp3.net/share.php?url=https://www.youtube.com/watch?v=' + listObject[i].videoId + '" target="_blank" class="btn btn-raised btn-success">Download<span class="glyphicon glyphicon-download" aria-hidden="true"></span></a>';
        }
        newItem += '<a class="btn btn-raised btn-primary" onclick="showModal(' + i + ')"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></a><a class="btn btn-raised btn-danger" onclick="deleteItem(' + i + ')"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></div>';
        newItem += '</div></div></div></li>';
        $("#mainList").append(newItem);
    }
}

function addZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function changeItemPos(oldIndex, newIndex) {
    //remove the item at old position
    var item = listObject[oldIndex];
    listObject.splice(oldIndex, 1);
    //Insert the item at the new position.
    listObject.splice(newIndex, 0, item);
    unsavedChanges = true;
    showListObject();
}

function showModal(index) {
    resetModal();
    $("#formIndex").val(index);
    var myItem = listObject[index];
    $(".typeButton[data-type=" + myItem.type + "]").addClass("btn-raised");
    $("#formType").val(myItem.type);
    $("#formTitle").val(myItem.title);
    $("#formAssignee").val(myItem.assignee);
    $("#formLength").val(myItem.length);
    $("#youtubeVideoIdField").val(myItem.videoId);
    //Show Youtube Search
    if (myItem.type == "Musik") {
        showYoutubeSearch();
    }
    else {
        hideYoutubeSearch();
    }
    $("#myModal").modal();
}

function modalSaveChanges() {
    var index = $("#formIndex").val();
    var myItem = listObject[index];
    myItem.type = $("#formType").val();
    myItem.title = $("#formTitle").val();
    myItem.assignee = $("#formAssignee").val();
    myItem.length = Number($("#formLength").val());
    myItem.videoId = $("#youtubeVideoIdField").val();
    unsavedChanges = true;
    showListObject();
    closeModal();
}

function resetModal() {
    $("#formIndex").val("");
    $("#formType").val("");
    $("#formTitle").val("");
    $("#formAssignee").val("");
    $("#formLength").val("");
    $(".typeButton").removeClass("btn-raised");
    $("#youtubeSearchResultContainer").slideUp();
    $("youtubeSearchField").val("");
    $("#youtubeVideoIdField").val("");
}

function closeModal() {
    $("#myModal").modal("hide");
    resetModal();
}
//Do youtube Search, when pressing enter in the search field
$("#youtubeSearchField").keypress(function (event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        youtubeSearch($("#youtubeSearchField").val());
    }
});

function youtubeSearch(searchQuery) {
    var uebergabe = [];
    uebergabe.push("wert0");
    $.ajax({
        type: "GET"
        , async: true
        , url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchQuery + "&key=AIzaSyBLnQncfvpMMczdvn672SmQn6Q0etDumfA"
        , success: function (data) {
            //Clear the html Container with search result
            $("#youtubeSearchResult").html("");
            //Generate csv with all matching Video Ids
            var resultArray = data.items;
            var idList = [];
            for (var i in resultArray) {
                idList.push(resultArray[i].id.videoId);
            }
            idList = idList.join();
            //Make another API call to get video length
            $.ajax({
                type: "GET"
                , async: true
                , url: "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=" + idList + "&key=AIzaSyBLnQncfvpMMczdvn672SmQn6Q0etDumfA"
                , success: function (data2) {
                    //Evaluate Api Response
                    resultArray = data2.items;
                    //Loop through all Items and generate html
                    for (i in resultArray) {
                        var videoTitle = resultArray[i].snippet.title;
                        var videoId = resultArray[i].id;
                        //Duration Shit
                        var videoLength = resultArray[i].contentDetails.duration;
                        var indexOfFirstSeperator = videoLength.indexOf("T");
                        var indexOfSecondSeperator = videoLength.indexOf("M");
                        var indexOfThirdSeperator = videoLength.indexOf("S");
                        var videoLengthMinutes = videoLength.substring(indexOfFirstSeperator + 1, indexOfSecondSeperator);
                        var videoLengthSeconds = videoLength.substring(indexOfSecondSeperator + 1, indexOfThirdSeperator);
                        var videoLengthInSeconds = (videoLengthMinutes) * 60 + Number(videoLengthSeconds);
                        $("#youtubeSearchResult").append('<div class="panel panel-default search-result" onClick="transferVideoDataToForm(this)" data-videoId="' + videoId + '" data-videoTitle="' + videoTitle + '" data-videoLength="' + videoLengthInSeconds + '"><div class="panel-body"><div class="row"><div class="col-md-9">' + videoTitle + '</div><div class="col-md-3">' + videoLengthMinutes + ' : ' + videoLengthSeconds + '</div></div></div></div>');
                    }
                }
            });
            //Nested API call end
            //Show search result
            $("#youtubeSearchResultContainer").slideDown();
        }
    });
}

function transferVideoDataToForm(searchResultObject) {
    var videoId = $(searchResultObject).attr("data-videoId");
    var videoTitle = $(searchResultObject).attr("data-videoTitle");
    var videoLength = $(searchResultObject).attr("data-videoLength");
    $("#youtubeVideoIdField").val(videoId);
    $("#formTitle").val(videoTitle);
    $("#formLength").val(videoLength);
    $("#youtubeSearchResultContainer").slideUp();
}

function addYoutubeMusic() {
    addListItem("Musik", "", "", 0);
    showModal(listObject.length - 1);
}

function showYoutubeSearch() {
    $("#youtubeSearch").slideDown();
}

function hideYoutubeSearch() {
    $("#youtubeSearch").slideUp();
}

function updateTypeView(element) {
    $(".typeButton").removeClass("btn-raised");
    $(element).addClass("btn-raised");
    $("#formType").val($(element).attr("data-type"));
    if ($(element).attr("data-type") == "Musik") {
        showYoutubeSearch();
    }
    else {
        hideYoutubeSearch();
    }
}

function deleteItem(index) {
    if (confirm("Wirklich löschen?")) {
        listObject.splice(index, 1);
        showListObject();
        unsavedChanges = true;
    }
}

function saveToDatabase() {
    $("#saveButtonText").fadeOut();
    $("#saveButtonLoader").fadeIn();
    var uebergabe = [];
    uebergabe.push(JSON.stringify(listObject));
    $.ajax({
        type: "POST"
        , async: false
        , url: "save.php"
        , data: {
            getData: uebergabe
        }
        , success: function (data) {
            $("#saveButtonText").fadeIn();
            $("#saveButtonLoader").fadeOut();
            toastr.success('Änderungen gespeichert');
            unsavedChanges = false;
        }
        , error: function (data) {
            toastr.warning("Daten konnten nicht gespeichert werden!");
        }
    });
}

function loadFromDatabase() {
    $.ajax({
        type: "POST"
        , async: false
        , url: "load.php"
        , success: function (data) {
            listObject = JSON.parse(data);
            showListObject();
        }
    });
}

function deleteAll() {
    if (confirm("Wirklich alles löschen?")) {
        if (confirm("Ganz sicher?")) {
            listObject = [];
            saveToDatabase();
            showListObject();
            unsavedChanges = true;
        }
    }
}
//https://stackoverflow.com/questions/5180382/convert-json-data-to-a-html-table
// Builds the HTML Table out of myList.
function generatePrintVersion() {
    var selector = "#printFrame";
    var myList = listObject;
    var columns = addAllColumnHeaders(myList, selector);
    for (var i = 0; i < myList.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}
// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).append(headerTr$);
    return columnSet;
}
/*
DRAG AND DROP
*/
function dragEnterHandler(event) {
    $("#uploadInfoContainer").fadeIn();
    event.preventDefault();
}

function fadeOutUploadInfo() {
    $("#uploadInfoContainer").fadeOut();
}

function dragOverHandler(event) {
    event.preventDefault();
}

function dropHandler(event) {
    event.preventDefault();
    for (var i = 0; i < event.dataTransfer.files.length; i++) {
        handleDroppedFile(event.dataTransfer.files[i])
    }
    fadeOutUploadInfo();
}
var AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

function handleDroppedFile(currentFile) {
    //Check wether the file is an audio file
    if (currentFile.type.search("audio") != -1) {
        //Create a new filereader
        var myFilereader = new FileReader();
        //Set what happens if the file was successfully loaded
        myFilereader.onload = function(event) {
            //Use AudioContext to get Audios length            
            ctx.decodeAudioData(event.target.result, function (buffer) {
                var currentDuration = Math.round(buffer.duration);
                console.log("Dropped Data: Name: "+currentFile.name+" Duration: " + currentDuration);
                addListItem("Musik",currentFile.name,"Interbrett",currentDuration);
            })
        };
        //Start reading the dile as Array buffer
        myFilereader.readAsArrayBuffer(currentFile);
    }
    else{ //Not an audio File
        alert("Bitte nur Audiodateien ablegen");
    }
}