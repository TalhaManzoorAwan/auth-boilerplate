angular.module('HomeService', [])

    .factory('HomeService', ['$http', function($http) {



        return{

            //get user by id



            setUserRole : function(userID,obj,success,error){

                console.log('in Service')

                var url='/api/user/' + userID + '/updateRole';


                $http({
                    method: 'POST',
                    url: url,
                    data : obj

                }).then(function successCallback(response) {

                    success(response)
                }, function errorCallback(response) {
                    error(response);

                })
            },






            updateUserInfo : function(obj,success,error){

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


        }


    }]);