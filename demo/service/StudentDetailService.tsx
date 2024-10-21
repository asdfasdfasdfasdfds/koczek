import { getAuthToken } from "@/utils/util";

export const StudentDetailService = {

    async getStudentGeneralInformations(id: String): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/school/students/${id}/general-informations`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as any;
    },

   async getStudentStatistics(id: String): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/school/students/${id}/statistic`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as any;
    },

    async getStudentExamList(id: String): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/school/students/${id}/exam-list`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as any;
    },

    
    async getStudentExamDetail(id: String,examId:string): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/school/students/${id}/exam-detail/${examId}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as any;
    },
  
};