angular.module('mainController', ['authServices'])
  .controller('mainCtrl', function(Auth, $location, $timeout, $rootScope, $window) {
    var app = this;

    $rootScope.$on('$routeChangeStart', function() {
      if (Auth.isLoggedIn()) {
        app.isLoggedIn = true;
        Auth.getUser().then(function(data) {
          app.username = data.data.username;
          app.useremail = data.data.email;
        });
      } else {
        app.isLoggedIn = false;
        app.username = "";
      }
      if ($location.hash() == '_#_') $location.hash(null);
    });

    this.google = function() {
        app.disabled = true;
        $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
    };

    this.doLogin = function(loginData){
      app.loading = true;
      app.successMsg = false;
      app.errorMsg = false;

      Auth.login(app.loginData)
        .then(function(data){
          if (data.data.success) {
            app.loading = false;
            // create success message
            app.successMsg = data.data.message;
            // redirect to home page
            $timeout(function(){
              $location.path('/about');
              app.loginData = '';
              app.successMsg = false;
            }, 2000);
          } else {
            app.loading = false;
            // create an error Message
            app.errorMsg = data.data.message;
          }
        });
    };

    this.logout = function() {
      Auth.logout();
      $location.path('/logout');
      $timeout(function(){
        $location.path('/');
      }, 2000);
    };

  });
