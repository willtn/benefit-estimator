import { ImpactReport, Price, OfferPrice, ImpactEstimation } from "./model";
export declare class Estimator {
    private estimate;
    private all;
    private parser;
    constructor(estimate: Estimation, all: (promises: Promise<Price>[]) => Promise<Price[]>);
    total(report: ImpactReport): Promise<Price>;
    private create(params);
    private host(params);
    private inviteBuyer(params);
    private inviteSeller(params);
    private recommend(params);
    private nonEmpty(params);
}
export declare type Estimation = (price: OfferPrice, storeOwners: number) => Promise<ImpactEstimation>;
