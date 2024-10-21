
export interface Homework {
    date: string | number | Date;
    _id: string;
    classes: Class[];
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    effort: string;
    files:File[];
}


interface File {
    id?: string;
    name: string;
   
}

export interface Class {
    _id?: string;
    name: string;
    level: number;
   
}

export interface CreateHomework {
    _id: string;
    classes: string[]; // Change this to string[] if the API expects an array of IDs
    title: string;
    content: string;
    startDate: string;
    endDate: string;
}