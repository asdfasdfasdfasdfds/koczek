import { Notification } from "@/models/home";
import { GeneralInformations } from "@/models/home";
import { Class, Homework } from "@/models/homework";
import { LastExam } from "@/models/last-exam";
import { Student, StudentResponse } from "@/models/student";
import { getAuthToken } from "@/utils/util";
import { signOut } from "next-auth/react";
export const HomeService = {

    async getLastExams(): Promise<LastExam[]> {
        const res = await fetch(`${process.env.API_URL}/school/home/last-exam`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        if(res.status == 401) signOut();
        if(res.status == 500) return [];
        if(res.status == 404) return [];

        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();
        return data as LastExam[];

    },

    async getGeneralInformations(): Promise<GeneralInformations> {
        const res = await fetch(`${process.env.API_URL}/school/home/general-informations`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as GeneralInformations;

    },

    async getNotifications(): Promise<Notification[]> {
        const res = await fetch(`${process.env.API_URL}/school/home/notifications`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as Notification[];

    },



};