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


/**
 * Created by macbookpro on 22/03/2016.
 */

angular.module('ToastService', [])

    .factory('Toast', [function() {

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        var toastPosition = angular.extend({},last);

        function sanitizePosition() {
            var current = toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }

        return{
            getToastPosition : function(){
                sanitizePosition();
                return Object.keys(toastPosition)
                    .filter(function(pos) { return toastPosition[pos]; })
                    .join(' ');
            }

        }


    }]);

(function(){
    angular.module('CustomFilter', []).
        filter('capitalize', function() {
            return function(input, all) {
                var reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
                return (!!input) ? input.replace(reg, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            }
        });
})();

angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider,$httpProvider) {





		$routeProvider



		// home page
			.when('/', {
				templateUrl: 'packages/authentication/login.html',
				controller: 'AuthenticationController',
				resolve: {
					appRoutes: function ($location, $q) {
						var defer = $q.defer();
						var userIsLogin = localStorage.getItem('userToken');
						var role = localStorage.getItem('role');
						if (userIsLogin && role == "Teacher" ) {
							$location.path('/home-teacher');
						}
						else if (userIsLogin && role == "Student"){

							$location.path('/home-student');
						}
						else {
							defer.resolve();
						}

						return defer.promise;
					}
				}
			})

			.when('/sign-up', {
				templateUrl: 'packages/authentication/sign-up.html',
				controller: 'AuthenticationController',
				resolve: {
					appRoutes: function ($location, $q) {
						var defer = $q.defer();
						var userIsLogin = localStorage.getItem('userToken');
						var role = localStorage.getItem('role');
						if (userIsLogin && role == "Teacher" ) {
							$location.path('/home-teacher');
						}
						else if (userIsLogin && role == "Student"){

							$location.path('/home-student');
						}
						else {
							defer.resolve();
						}

						return defer.promise;
					}
				}
			})
			.when('/email-confirmation', {
				templateUrl: 'packages/authentication/email-confirmation.html',
				controller: 'EmailConfirmationController',

			})

			.when('/resend-email-confirmation/:email', {
				templateUrl: 'packages/authentication/resend-email.html',
				controller: 'AuthenticationController'

			})

			.when('/home-teacher', {
				templateUrl: 'packages/home-screen/home-teacher.html',
				controller: 'TeacherHomeController',
				resolve: {
					appRoutes: function ($location, $q) {
						var defer = $q.defer();
						var userIsLogin = localStorage.getItem('userToken');
						var role = localStorage.getItem('role');
						if (!userIsLogin) {
							$location.path('/');
						}
						else if (userIsLogin && role == "Student"){

							$location.path('/home-student');
						}
						else {
							defer.resolve();
						}

						return defer.promise;
					}
				}
			})

			.when('/home-student', {
				templateUrl: 'packages/home-screen/home-student.html',
				controller: 'StudentHomeController',
				resolve: {
					appRoutes: function ($location, $q) {
						var defer = $q.defer();
						var userIsLogin = localStorage.getItem('userToken');
						var role = localStorage.getItem('role');
						if (!userIsLogin) {
							$location.path('/');
						}
						else if (userIsLogin && role == "Teacher"){

							$location.path('/home-teacher');
						}
						else {
							defer.resolve();
						}

						return defer.promise;
					}
				}
			})
			//.when('/social-user-boarding/:userId/:token', {
			//	templateUrl: 'packages/home-screen/social-user-boarding.html',
			//	controller: 'SocialBoardingController'
			//	//resolve:{
			//	//	appRoutes:function(Authentication,$q,$rootScope,$location,$timeout)
			//	//	{
			//	//		var defer = $q.defer();
			//	//		$timeout(function(){
			//	//			Authentication.checkUser(function(data){
			//	//					if(data.session){
			//	//						$rootScope.user = data;
			//	//						$location.path('/main-page');
             //   //
			//	//
			//	//					}
			//	//					else
			//	//					{
			//	//						localStorage.clear();
			//	//						defer.resolve();
			//	//					}
			//	//				},
			//	//				function(err){
			//	//					defer.resolve();
			//	//				});
			//	//		},1000);
			//	//		return defer.promise;
			//	//	}
			//	//}
			//})

			.when('/social-user-boarding', {
				templateUrl: 'packages/home-screen/social-user-boarding.html',
				controller: 'SocialBoardingController'
			})


			.when('/after-login/:obj', {
				templateUrl: 'packages/dashboard/facebookuser.html'

			})



			.otherwise({ redirectTo: '/' });

		$locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authHttpResponseInterceptor');
	}])


	.factory('authHttpResponseInterceptor',['$q','$location',function($q,$location){

		return {

			request: function(request) {
				var token = localStorage.userToken;
				request.headers.token = token;
				return request;
			},
			response: function(response){
				if (response.status === 401) {
					console.log("Response 401");
				}
				return response || $q.when(response);
			},
			responseError: function(rejection) {
				console.log(rejection);
				if (rejection.status === 401) {
					console.log("Response Error 401",rejection);
					localStorage.clear();
					$location.path('/');
				}
				return $q.reject(rejection);
			}
		}
	}]);

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
angular.module('DashboardService', [])

    .factory('Dashboard', ['$http', function($http) {


    return {





    }



}]);
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
angular.module('TeacherHomeCtrl', ['ngMaterial','ngMessages']).controller('TeacherHomeController', ['$scope','$location', '$timeout', '$mdSidenav', '$log','$mdToast','Toast',function($scope,$location, $timeout, $mdSidenav, $log,$mdToast,Toast) {


    $scope.sideNavSpanHome = "side-nav-span-bold";
    $scope.controllerName = "Home";

    $timeout(function(){
        $mdToast.show(
            $mdToast.simple()
                .textContent("Welcome to Teacher's Dashboard")
                .position(Toast.getToastPosition())
                .hideDelay(3000)
        );

    },2000)








}]);