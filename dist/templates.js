(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/header/header.tpl.html',
    '<div class="header-center"><div class="col-centered logo-container"><img src="logo.png"><div class="description">Have you always dreamed of a neighborhood that reflects your values and prefrences? Homeland helps you get there. Use the sliders below to effect the map and see which regions are your best fit for what is important to you.</div><div class="get-started btn" ng-click="moveToMap()">GET STARTED</div></div></div><div class="indicator-bar"><div class="left-text">Good Match</div><div class="right-text">Poor Match</div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/map/map.tpl.html',
    '<div class="map-center"><h4 class="loading" ng-show="loading">Loading...</h4><a id="map"></a></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('templates');
} catch (e) {
  module = angular.module('templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('/sliders/sliders.tpl.html',
    '<ul class="fields" as-sortable="dragControlListeners" ng-model="interesting_fields"><li ng-repeat="field in interesting_fields" as-sortable-item="" class="as-sortable-item"><div class="index">{{$index + 1}}</div><div class="name">{{field.name_pretty}}<br ng-if="field.reverse"><span ng-if="field.reverse" class="small">lower is better</span></div><rzslider rz-slider-floor="field.min" rz-slider-ceil="field.max" step="1" rz-slider-model="sliders[field.name]"><div class="fin">data</div></rzslider></li></ul>');
}]);
})();
