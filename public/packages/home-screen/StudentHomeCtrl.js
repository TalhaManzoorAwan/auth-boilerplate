angular.module('StudentHomeCtrl', ['ngMaterial','ngMessages']).controller('StudentHomeController', ['$scope','$location', '$timeout', '$mdSidenav', '$log','$mdToast','Toast',function($scope,$location, $timeout, $mdSidenav, $log,$mdToast,Toast) {


  $scope.sideNavSpanHome = "side-nav-span-bold";
    $scope.controllerName = "Home";


  $timeout(function(){
    $mdToast.show(
        $mdToast.simple()
            .textContent("Welcome to Student's Dashboard")
            .position(Toast.getToastPosition())
            .hideDelay(3000)
    );

  },2000)





}]);