interface SchoolClass {
    _id: string; // Identifier for the school class
    name: string; // Name of the school class
    level: number; // Level of the school class
}

export interface StudentStatistics {
    name: string; // Name of the student
    schoolNumber: number | null; // School number (nullable)
    schoolClass: SchoolClass; // Reference to the SchoolClass interface
    school: {
        _id: string; // Identifier for the school
        name: string; // Name of the school
    }; // School name (nullable)
    generalProgressStatistic: number; // General progress statistic
    examCount: number; // Count of exams taken
    generalSuccessRate: number; // Success rate in percentage
    finishedSubjects: number; // Count of finished subjects
    solvedTestCount: number; // Count of tests solved
}

interface SuccessRate {
    true: number;    // Number of correct answers
    false: number;   // Number of incorrect answers
    pass: number;    // Number of passed exams
    rate: number;    // Success rate percentage
}

export interface SubjectStatistics {
    name: string;            // Name of the subject
    successRate: SuccessRate; // Success rate data
    statisticProgress: number; // Progress statistic
}

export interface StudentSubjects {
    matematik: SubjectStatistics;      // Statistics for Mathematics
    fen: SubjectStatistics;             // Statistics for Science
    turkce: SubjectStatistics;          // Statistics for Turkish
    ingilizce: SubjectStatistics;       // Statistics for English
    din: SubjectStatistics;              // Statistics for Religious Culture and Moral Knowledge
    inkilap: SubjectStatistics;         // Statistics for History of Revolution
}
