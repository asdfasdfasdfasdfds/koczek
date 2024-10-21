
interface ExamResult {
    totalTrue: number;
    totalFalse: number;
    totalPass: number;
    totalNet: number;
    totalPoint: number;
    _id: string;
}

interface Subject {
    subjectId: {
        _id: string;
        subject: string;
    };
    true: number;
    false: number;
    pass: number;
    _id: string;
}

interface LessonResult {
    lessonId: {
        _id: string;
        name: string;
    };
    true: number;
    false: number;
    pass: number;
    net: number;
    subjects: Subject[];
    _id: string;
}

interface ExamRank {
    schoolRank: number;
    classRank: number;
    _id: string;
}

export interface GeneralExamDetail {
    _id: string;
    generalExamId: string;
    subExamId: string;
    name: string;
    schoolNumber: number;
    class: string;
    examType: string;
    examRank: ExamRank;
    generalResult: ExamResult;
    lessonResults: LessonResult[];
    __v: number;
}
