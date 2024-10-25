import { Injectable } from '@angular/core';
import { MeatDetails } from '../models/meat-details.model';

@Injectable({
  providedIn: 'root'
})
export class MeatPricingService {

  public calculateHalfCarcassGrossCost(halfCarcassCostPerKg: number, halfCarcassWeight: number): number {
    return halfCarcassCostPerKg * halfCarcassWeight;
  }

  public calculateHalfCarcassSellingPrice(grossCost: number, profitPercentage: number): number {
    return grossCost + (grossCost * (profitPercentage / 100));
  }

  public calculateTotalMeatCutPrice(meatDetails: MeatDetails[]): number {
    return meatDetails.reduce((accumulatedSum, meatDetail) => accumulatedSum + (meatDetail.weight * Number(meatDetail.price)), 0);
  }

  public calculateAdjustedPrices(meatDetails: MeatDetails[], pricesDifference: number, halfCarcassWeight: number): MeatDetails[] {
    return meatDetails.map(meatDetail => {
      if (meatDetail.id === 16) {
        return {
          ...meatDetail,
          price: ((meatDetail.weight * Number(meatDetail.price)) / 10).toFixed(1),
        };
      } else {
        const meatCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
        const meatCutAdjustment = pricesDifference * (meatDetail.weight / halfCarcassWeight);
        const meatCutNewPrice = meatCutCurrentPrice + meatCutAdjustment;
        const meatDetailNewPrice = this.roundToNearestTen(Number((meatCutNewPrice / meatDetail.weight).toFixed(0)));
        
        return {
          ...meatDetail,
          price: meatDetailNewPrice.toString(),
        };
      }
    });
  }

  public calculatePricesDifference(halfCarcassSellingPrice: number, profitPercentage: number, meatCutCurrentPricesTotal: number) {
    if (halfCarcassSellingPrice > 0 && profitPercentage > 0 && meatCutCurrentPricesTotal > 0) {
      return halfCarcassSellingPrice - meatCutCurrentPricesTotal;
    }
    return null;
  }

  public calculatePricesDifferencePercentage(pricesDifference: number, meatCutCurrentPricesTotal: number) {
    if (pricesDifference) {
      return Math.abs((pricesDifference! / meatCutCurrentPricesTotal) * 100);
    }
    return null;
  }

  private roundToNearestTen(value: number): number {
    const lastDigit = value % 10;

    if (lastDigit >= 5) return value + (10 - lastDigit); // Redondear hacia arriba
    else return value - lastDigit; // Redondear hacia abajo
  }
  
}
