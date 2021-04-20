var statusArray = [];
var DataSet = [];
var ObjProperty;

getItems();

function getItems() {
   $.ajax({
      url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('LeaveTracker')/items?$top=500&$select=Status",
      type: "GET",
      headers: {
         accept: "application/json;odata=verbose",
      },
      success: function (data) {
         var items = data.d.results;
         for (var i = 0; i < items.length; i++) {
            var statusVar = items[i].Status;
            statusArray.push(statusVar);
         }
         fnDataArray();//Get Unique Status Count & Dataset for HighChart
         buildhighcharts();// Build Bar Chart
      },
      error: function (error) {
         console.log(error);
      },
   });
}

function fnDataArray() {
   var StatusObj = statusArray.reduce(function (count, status) {
      if (typeof count[status] == "undefined") {
         count[status] = 1;
      } else {
         count[status] += 1;
      }
      return count;
   }, {});
   console.log(StatusObj);
   //Object Output -> {Open: 1, InProgress: 2, Completed: 1}
   //Get the values from our object
   var DataName = Object.keys(StatusObj);
   var DataCount = Object.values(StatusObj);
   ObjProperty = Object.getOwnPropertyNames(StatusObj);
   for (var i = 0; i < ObjProperty.length; i++) {
      DataSet.push({
         name: DataName[i],
         data: [DataCount[i]],
      });
   }
}

function buildhighcharts() {
   if (ObjProperty.length > 0) {
      $("#BarChart").highcharts({
         credits: {
            enabled: false,
         },
         chart: {
            type: "column",
         },
         title: {
            text: null,
         },
         xAxis: {
            visible: false,
         },
         yAxis: {
            min: 0,
            title: {
               text: "No. of Requests",
            },
         },
         tooltip: {
            formatter: function () {
               return this.series.name + " : " + this.y;
            },
         },
         plotOptions: {
            column: {},
         },
         series: DataSet,
      });
   } else {
      $("#BarChart").highcharts({
         title: {
            text: "No data to display!",
         },
      });
   }
}