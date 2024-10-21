import { Class, Homework } from "@/models/homework";
import { getAuthToken } from "@/utils/util";
import { signOut } from "next-auth/react";
export const ClassService = {
  
    async getClasses(): Promise<Class[]> {
        const res = await fetch(`${process.env.API_URL}/school/class`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as Class[];

    },
  
};