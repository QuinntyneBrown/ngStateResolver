var app;
(function (app) {
    var common;
    (function (common) {
        describe("StateResolver", function () {
            var stateResolverProvider;
            var scope;
            var routeData;
            var $injector;
            beforeEach(function () {
                module("app.common");
                stateResolverProvider = new app.common.StateResolverProvider();
                routeData = null;
            });
            beforeEach(inject(function ($rootScope, _$injector_) {
                scope = $rootScope.$new();
                $injector = _$injector_;
            }));
            it("should be defined", function () {
                expect(stateResolverProvider).toBeDefined();
            });
            it("should be have 0 promises", function () {
                expect(stateResolverProvider.statePromises).toEqual([]);
            });
            it("should be have 1 promise if configured with 1 promise", function () {
                stateResolverProvider.configure({
                    priority: 1,
                    state: "default",
                    promise: [
                        "$q",
                        function ($q) {
                            return $q.when(true);
                        }
                    ]
                });
                expect(stateResolverProvider.statePromises.length).toEqual(1);
            });
            it("should be have 1 promise if configured with 1 promise", function () {
                stateResolverProvider.configure({
                    priority: 1,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                expect(stateResolverProvider.statePromises.length).toEqual(1);
                var stateResolver = $injector.invoke(stateResolverProvider.$get);
                expect(stateResolver).toBeDefined();
                expect(routeData).toBeFalsy();
                stateResolver.resolve("default");
                scope.$digest();
                expect(routeData).toEqual(1);
            });
            it("it should group state promises by priority", function () {
                var statePromises = [];
                statePromises.push({
                    priority: 1,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                statePromises.push({
                    priority: 2,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = routeData + 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                statePromises.push({
                    priority: 1,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                statePromises.push({
                    priority: 2,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = routeData + 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                var result = stateResolverProvider.groupStatePromisesByPriority(statePromises);
                expect(result.length).toEqual(2);
                expect(result[1].isLast).toEqual(true);
            });
            it("should be have 2 promises if configured with 2 promises", function () {
                stateResolverProvider.configure({
                    priority: 1,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                stateResolverProvider.configure({
                    priority: 2,
                    state: "default",
                    key: "testRouteData",
                    promise: [
                        "$q",
                        function ($q) {
                            routeData = routeData + 1;
                            return $q.when(routeData);
                        }
                    ]
                });
                expect(stateResolverProvider.statePromises.length).toEqual(2);
                var stateResolver = $injector.invoke(stateResolverProvider.$get);
                var routeDataResult;
                expect(stateResolver).toBeDefined();
                expect(routeData).toBeFalsy();
                stateResolver.resolve("default").then(function (results) {
                    routeDataResult = results;
                });
                scope.$digest();
                expect(routeData).toEqual(2);
                expect(routeDataResult.testRouteData).toEqual(2);
            });
        });
    })(common = app.common || (app.common = {}));
})(app || (app = {}));
//# sourceMappingURL=stateResolverProvider.spec.js.map