angular.module('AuthenticationCtrl', ['ngMaterial']).controller('AuthenticationController', ['$scope','$rootScope', 'Authentication', '$location','$mdToast', 'Toast','$routeParams', function($scope,$rootScope, Authentication, $location,$mdToast, Toast,$routeParams) {


    $scope.signUp = function() {
        console.log("signUP", $scope.user);
        $scope.signUpProgress = true;

        var  user = $scope.user;
        Authentication.userSignup(user, function(response) {

                $scope.signUpProgress = false;


                $mdToast.show(
                    $mdToast.simple()
                        .textContent(response.data.message)
                        .position(Toast.getToastPosition())
                        .hideDelay(3000)
                );

                $location.path('/');


            },
            function(err)
            {
                $scope.signUpProgress = false;

                if(err.status == 403){


                    $scope.emailError= err.data.message;
                    console.log($scope.emailError);
                }
                else{

                    $scope.signUpError= err.data.message;
                }
                console.log(err);
            });
    };


    $scope.hideError =function(){

        $scope.emailError = '';

    };


    $scope.signIn = function() {
        $scope.loginProgress = true;
        Authentication.signin($scope.user, function(response) {

                $rootScope.user = response.data.data;
                localStorage.setItem("userToken",  $rootScope.user.token);
                localStorage.setItem("role",  $rootScope.user.role);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Logged into System")
                        .position(Toast.getToastPosition())
                        .hideDelay(3000)
                );
                if($rootScope.user.role == "Teacher"){

                    console.log("Teacher");
                    $location.path('/home-teacher');
                }
                else{

                    console.log("Student");
                    $location.path('/home-student');

                }

            },
            function(err)
            {
                if(err.status== 401){

                    $location.path('/resend-email-confirmation/'+ err.data.data );
                }
                else{
                    $scope.loginError= err.data.message;
                    $scope.loginProgress = false;

                    console.log(err)
                }

            });
    };


    if($routeParams.email){


        console.log($routeParams.email);

        var email = $routeParams.email;


        $scope.resendConfirmationEmail = function(){

            $scope.resendProgress = true

            Authentication.resendEmailConfirmation(email, function(response) {

                    $scope.resendProgress = false;

                    $scope.errorMessage= response.data.message;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(response.data.message)
                            .position(Toast.getToastPosition())
                            .hideDelay(3000)
                    );



                },
                function(err)
                {
                    $scope.resendProgress = false
                    $scope.errorMessage= err.data.message;
                    console.log(err);
                });

        }


    }

}])


.directive('confirmPwd', ['$interpolate', '$parse',function($interpolate, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ngModelCtrl) {

            var pwdToMatch = $parse(attr.confirmPwd);
            var pwdFn = $interpolate(attr.confirmPwd)(scope);

            scope.$watch(pwdFn, function(newVal) {
                ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
            });

            ngModelCtrl.$validators.password = function(modelValue, viewValue) {
                var value = modelValue || viewValue;
                return value == pwdToMatch(scope);
            };

        }
    }
}]);