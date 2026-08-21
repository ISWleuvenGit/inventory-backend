import { PriceVariable } from '../model/priceVariable';

export type PriceVariableDTO = {
    id: number;
    name: string;
    value: number;
    type: string;
    isDefault: boolean;
    itemId: number;
};

export const priceVariableToDTO = (pv: PriceVariable): PriceVariableDTO => ({
    id: pv.getId(),
    name: pv.getName(),
    value: pv.getValue(),
    type: pv.getType(),
    isDefault: pv.getIsDefault(),
    itemId: pv.getItemId(),
});

export const priceVariablesToDTO = (pvs: PriceVariable[]): PriceVariableDTO[] =>
    pvs.map(priceVariableToDTO);
