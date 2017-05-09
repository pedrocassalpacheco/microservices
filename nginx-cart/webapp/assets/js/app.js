angular.module('SpringMusic', ['albums', 'errors', 'status', 'info', 'ngRoute', 'ui.directives']).
    config(function ($locationProvider, $routeProvider) {

        $routeProvider.when('/errors', {
            controller: 'ErrorsController',
            templateUrl: 'assets/templates/errors.html'
        });
        $routeProvider.otherwise({
            controller: 'AlbumsController',
            templateUrl: 'assets/templates/albums.html'
        });
    }
);
