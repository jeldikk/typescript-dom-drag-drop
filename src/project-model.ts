namespace App {

    // enum for specifying the project status, active or finished
    export enum ProjectStatus {
        Active,
        Finished
    }

    export interface ProjectDetail {
        id: string;
        title: string;
        description: string;
        peopleCount: number;
        status?: ProjectStatus;
    }
}