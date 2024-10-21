import { Exam, ExamList, GeneralExam } from "@/models/exam";
import { Class, Homework } from "@/models/homework";
import { Publisher } from "@/models/publishers-and-types";
import { getAuthToken } from "@/utils/util";
export const ExamListService = {

    async getGeneralExamList(): Promise<ExamList[]> {
        const res = await fetch(`${process.env.API_URL}/general-exam/list`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as ExamList[];

    },
    async getGeneralExamDetail(id:string): Promise<GeneralExam> {
        const res = await fetch(`${process.env.API_URL}/general-exam/`+id, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as GeneralExam;

    },

  
};