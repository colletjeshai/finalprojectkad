angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);


function mainCtrl($scope, $http){
  var options = {
    zoom:2.5,
    center:{lat:0, lng:0}
  }
  //new Map
  var map = new
  google.maps.Map(document.getElementById('map'),options);

  function addMarker(props){
    var marker = new google.maps.Marker({
      position:props.coords,
      map:map,
      icon:props.iconImage
    });

    //check for customicon

    if (props.iconImage){
      console.log('true')
      //set iconImage
      marker.setIcon(props.iconImage);
    }
    //check content
    if(props.content){
      var infoWindow = new google.maps.InfoWindow({
        content: props.content
      });

      marker.addListener('click', function(){
        infoWindow.open(map, marker);
      });
    }
  }

  $scope.myAppName = "Travel with style";
  $scope.mysparqlendpoint = "http://192.168.1.161:7200/repositories/kadfp?name=&infer=true&sameAs=false&query=";
  $scope.AttractionQuery = "Select ?attraction where { ?attraction a <http://www.example.org/travelwithstyle/Attraction>}" ;


  $http( {
  method: "GET",
  headers : {'Accept':'application/sparql-results+json',
  'Content-Type':'application/sparql-results+json'},
  url : $scope.mysparqlendpoint + encodeURI($scope.AttractionQuery).replace(/#/g, '%23'),

  }).success(function(data, status) {
      angular.forEach(data.results.bindings, function(val)
          {
              getData(val.attraction.value);
          })

  })
  .error(function(error){
      console.log('Error');
  });



  function getData(attraction){

      $scope.AttractionInformationQuery = "Select * WHERE { <"+ attraction +"> <http://www.example.org/travelwithstyle/hasLat> ?lat. <"+
        attraction +"> <http://www.example.org/travelwithstyle/hasLong> ?long. <"+attraction+
        "> <http://www.example.org/travelwithstyle/hasDescription> ?description. <"+ attraction +
        "> <http://www.example.org/travelwithstyle/hasBuildBy> ?architect. }"

      $http( {
    	method: "GET",
    	headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'},
    	url : $scope.mysparqlendpoint+encodeURI($scope.AttractionInformationQuery ).replace(/#/g, '%23'),
      }).success(function(data, status ) {
          angular.forEach(data.results.bindings, function(val)
              {
                $scope.stringAttr = attraction.toString();
                $scope.attr = $scope.stringAttr.split("/");
                $scope.finalAttr;
                if ($scope.attr[4]=="kd")
                {
                  $scope.finalAttr = ($scope.attr[5]);
                }
                else
                {
                  $scope.finalAttr = ($scope.attr[4])
                };
                  $scope.resLong=(parseFloat(val.long.value));
                  $scope.resLat= parseFloat(val.lat.value);
                  $scope.resDescr = (val.description.value);
                  $scope.resArchitect = (val.architect.value);
                  $scope.stringArchitect = $scope.resArchitect.toString();
                  $scope.architect = $scope.stringArchitect.split("/");
                  $scope.finalArchitect = $scope.architect[4];

                  addMarker({
                    coords:{lat: parseFloat(val.lat.value), lng: parseFloat(val.long.value)},
                    iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                    content:'<div  style="border-style: solid;border-color: blue; background-color: # #ccebff; width: auto; height:auto; position: relative; float: right;"><div style="border-style: dotted;border-color: blue; border-width: 1px;background-color:  #ccebff;"><h1 <strong>Name:</strong></h1><p>' +$scope.finalAttr +'</p></div><div style="border-style: dotted;border-width: 1px;border-color: blue; background-color:  #ccebff;"><h2><strong>Long:</strong></h2><p>' +$scope.resLong +'</p></div><div style="border-style: dotted;border-width: 1px; border-color: blue;background-color:  #ccebff"><h2>Lat:</h2><p>' +$scope.resLat +'</p><div style="border-style: dotted;border-width: 1px; border-color: blue;background-color:  #ccebff "><h2><strong>Description:</strong></h2><p>' +$scope.resDescr +'</p> </div><div style=" border-style: dotted;border-width: 1px;border-color: blue; background-color:  #ccebff; "><h2> </strong>Architect:</strong></h2><p>' +$scope.finalArchitect+'</p></div></div>'
                  });
              })
      })
      .error(function(error ){
          console.log('Error');
      });


      }

}
