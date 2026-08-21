import { SoldItem } from '../model/soldItem';
import { ItemDTO } from './item.dto';

export interface SoldItemDTO {
    id: number;
    itemId: number;
    finalSellPrice: string;
    priceVariableName: string | null;
    isCustomPrice: boolean;
    payedCash: boolean;
    quantity: number;
    soldAt: string;
    item?: Partial<ItemDTO>;
    createdAt: string;
    updatedAt: string | null;
    totalSellValue?: string;
    totalBuyValue?: string;
    profit?: string;
}

export interface SoldItemAnalyticsDTO {
    summary: {
        totalBuyPrice: string;
        totalSellPrice: string;
        totalProfit: string;
        totalQuantitySold: number;
        totalTransactions: number;
        cashTransactions: number;
        nonCashTransactions: number;
        averageProfit: string;
        profitMargin: string;
    };
    topSellingItems: Array<{
        itemId: number;
        itemName: string;
        totalQuantity: number;
        totalBuyPrice: string;
        totalSellPrice: string;
        totalProfit: string;
        profitMargin: string;
        priceBreakdown: Array<{
            sellPrice: string;
            priceVariableName: string | null;
            quantity: number;
            totalBuy: string;
            totalSell: string;
            profit: string;
        }>;
    }>;
    salesByDay: Array<{
        date: string;
        totalBuyPrice: string;
        totalSellPrice: string;
        totalProfit: string;
        totalQuantity: number;
        transactionCount: number;
        averageTransactionValue: string;
    }>;
    paymentMethodBreakdown: {
        cash: { buyPrice: string; sellPrice: string; profit: string; transactionCount: number };
        nonCash: { buyPrice: string; sellPrice: string; profit: string; transactionCount: number };
    };
    priceVariableBreakdown: Array<{
        priceVariableName: string;
        count: number;
        totalBuyPrice: string;
        totalSellPrice: string;
        totalProfit: string;
        averageProfit: string;
    }>;
}

export function soldItemToDTO(soldItem: SoldItem, includeItem = false): SoldItemDTO {
    const priceVar = (soldItem as any).getPriceVariableName?.() ?? null;
    const createdAt = (soldItem as any).getCreatedAt?.()
        ? (soldItem as any).getCreatedAt().toISOString()
        : new Date().toISOString();
    const updatedAt = (soldItem as any).getUpdatedAt?.()
        ? (soldItem as any).getUpdatedAt().toISOString()
        : null;

    const dto: SoldItemDTO = {
        id: (soldItem as any).getId ? (soldItem as any).getId() : (soldItem as any).id,
        itemId: (soldItem as any).getItemId
            ? (soldItem as any).getItemId()
            : (soldItem as any).itemId,
        finalSellPrice: (soldItem as any).getFinalSellPrice
            ? (soldItem as any).getFinalSellPrice().toString()
            : String((soldItem as any).finalSellPrice),
        priceVariableName: priceVar,
        isCustomPrice: (soldItem as any).getIsCustomPrice
            ? (soldItem as any).getIsCustomPrice()
            : !!(soldItem as any).isCustomPrice,
        payedCash: (soldItem as any).isPayedCash
            ? (soldItem as any).isPayedCash()
            : !!(soldItem as any).payedCash,
        quantity: (soldItem as any).getQuantity
            ? (soldItem as any).getQuantity()
            : (soldItem as any).quantity,
        soldAt:
            ((soldItem as any).getSoldAt
                ? (soldItem as any).getSoldAt()
                : (soldItem as any).soldAt
            )?.toISOString?.() || new Date((soldItem as any).soldAt || Date.now()).toISOString(),
        createdAt,
        updatedAt,
    };

    const sellPrice = (soldItem as any).getFinalSellPrice
        ? (soldItem as any).getFinalSellPrice()
        : (soldItem as any).finalSellPrice;
    if (sellPrice && dto.quantity != null) {
        try {
            const asNum = typeof sellPrice === 'number' ? sellPrice : Number(sellPrice);
            dto.totalSellValue = (asNum * dto.quantity).toFixed(2);
        } catch {
            // Silently ignore conversion errors, leave totalSellValue undefined
        }
    }

    if (includeItem && (soldItem as any).getItem) {
        const item = (soldItem as any).getItem();
        if (item) {
            const buyPrice = (item as any).getBuyPrice
                ? (item as any).getBuyPrice()
                : (item as any).buyPrice;
            dto.item = {
                id: (item as any).getId ? (item as any).getId() : (item as any).id,
                name: (item as any).getName ? (item as any).getName() : (item as any).name,
                buyPrice: buyPrice?.toString?.() || String(buyPrice),
                inventoryId: (item as any).getInventoryId
                    ? (item as any).getInventoryId()
                    : (item as any).inventoryId,
            } as any;
            try {
                const buyNum = typeof buyPrice === 'number' ? buyPrice : Number(buyPrice);
                const sellNum = typeof sellPrice === 'number' ? sellPrice : Number(sellPrice);
                dto.totalBuyValue = (buyNum * dto.quantity).toFixed(2);
                dto.profit = (sellNum * dto.quantity - buyNum * dto.quantity).toFixed(2);
            } catch {
                // Silently ignore conversion errors, leave values undefined
            }
        }
    }

    return dto;
}

export function soldItemsToDTO(soldItems: SoldItem[], includeItems = false): SoldItemDTO[] {
    return soldItems.map((item) => soldItemToDTO(item, includeItems));
}

export function analyticsToDTO(analytics: any): SoldItemAnalyticsDTO {
    return {
        summary: {
            totalBuyPrice: Number(analytics.summary.totalBuyPrice ?? 0).toFixed(2),
            totalSellPrice: Number(analytics.summary.totalSellPrice ?? 0).toFixed(2),
            totalProfit: Number(analytics.summary.totalProfit ?? 0).toFixed(2),
            totalQuantitySold: analytics.summary.totalQuantitySold ?? 0,
            totalTransactions: analytics.summary.totalTransactions ?? 0,
            cashTransactions: analytics.summary.cashTransactions ?? 0,
            nonCashTransactions: analytics.summary.nonCashTransactions ?? 0,
            averageProfit:
                analytics.summary.totalTransactions > 0
                    ? (
                          Number(analytics.summary.totalProfit) /
                          Number(analytics.summary.totalTransactions)
                      ).toFixed(2)
                    : '0.00',
            profitMargin:
                Number(analytics.summary.totalSellPrice) > 0
                    ? (
                          (Number(analytics.summary.totalProfit) /
                              Number(analytics.summary.totalSellPrice)) *
                          100
                      ).toFixed(2)
                    : '0.00',
        },
        topSellingItems: (analytics.topSellingItems ?? []).map((item: any) => ({
            itemId: item.itemId,
            itemName: item.itemName,
            totalQuantity: item.totalQuantity,
            totalBuyPrice: Number(item.totalBuyPrice ?? 0).toFixed(2),
            totalSellPrice: Number(item.totalSellPrice ?? 0).toFixed(2),
            totalProfit: Number(item.totalProfit ?? 0).toFixed(2),
            profitMargin:
                Number(item.totalSellPrice) > 0
                    ? ((Number(item.totalProfit) / Number(item.totalSellPrice)) * 100).toFixed(2)
                    : '0.00',
            priceBreakdown: (item.priceBreakdown ?? []).map((pb: any) => ({
                sellPrice: Number(pb.sellPrice ?? 0).toFixed(2),
                priceVariableName: pb.priceVariableName ?? null,
                quantity: pb.quantity ?? 0,
                totalBuy: Number(pb.totalBuy ?? 0).toFixed(2),
                totalSell: Number(pb.totalSell ?? 0).toFixed(2),
                profit: Number(pb.profit ?? 0).toFixed(2),
            })),
        })),
        salesByDay: (analytics.salesByDay ?? []).map((day: any) => ({
            date: day.date,
            totalBuyPrice: Number(day.totalBuyPrice ?? 0).toFixed(2),
            totalSellPrice: Number(day.totalSellPrice ?? 0).toFixed(2),
            totalProfit: Number(day.totalProfit ?? 0).toFixed(2),
            totalQuantity: day.totalQuantity ?? 0,
            transactionCount: day.transactionCount ?? 0,
            averageTransactionValue:
                day.transactionCount > 0
                    ? (Number(day.totalSellPrice) / Number(day.transactionCount)).toFixed(2)
                    : '0.00',
        })),
        paymentMethodBreakdown: {
            cash: {
                buyPrice: Number(analytics.paymentMethodBreakdown?.cash?.buyPrice ?? 0).toFixed(2),
                sellPrice: Number(analytics.paymentMethodBreakdown?.cash?.sellPrice ?? 0).toFixed(
                    2,
                ),
                profit: Number(analytics.paymentMethodBreakdown?.cash?.profit ?? 0).toFixed(2),
                transactionCount: analytics.paymentMethodBreakdown?.cash?.transactionCount ?? 0,
            },
            nonCash: {
                buyPrice: Number(analytics.paymentMethodBreakdown?.nonCash?.buyPrice ?? 0).toFixed(
                    2,
                ),
                sellPrice: Number(
                    analytics.paymentMethodBreakdown?.nonCash?.sellPrice ?? 0,
                ).toFixed(2),
                profit: Number(analytics.paymentMethodBreakdown?.nonCash?.profit ?? 0).toFixed(2),
                transactionCount: analytics.paymentMethodBreakdown?.nonCash?.transactionCount ?? 0,
            },
        },
        priceVariableBreakdown: (analytics.priceVariableBreakdown ?? []).map((pv: any) => ({
            priceVariableName: pv.priceVariableName,
            count: pv.count ?? 0,
            totalBuyPrice: Number(pv.totalBuyPrice ?? 0).toFixed(2),
            totalSellPrice: Number(pv.totalSellPrice ?? 0).toFixed(2),
            totalProfit: Number(pv.totalProfit ?? 0).toFixed(2),
            averageProfit:
                pv.count > 0 ? (Number(pv.totalProfit) / Number(pv.count)).toFixed(2) : '0.00',
        })),
    };
}
