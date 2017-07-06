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
