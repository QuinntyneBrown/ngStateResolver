var app;
(function (app) {
    var common;
    (function (common) {
        "use strict";
        /**
         * Provider to stream line the data that's resolve in every state change.
         */
        var StateResolverProvider = (function () {
            function StateResolverProvider() {
                var _this = this;
                /**
                 * register state promise during config
                 */
                this.configure = function (statePromise) {
                    _this.statePromises.push(statePromise);
                };
                this.statePromises = [];
                this.deactivationStatePromises = [];
                /**
                 * Get All State Promises that have been registered during the angular config phase
                 * filter the promises by stateName defined in the registration function
                 * sort the State Promises by priority. Lowest priority executes first
                 */
                this.getStatePromises = function (stateName) {
                    return _this.statePromises.filter(function (statePromise) {
                        if (statePromise.state == null || statePromise.state == stateName) {
                            if (!statePromise.exludedStates)
                                return true;
                            if (statePromise.exludedStates.indexOf(stateName) < 0)
                                return true;
                            return false;
                        }
                        else {
                            return false;
                        }
                    }).sort(function (statePromise1, statePromise2) {
                        return statePromise1.priority - statePromise2.priority;
                    });
                };
                /**
                 * Group StatePromises by Priority
                 */
                this.groupStatePromisesByPriority = function (statePromises) {
                    var priorities = [];
                    var statePromisesPrioritizedGroups = [];
                    statePromises.forEach(function (promise) {
                        if (priorities.indexOf(promise.priority) < 0)
                            priorities.push(promise.priority);
                    });
                    priorities.forEach(function (priority, index) {
                        statePromisesPrioritizedGroups.push({
                            promises: statePromises.filter(function (promise) {
                                return promise.priority == priority;
                            }),
                            priority: priority,
                            isLast: index == priorities.length - 1
                        });
                    });
                    return statePromisesPrioritizedGroups;
                };
                /**
                 * Invoke Group Promises Asynchrounosly.
                 * After you reach the last group, call the promise resolve callback
                 */
                this.invoke = function ($injector, $q, groups, currentGroupIndex, callback, resolvedRouteData) {
                    var excutedPromises = [];
                    var currentGroup = groups[currentGroupIndex];
                    currentGroup.promises.forEach(function (statePromise) {
                        excutedPromises.push($injector.invoke(statePromise.promise));
                    });
                    $q.all(excutedPromises).then(function (results) {
                        results.forEach(function (result, index) {
                            if (currentGroup.promises[index].key) {
                                resolvedRouteData[currentGroup.promises[index].key] = results[index];
                            }
                        });
                        if (currentGroup.isLast) {
                            callback();
                        }
                        else {
                            _this.invoke($injector, $q, groups, currentGroupIndex + 1, callback, resolvedRouteData);
                        }
                    });
                };
                /**
                * Inject stateResolver
                 */
                this.$get = ["$injector", "$q", "$state", function ($injector, $q, $state) {
                    return {
                        resolve: function (stateName, stateParams) {
                            _this.stateParams = stateParams;
                            var deferred = $q.defer();
                            var resolvedRouteData = {};
                            var statePromises = _this.getStatePromises(stateName);
                            var prioritizedGroups = _this.groupStatePromisesByPriority(statePromises);
                            var priorities = [];
                            statePromises.forEach(function (promise) {
                                if (priorities.indexOf(promise.priority) < 0)
                                    priorities.push(promise.priority);
                            });
                            _this.invoke($injector, $q, prioritizedGroups, 0, function () {
                                deferred.resolve(resolvedRouteData);
                            }, resolvedRouteData);
                            return deferred.promise;
                        },
                        getStateParams: function () {
                            return _this.stateParams;
                        },
                        registerDeactivation: function (deactivatableObject) {
                        }
                    };
                }];
            }
            return StateResolverProvider;
        })();
        common.StateResolverProvider = StateResolverProvider;
        angular.module("app.common").provider("stateResolver", [StateResolverProvider]);
    })(common = app.common || (app.common = {}));
})(app || (app = {}));
//# sourceMappingURL=stateResolverProvider.js.map