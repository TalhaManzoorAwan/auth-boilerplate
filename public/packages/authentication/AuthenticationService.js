angular.module('AuthenticationService', [])


.factory('Authentication', ['$http', function($http) {

    return {
        signin : function(obj,success,error){

            $http({
                method: 'POST',
                url: '/api/sign-in',
                data: obj
            }).then(function successCallback(response) {

                success(response)
            }, function errorCallback(response) {
                error(response);

            });
        },



        userSignup : function(obj, success,error){

            $http({
                method: 'POST',
                url: '/api/sign-up',
                data: obj
            }).then(function successCallback(response) {

                success(response)
            }, function errorCallback(response) {
                error(response);

            });

        }

        ,
        userEmailConfirmation : function(token, success,error){

            $http({
                method: 'GET',
                url: '/api/email-confirmation?token=' + token
            }).then(function successCallback(response) {

                success(response)
            }, function errorCallback(response) {
                error(response);

            });

        },

        resendEmailConfirmation : function(email, success,error){

            $http({
                method: 'GET',
                url: '/api/resend-email-confirmation?email=' + email
            }).then(function successCallback(response) {

                success(response)
            }, function errorCallback(response) {
                error(response);

            });

        }




    }




}]);
