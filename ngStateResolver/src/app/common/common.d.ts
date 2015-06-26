declare module app.common {
    export interface IStatePromise {
        priority: number;
        state?: string;
        exludedStates?: string[];
        promise: any;
        key?: string;
        cancelCallback?: boolean;
    }

    export interface IStatePromisesPrioritizedGroup {
        promises: IStatePromise[];
        priority: number;
        isLast: boolean;
    }

    export interface IStateResolverProvider {
        configure(promise: IStatePromise): void;
    }

    export interface IStateResolver {
        resolve(stateName: string, $stateParams?: ng.ui.IStateParamsService): ng.IPromise<any>;
        registerDeactivation(deactivatableObject: IDeactivatable): void;
        getStateParams(): ng.ui.IStateParamsService;
    }

    export interface IDeactivatable {
        canDeactivate? (): boolean;
        deactivate(): ng.IPromise<any>;
    }
} 