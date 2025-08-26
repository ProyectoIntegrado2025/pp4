export class Task{
    taskId: any;
    assignedGroupId: string;
    assignedUserId: string;
    tittle: string;
    createdAt: Date;
    status: string;
    description: string;
    endAt: Date;

    constructor() {
        this.assignedGroupId = "";
        this.assignedUserId = "";
        this.tittle = "";
        this.createdAt = new Date();
        this.status = "";
        this.description = "";
        this.endAt = new Date();
    }
}