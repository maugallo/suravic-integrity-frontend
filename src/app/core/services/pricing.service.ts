import { Injectable } from '@angular/core';
import { MeatDetails } from '../models/interfaces/meat-details.model';

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

  public calculateAdjustedPrices(meatDetails: MeatDetails[], pricesDifference: number, meatCutsCurrentPricesSum: number): MeatDetails[] {
    return meatDetails.map(meatDetail => {
      const meatCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
      const meatCutAdjustment = (meatCutCurrentPrice / meatCutsCurrentPricesSum) * pricesDifference;
      const meatCutNewPrice = meatCutCurrentPrice + meatCutAdjustment;

      const meatDetailNewPrice = this.roundToNearestTen(Number((meatCutNewPrice / meatDetail.weight).toFixed(0))).toString();
      return {
        ...meatDetail,
        price: meatDetailNewPrice
      }
    });
  }

  private roundToNearestTen(value: number): number {
    const lastDigit = value % 10;

    if (lastDigit >= 5) return value + (10 - lastDigit); // Redondear hacia arriba
    else return value - lastDigit; // Redondear hacia abajo
  }
}
