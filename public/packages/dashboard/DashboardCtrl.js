angular.module('DashboardCtrl', ['ngMaterial','ngMessages']).controller('DashboardController',[ '$scope','$location','$timeout', 'Dashboard', '$mdSidenav', '$log', function($scope,$location, $timeout, Dashboard, $mdSidenav, $log) {





}])

.controller('LeftCtrl', ['$scope','$rootScope', '$location', '$timeout', '$mdSidenav', '$log',function ($scope,$rootScope, $location, $timeout, $mdSidenav, $log ) {
    $scope.close = function () {
        $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });
    };


        $scope.logOutUser=function()
        {
            $rootScope.admin=null;
            localStorage.clear();
            $location.path("/admin")

        }







}]);