angular.module('userControllers', ['userServices'])

  .controller('regCtrl', function($http, $location, User){

    var app = this;

    this.regUser = function(regData){
      app.loading = true;
      app.successMsg = false;
      app.errorMsg = false;

      User.create(app.regData)
        .then(function(data){
          if (data.data.success) {
            app.loading = false;
            // create success message
            app.successMsg = data.data.message;
            // redirect to home page
            $location.path('/');
          } else {
            app.loading = false;
            // create an error Message
            app.errorMsg = data.data.message;
          }
        });

    };

  })

  .controller('googleCtrl', function($routeParams, Auth, $location, $window) {

    var app = this;

    if ($window.location.pathname == '/googleerror') {
        app.errorMsg = 'Google e-mail not found in database.';
    } else {
        Auth.socialMedia($routeParams.token);
        $location.path('/');
    }
  });
