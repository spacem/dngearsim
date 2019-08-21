import { Stat } from './stat';

export interface Build {
    enemyLevel?: any;
    playerLevel?: any;
    heroLevel?: any;
    job?: any;
    damageType?: any;
    element?: any;
    secondaryElement?: any;
    critResist?: any;
    eleResist?: any;
    enemyStatCaps?: any;
    playerStatCaps?: any;
    conversions?: any;
    baseStats?: Stat[];
    heroStats?: Stat[];
    heroTitleStats?: Stat[];
}
