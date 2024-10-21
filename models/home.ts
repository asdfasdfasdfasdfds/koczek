export interface GeneralInformations{
    totalStudentCount: number,
    activeStudentCount: number,
    waitingRoomCount: number,
    generalExamCount: number
}
export interface Notification {
    message: string;
    createdAt: string; // You can use Date type if it's parsed as a Date object
    updatedAt: string; // Same here, could be Date type if necessary
    _id: string;
}
