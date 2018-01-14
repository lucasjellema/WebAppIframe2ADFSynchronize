//API reference: http://docs.oracle.com/middleware/1221/adf/api-reference-javascript-faces/toc.htm 
var jsonData = {
};

function handeJsonPayloadContainer(container) {
    // from the HTML element we get the element id and use that as the input for the findComponentByAbsoluteId call that returns the actual ADF Faces AdfRichSelectOneRadio object
    var adfContainer = AdfPage.PAGE.findComponentByAbsoluteId(container.id);
    var clientAttributes = adfContainer.getProperty('jsonPayloadAttributes');
    // replace all single quotes with double quotes    
    var json = clientAttributes.replace(/[']/g, "\"");
    // get a list of the names of the client attributes that this container has that should all be processed
    var clientAtts = JSON.parse(json).attributes;
    //loop over all clientAttribute names and fetch the value for each of them
    for (i = 0;i < clientAtts.length;i++) {
        // get the value for a specific Client Attribute 
        var pay = adfContainer.getProperty(clientAtts[i]);
        var value = JSON.parse(pay);

        // here is the place and time to pass the JSON payload to a place where JET can access it (or store in a global JS variable jsonData )
        jsonData[clientAtts[i]] = value;
        //alert(JSON.stringify(jsonData[clientAtts[i]].attributes));
        console.log("Refreshed jsonData[" + clientAtts[i] + "]; now contains " + jsonData[clientAtts[i]].values.length + " objects");
        // publish updated data bound json data as client event
        publishEvent("dataBoundJSONRefreshed", 
          {
              "jsonData" : jsonData
              ,"sourceTaskFlow" :"ADF-X-taskflow"
          });
    };//for    
}

function initializeJsonPayloads() {

    // get hold of all ADF Faces Client Side object that have the styleClass jsonPayload
    // (these all have a clientAttribute that contains a JSON payload that we want to have access to in the client)
    var jsonContainers = document.getElementsByClassName("jsonPayload");
    for (i = 0;i < jsonContainers.length;i++) {
        handeJsonPayloadContainer(jsonContainers[i]);
    };//for
    //google.charts.setOnLoadCallback(drawMultSeries);
    drawMultSeries();
}

function drawMultSeries() {
    var countryData = jsonData["countryData"].values;
    var headers = ['Country', 'Population', 'Area [km^2 *10]'];
    var cdata = [headers];
    //TODO filter by selected attribute (population, area, coastline, life expectancy) and ascending or descending
    countryData.sort( function(a,b){ return parseInt(b.population) - parseInt(a.population); }).splice(8);
    
    for (var i = 0;i < countryData.length;i++) {
        cdata.push([countryData[i].name, parseInt(countryData[i].population), parseInt(countryData[i].area)*10]);

    }
    //for
//    var data = google.visualization.arrayToDataTable(cdata);
//
//    var options = {
//        title : 'Countries in Continent', chartArea :  {
//            width : '50%'
//        },
//        hAxis :  {
//            title : 'Total Population', minValue : 0
//        },
//        vAxis :  {
//            title : 'Country'
//        }
//    };
//    // create chart in DIV element produced from panelHeader
//    var targetContainerForChartId = "ph2::content";
//    var chart = new google.visualization.BarChart(document.getElementById(targetContainerForChartId));
//    chart.draw(data, options);
}

function init(e) {
    // based on data included in page on initial load, initalize global variable jsonData
    // after PPR; json payloads may have to be refreshed
    initializeJsonPayloads();
}

document.addEventListener("DOMContentLoaded", function (event) {
    init(event);
});
