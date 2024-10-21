import { Homework } from "@/models/homework";
import { HomeworkDetail } from "@/models/homework-detail";
import { getAuthToken } from "@/utils/util";

export const HomeworksService = {
    async getHomeworks(): Promise<Homework[]> {
        const res = await fetch(`${process.env.API_URL}/task`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();

        return data.tasks as Homework[];

    },
    async getHomeWorkDetail({ classId, taskId }: { classId: string; taskId: string }): Promise<HomeworkDetail[]> {
        const res = await fetch(`${process.env.API_URL}/task/detail?classId=${classId}&taskId=${taskId}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();

        return data as HomeworkDetail[];

    },
    async getDownload(url:string): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/${url}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();

        return data as any;

    },
  
};