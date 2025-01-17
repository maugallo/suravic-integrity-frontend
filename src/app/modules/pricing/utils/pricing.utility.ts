import { ProductWithMeatDetails } from "../../products/models/product.model";

export function calculateMainCutGrossCost(mainCutCostPerKg: number, mainCutWeight: number) {
    return mainCutCostPerKg * mainCutWeight;
}

export function calculateMainCutSellingCost(mainCutGrossCost: number, profitPercentage: number) {
    return mainCutGrossCost + (mainCutGrossCost * (profitPercentage / 100));
}

export function calculateMeatCutsCurrentPricesSum(meatDetailProducts: ProductWithMeatDetails[]) {
    return meatDetailProducts.reduce((accumulatedSum, product) => accumulatedSum + (product.weight * Number(product.price)), 0);
}

export function calculatePricesDifference(mainCutSellingCost: number, profitPercentage: number, meatCutsCurrentPricesSum: number) {
    if (mainCutSellingCost > 0 && profitPercentage > 0 && meatCutsCurrentPricesSum > 0) {
        return mainCutSellingCost - meatCutsCurrentPricesSum;
    }
    return null;
}

export function calculatePricesDifferencePercentage(pricesDifference: number, meatCutsCurrentPricesSum: number) {
    if (pricesDifference) {
        return Math.abs((pricesDifference! / meatCutsCurrentPricesSum) * 100);
    }
    return null;
}

export function calculateAdjustedPrices(meatDetails: ProductWithMeatDetails[], pricesDifference: number, meatCutsCurrentPricesSum: number): ProductWithMeatDetails[] {
    return meatDetails.map(meatDetail => {
        const meatCutCurrentPrice = meatDetail.weight * Number(meatDetail.price);
        const meatCutAdjustment = (meatCutCurrentPrice / meatCutsCurrentPricesSum) * pricesDifference;
        const meatCutNewPrice = meatCutCurrentPrice + meatCutAdjustment;

        const meatDetailNewPrice = roundToNearestTen(Number((meatCutNewPrice / meatDetail.weight).toFixed(0))).toString();
        return {
            ...meatDetail,
            price: meatDetailNewPrice
        }
    });
}

function roundToNearestTen(value: number): number {
    const lastDigit = value % 10;

    if (lastDigit >= 5) return value + (10 - lastDigit); // Redondear hacia arriba
    else return value - lastDigit; // Redondear hacia abajo
}