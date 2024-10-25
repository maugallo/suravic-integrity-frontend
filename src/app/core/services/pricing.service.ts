import { Injectable } from '@angular/core';
import { MeatDetails } from '../models/interfaces/meat-details.model';
import { MeatDetailsType } from '../models/enums/meat-details-type.enum';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  public calculateMainCutGrossCost(mainCutCostPerKg: number, mainCutWeight: number) {
    return mainCutCostPerKg * mainCutWeight;
  }

  public calculateMainCutSellingCost(mainCutGrossCost: number, profitPercentage: number) {
    return mainCutGrossCost + (mainCutGrossCost * (profitPercentage / 100));
  }

  public calculateMeatCutsCurrentPricesSum(meatDetailProducts: MeatDetails[]) {
    return meatDetailProducts.reduce((accumulatedSum, product) => accumulatedSum + (product.weight * Number(product.price)), 0);
  }

  public calculatePricesDifference(mainCutSellingCost: number, profitPercentage: number, meatCutsCurrentPricesSum: number) {
    if (mainCutSellingCost > 0 && profitPercentage > 0 && meatCutsCurrentPricesSum > 0) {
      return mainCutSellingCost - meatCutsCurrentPricesSum;
    }
    return null;
  }

  public calculatePricesDifferencePercentage(pricesDifference: number, meatCutsCurrentPricesSum: number) {
    if (pricesDifference) {
      return Math.abs((pricesDifference! / meatCutsCurrentPricesSum) * 100);
    }
    return null;
  }

  public calculateAdjustedPrices(meatDetails: MeatDetails[], pricesDifference: number, meatCutsCurrentPricesSum: number, type: MeatDetailsType): MeatDetails[] {
    if (type === MeatDetailsType.BEEF)
      return this.calculateBeefProductsPrice(meatDetails, pricesDifference, meatCutsCurrentPricesSum);
    if (type === MeatDetailsType.CHICKEN)
      return this.calculateChickenProductsPrice(meatDetails, pricesDifference, meatCutsCurrentPricesSum);

    return [];
  }

  private calculateBeefProductsPrice(meatDetails: MeatDetails[], pricesDifference: number, meatCutsCurrentPricesSum: number) {
    return meatDetails.map(meatDetail => {
        const beefCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
        /* const meatCutAdjustment = pricesDifference * (meatDetail.weight / halfCarcassWeight); */
        const beefCutAdjustment = (beefCutCurrentPrice / meatCutsCurrentPricesSum) * pricesDifference;
        const beefCutNewPrice = beefCutCurrentPrice + beefCutAdjustment;

        const beefProductNewPrice = this.roundToNearestTen(Number((beefCutNewPrice / meatDetail.weight).toFixed(0)));
        return {
          ...meatDetail,
          price: beefProductNewPrice.toString(),
        };
    });
  }

  private calculateChickenProductsPrice(meatDetails: MeatDetails[], pricesDifference: number, meatCutsCurrentPricesSum: number) {
    return meatDetails.map(meatDetail => {
      const chickenCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
      const chickenCutAdjustment = (chickenCutCurrentPrice / meatCutsCurrentPricesSum) * pricesDifference;
      const chickenCutNewPrice = chickenCutCurrentPrice + chickenCutAdjustment;

      const chickenProductNewPrice = this.roundToNearestTen(Number((chickenCutNewPrice / meatDetail.weight).toFixed(0)));
      return {
        ...meatDetail,
        price: chickenProductNewPrice.toString(),
      };
    });
  }

  private roundToNearestTen(value: number): number {
    const lastDigit = value % 10;

    if (lastDigit >= 5) return value + (10 - lastDigit); // Redondear hacia arriba
    else return value - lastDigit; // Redondear hacia abajo
  }
}
