import { ImpactReport, Price, OfferPrice, ImpactEstimation, PromiseLike } from "./model";
export declare class Estimator {
    private estimate;
    private all;
    private parser;
    constructor(estimate: Estimation, all: (promises: PromiseLike<Price>[]) => PromiseLike<Price[]>);
    total(report: ImpactReport): PromiseLike<Price>;
    private create(params);
    private host(params);
    private inviteBuyer(params);
    private inviteSeller(params);
    private recommend(params);
    private nonEmpty(params);
}
export declare type Estimation = (price: OfferPrice, storeOwners: number) => PromiseLike<ImpactEstimation>;
