angular.module('SocialBoardingCtrl', ['ngMaterial', 'ngMessages']).controller('SocialBoardingController', ['$scope', '$rootScope', '$location', '$timeout', '$mdSidenav', '$log', '$routeParams', 'HomeService','$mdToast','Toast', function ($scope, $rootScope, $location, $timeout, $mdSidenav, $log, $routeParams, HomeService,$mdToast,Toast) {


    $scope.sideNavSpanHome = "side-nav-span-bold";
    $scope.controllerName = "";
    $scope.user = {};
    $scope.topProgessBar = true;

    var queryobj = $location.search();
    $rootScope.user = queryobj;

    //$location.search('email',null);
    //$location.search('role',null);
    console.log("query string", $rootScope.user);

    if ($rootScope.user.email) {
        $scope.user.email = $rootScope.user.email;
        $scope.disableEmail = true;
    }

    $scope.hideErrorMsg = function(){

        $scope.errorMessage= '';
    };

   if($rootScope.user.userId && $rootScope.user.token){

       $mdToast.show(
           $mdToast.simple()
               .textContent("Logged into System")
               .position(Toast.getToastPosition())
               .hideDelay(3000)
       );

       localStorage.setItem("userToken", $rootScope.user.token);

       if($rootScope.user.role && $rootScope.user.email){


           if($rootScope.user.role == "Teacher"){
               localStorage.setItem("role",  $rootScope.user.role);
              // $location.path('/home-teacher')
               $location.url($location.path('/home-teacher'))
           }
           else{
               localStorage.setItem("role",  $rootScope.user.role);
               //$location.path('/home-student')
               $location.url($location.path('/home-student'))
           }


       }
       else{




           $scope.topProgessBar = false;
           $scope.showBoardingForm = true;
           var userID = $rootScope.user.userId;
           $scope.teacherBtn = function () {



               if ($scope.user.email) {
                   $scope.roleButton= true;
                   $scope.progressBar = true;
                   console.log($scope.user.email);

                   $scope.user.role = "Teacher";

                   HomeService.setUserRole(userID, $scope.user, function (response) {


                           $rootScope.user = response.data.data;
                           localStorage.setItem("role",  $rootScope.user.role);
                           //$location.path('/home-teacher')
                           $location.url($location.path('/home-teacher'))
                       },
                       function (err) {
                           $scope.roleButton= false;
                           console.log(err);
                            $scope.progressBar = false;
                           if (err.status == 404) {

                               $scope.errorMessage = err.data.data;
                               $location.path('/')
                           }
                           else {
                               $scope.errorMessage = err.data.data;
                           }
                       });


               } else {

                   $scope.errorMessage = "Provide your Email Address."


               }
           };

           $scope.studentBtn = function () {

               if ($scope.user.email) {
                   $scope.roleButton= true;
                   $scope.progressBar = true;
                   console.log($scope.user.email);
                   $scope.user.role = "Student";
                   HomeService.setUserRole(userID, $scope.user, function (response) {

                           $rootScope.user = response.data.data;
                           localStorage.setItem("role",  $rootScope.user.role);
                          // $location.path('/home-student')
                           $location.url($location.path('/home-student'))

                       },
                       function (err) {
                           $scope.roleButton= true;
                           console.log(err);
                           $scope.progressBar = false;
                           if (err.status == 404) {

                               $scope.errorMessage = err.data.data;
                               //$location.path('/')
                               $location.url($location.path('/'))
                           }
                           else {
                               $scope.errorMessage = err.data.data;
                           }
                       });


               } else {

                   $scope.errorMessage = "Provide your Email Address."


               }
           };






       }



   }
    else{

       $location.url($location.path('/'))
       //$location.path('/')
   }







}]);