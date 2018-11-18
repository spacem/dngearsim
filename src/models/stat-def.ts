import { Stat } from './stat';

export interface StatDef {
    id: number;
    name: string;
    display: (stat: Stat) => any;
    element?: string;
    pc?: number;
    skPc?: number;
    combineWith?: number;
    altStat?: number;
    summaryFor?: number;
    searchable?: boolean;
    quickHigh?: boolean;
    dps?: boolean;
    def?: boolean;
    hide?: boolean;
    noCustom?: boolean;
    summaryDisplay?: boolean;
    addTo?: number;
    hideIf?: number;
}
