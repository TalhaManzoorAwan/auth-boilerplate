angular.module('MainCtrl', ['ngMaterial','ngMessages'])
    .controller('MainController', ['$scope','$rootScope','$location', '$timeout', '$mdSidenav', '$log','$mdToast','Toast',function($scope,$rootScope,$location, $timeout, $mdSidenav, $log,$mdToast,Toast) {




        $scope.logOut = function(){

            $rootScope.user=null;
            localStorage.clear();
            $mdToast.show(
                $mdToast.simple()
                    .textContent("Successfully logged out")
                    .position(Toast.getToastPosition())
                    .hideDelay(3000)
            );
            $location.path('/');
        };



        $scope.toggleLeft = buildDelayedToggler('left');

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {


            return debounce(function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {

                    });
            }, 200);
        }
        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {

                    });
            }
        }







}]);

