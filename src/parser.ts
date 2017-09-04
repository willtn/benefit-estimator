import { QuickEstimator } from "./quick";
import { ImpactReport, EstimationParams } from "./model";

export class EstimationParser {
  private quick = new QuickEstimator();

  public parseReport(report: ImpactReport): EstimationParams {
    // Only support quick estimation at the moment
    const qck = report && report.quick ?
      this.quick.convert(report.quick.numInvites, report.quick.numHours, this.parseHasWebsite(report.quick.haveWebsite)) :
      undefined;

    return qck;
  }

  private parseHasWebsite(hasWebsite: "yes" | "no"): boolean {
    return hasWebsite === "yes";
  }
}
