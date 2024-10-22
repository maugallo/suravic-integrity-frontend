import { Injectable } from '@angular/core';
import { MeatProduct } from '../models/meat-product.model';

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

  public calculateTotalMeatCutPrice(meatProducts: MeatProduct[]): number {
    return meatProducts.reduce((accumulatedSum, meatProduct) => accumulatedSum + (meatProduct.weight * Number(meatProduct.price)), 0);
  }

  public calculateAdjustedPrices(meatProducts: MeatProduct[], pricesDifference: number, halfCarcassWeight: number): MeatProduct[] {
    return meatProducts.map(meatProduct => {
      if (meatProduct.id === 16) {
        return {
          ...meatProduct,
          price: ((meatProduct.weight * Number(meatProduct.price)) / 10).toFixed(1),
        };
      } else {
        const meatCutCurrentPrice = meatProduct.weight * Number(meatProduct.price);
        const meatCutAdjustment = pricesDifference * (meatProduct.weight / halfCarcassWeight);
        const meatCutNewPrice = meatCutCurrentPrice + meatCutAdjustment;
        const meatProductNewPrice = this.roundToNearestTen(Number((meatCutNewPrice / meatProduct.weight).toFixed(0)));
        
        return {
          ...meatProduct,
          price: meatProductNewPrice.toString(),
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
