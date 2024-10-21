import { Exam, GeneralExam } from "@/models/exam";
import { Class, Homework } from "@/models/homework";
import { Publisher } from "@/models/publishers-and-types";
import { getAuthToken } from "@/utils/util";
import { signOut } from "next-auth/react";
export const ExamResultAddService = {

    async getExamResultsAdd(): Promise<Exam[]> {
        const res = await fetch(`${process.env.API_URL}/general-exam`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as Exam[];

    },
  

    async getPublishersAndTypes(): Promise<Publisher[]> {
        const res = await fetch(`${process.env.API_URL}/publisher-and-types`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as Publisher[];

    },

};