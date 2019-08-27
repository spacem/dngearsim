import { Item } from './item';

export interface ItemSource {
    name?: string;
    mainDnt?: string;
    potentialDnt?: string;
    potentialDntEx?: string;
    sparkDnt?: string;
    gemSlotDnt?: string;
    enchantDnt?: string;
    enchantDnt2?: string;
    gemDnt?: string;
    partsDnt?: string;
    petDnt?: string;
    petLevelDnt?: string;
    skillDnt?: string;
    skillLevelDnt?: string;
    fixstatDnt?: string;
    type?: string;
    weaponDnt?: string;
    setDnt?: string;
    minLevel?: number;
    minRank?: number;
    ignoreErrors?: boolean;
    loading?: boolean;
    init?: (progress, callback) => void;
    reset?: () => void;
    items?: Item[];
}
