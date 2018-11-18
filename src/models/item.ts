import { Stat } from './stat';

export interface Item {
    row?: any;
    potential?: any;
    id?: number;
    itemSource?: string;
    levelLimit?: number;
    needJobClass?: number;
    typeId?: any;
    exchangeType?: any;
    rank?: any;
    pid?: any;
    name?: string;
    stats?: any[];
    potentialRatio?: any;
    typeName?: any;
    sparkId?: any;
    gemSlot?: any;
    setId?: any;
    enchantmentNum?: number;
    enchantmentId?: any;
    offensiveGemSlots?: number;
    increasingGemSlots?: number;
    dragonjeweltype?: any;
    icon?: any;
    fileName?: string;
    description?: string;

    setStats?: Stat[];
    fullStats?: Stat[];
    enchantmentStats?: Stat[];
    sparkStats?: Stat[];
}
