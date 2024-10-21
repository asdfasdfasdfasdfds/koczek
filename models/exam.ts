import { GeneralExamDetail } from "./general-exam";
import { LastExam } from "./last-exam";

export interface Publisher {
    _id: string;
    name: string;
    examCount: number;
    types: Type[];
}
export interface Type {
    _id: string;
    name: string;
    lessons: Lesson[]; // Add the lessons property to match the Type interface in models/publishers-and-types

    // Include any other properties as needed
}
export interface Lesson {
    _id: string;
    name: string;

    // Add any additional properties for Lesson here if needed
}

export interface ExamType {
    _id: string;
    name: string;
    lessons: Lesson[];
}

export interface Exam {

    _id: string;
    name: string;
    createdAt: string; // or Date if you prefer to work with Date objects
    publisher: Publisher;
    type: ExamType[];
}
export interface GeneralExam {
    details: {
        _id: string;
        type: Type[];
        subExams: string[];
        publisher: Publisher;
        files: string[];
        createdAt: string;
        updatedAt: string;
        mergedResults:LastExam[];
        MIS:GeneralExamDetail[];
        [key: string]: any; // Allows for dynamic property names
    }
}

export interface ExamList {
    name: string;
    id: string;
    createdAt: string;
}