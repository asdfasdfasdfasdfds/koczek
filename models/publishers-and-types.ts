// Define the Lesson interface
export interface Lesson {
    _id: string;
    // Add other properties of a lesson if needed
}

// Define the ExamType interface
export interface ExamType {
    _id: string;
    name: string;
    examCount: number;
    fileCount: number;
    lessons: Lesson[];
}
export interface Type {
    _id: string;
    name: string;
    examCount?:number;
    fileCount?:number;
    lessons: Lesson[];
    // Include any other properties as needed
}
// Define the Publisher interface
export interface Publisher {
    _id: string;
    name: string;
    examCount: number;
    types: Type[];
}
interface TypeId {
    _id: string;
    name: string;
    fileCount: number;
    lessons: any[]; // Define the correct type for lessons if needed
    examCount: number;
}
// Define the Exam interface if needed
export interface PublisherExam {
    _id: string;
    name: string;
    typeId?: TypeId; // Add this line if typeId is optional
    createdAt: string;
    publisher: {
        _id: string;
        name: string;
    };
    type: Array<{
        _id: string;
        lessons: Array<{
            name: string; // Add other properties of lessons if needed
        }>;
    }>;
}
