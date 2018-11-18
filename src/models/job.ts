export interface JobData {
    id: number;
    ParentJob: any;
    JobName: any;
    BaseClass: any;
    EnglishName: any;
    JobIcon: any;
    JobNumber: any;
}

export interface Job {
    id: number;
    name: string;
    isClassJob: (cId: number) => boolean;
    d: JobData;
}
