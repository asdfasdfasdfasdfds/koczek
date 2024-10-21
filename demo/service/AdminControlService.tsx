import { Class, Homework } from "@/models/homework";
import {  WaitingStudent } from "@/models/student";
import { getAuthToken } from "@/utils/util";
import { signOut } from "next-auth/react";

export const AdminControlService = {
  
    async getWaitingStudents(): Promise<WaitingStudent[]> {
        const res = await fetch(`${process.env.API_URL}/school/waiting-room`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as WaitingStudent[];
    },
    async getCodes(): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/invite-code`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();
        
        return data as any;
    },
    async generateCode(expDate:string): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/invite-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Ensure correct content type for JSON
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify({ expDate: expDate })

        });
        const data = await res.json();
        if (data.message == "Token verification failed.") signOut();

        return data as any;
    },

    async assignClassToStudents(assignments: { studentId: string; classId: string }[]): Promise<void> {
        try {
            const res = await fetch(`${process.env.API_URL}/school/approve`, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: assignments })
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const data = await res.json();
        if (data.message == "Token verification failed.") signOut();
            

        } catch (error) {
            console.error("Failed to assign class to students:", error);
            throw error; // Rethrow the error for further handling if needed
        }
    },
  
};
