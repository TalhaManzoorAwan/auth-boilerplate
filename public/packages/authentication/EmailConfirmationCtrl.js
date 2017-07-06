angular.module('EmailConfirmationCtrl', ['ngMaterial']).controller('EmailConfirmationController', ['$scope','$rootScope', 'Authentication', '$location','$mdToast', 'Toast', function($scope,$rootScope, Authentication, $location,$mdToast, Toast) {

    var token  = $location.search().token;
    if(token){


        confirmEmail();

         function confirmEmail() {

            Authentication.userEmailConfirmation(token, function(response) {

                    $rootScope.user = response.data.data;
                    localStorage.setItem("userToken",  $rootScope.user.token);
                    localStorage.setItem("role",  $rootScope.user.role);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Email Successfully Confirmed")
                            .position(Toast.getToastPosition())
                            .hideDelay(3000)
                    );



                    if($rootScope.user.role == "Teacher"){

                        console.log("Teacher");
                        $location.url($location.path('/home-teacher'))


                    }
                    else{

                        console.log("Student");
                        $location.url($location.path('/home-student'))


                    }


                },
                function(err)
                {
                    $location.url($location.path('/'));
                    console.log(err);
                });
        };


    }
    else{

        $location.url($location.path('/'))
    }




}]);