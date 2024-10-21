import { Class, Homework } from "@/models/homework";
import { LastExam } from "@/models/last-exam";
import { Student, StudentResponse } from "@/models/student";
import { getAuthToken } from "@/utils/util";
export const StudentService = {

    async getStudents(): Promise<Student[]> {
        const res = await fetch(`${process.env.API_URL}/school/students`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();

        return data.students as Student[];

    },

    getStudentsDemo() {
        return fetch('/demo/data/home.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any);
    },

};