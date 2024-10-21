export interface LastExam {
    generalExamId: string;
    subExamIds: string[];
    schoolNumber: number;
    class?:string
    name: string;
    generalRanks: any[]; // Define the actual type if the structure is known
    examRank: {
        schoolRank: number;
        classRank: number;
        _id: string;
    };
    lessonResults: LessonResult[];
    generalResult: GeneralResult;
}

interface LessonResult {
    lessonId: LessonId;
    true: number;
    false: number;
    pass: number;
    net: number;
    subjects: SubjectResult[];
    _id: string;
}

interface LessonId {
    _id: string;
    name: string;
}

interface SubjectResult {
    subjectId: SubjectId;
    true: number;
    false: number;
    pass: number;
    _id: string;
}

interface SubjectId {
    _id: string;
    subject: string;
}

interface GeneralResult {
    totalTrue: number;
    totalFalse: number;
    totalPass: number;
    totalNet: number;
    totalPoint: number;
}
