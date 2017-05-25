// alert(0)
console.log("register Detail..")
var myapp = angular.module('myApp', []);
myapp.controller("firstController", function($scope, $http) {
// alert(0) 
      
        function loadScript(){
            var script = document.createElement('script');
            script.type= 'text/javascript';
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&'+'&signed_in=true&callback=initialize';
            document.body.appendChild(script);
        }

            $scope.loadfun = function() {
                
                console.log("load fun..")
               
                /* 
                    http://192.168.1.13:4567/index.html
                */
                var url = 'http://test.poletalks.com/websites/getData';
                $http.get(url)
                    .then(function(res) {
                        console.log("ccccc",res.data.store_admins);
                        $scope.details = res.data.store_admins;
                        $scope.Description = res.data.store;
                        // $('#updateDiv').css("display","none");
                        // $('#insertDiv').css("display","block"); 
                        console.log("detaailsss:----", $scope.Description);    
                        var Lat = $scope.Description.location[0];
                        var Lon = $scope.Description.location[1];
                        var mapOptions= {
                            zoom : 8,
                            center : new google.maps.LatLng(Lon,Lat)
                        };
                        var map =new google.maps.Map(document.getElementById('map-canvas'),mapOptions);                
                    });

               
            }
            $scope.registerDetails = function() {
                // alert("hiiiiii.........!!!")
                console.log("Register your data...");
                var option = {
                        name: $scope.name,
                        email: $scope.email,
                        password: $scope.psw,
                        password1: $scope.psw1,
                        gender: $scope.gender
                    }
                    // console.log(option);
                option = JSON.stringify(option);
                console.log("data:--->", option);

                var url = window.location.origin + '/restApi?action=insert&table=kinj&option=' + option;
                $http.get(url)
                    .then(function(res) {

                        var x = JSON.stringify(res.data.result)
                        var x1 = JSON.parse(x);

                        alert("Data Inserted Successfully:----->>>>", x1);
                        $scope.details = x1;
                        location.reload();
                        // console.log("data:--->",$scope.details);
                    });
            }
            $scope.deleteData = function(id) {
                console.log("id is:::===>", id);
                var url = window.location.origin + '/restApi?action=delete&table=kinj&_id=' + id;
                console.log(url)

                $http.get(url)
                    .then(function(res) {
                        var results = res.data.result;
                        console.log("this is data :", results);
                        location.reload();
                    });
            }
            $scope.editData = function(id) {              
                $('#updateDiv').css("display","block");
                $('#insertDiv').css("display","none"); 
                
                console.log("id is:::===>", id);
                var url = window.location.origin + '/restApi?action=retrive&table=kinj&_id=' + id;
                console.log(url)
                $http.get(url)
                    .then(function(res) {
                        console.log("result is:--->> ", res.data[0]._id);
                        $scope.updateId = res.data[0]._id;
                        $scope.name = res.data[0].name;
                        $scope.email = res.data[0].email;                                            
                    });
            }
            $scope.updateData = function () {
                    var option = {
                        name: $scope.name,
                        email: $scope.email,
                        password: $scope.psw,
                        password1: $scope.psw1,
                        gender: $scope.gender
                    }
                    // console.log("id:::>>",$scope.updateId);
                    option = JSON.stringify(option);
                    console.log("data:--->", option);

                    var url = window.location.origin + '/restApi?action=update&table=kinj&_id=' + $scope.updateId + '&option=' + option;
                    console.log("url::",url)
                    $http.get(url)
                        .then(function(res) {
                            $('#updateDiv').css("display","block");
                            $('#insertDiv').css("display","none"); 
                           
                            location.reload();
                            // console.log("data:--->",$scope.details);
                        });
            }

           
  });     
