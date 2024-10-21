import { getAuthToken } from "@/utils/util";
import { User } from "next-auth";

export const ProfileService = {

    async getProfile(): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/teacher/profile`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        const data = await res.json();
        return data as any;
    }, 
    async updateProfile(updatedUser: any): Promise<any> {
        const res = await fetch(`${process.env.API_URL}/teacher/profile`, {
            method: 'PUT', // Specify the HTTP method as PUT
            headers: {
                'Content-Type': 'application/json', // Specify the content type as JSON
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${getAuthToken()}`, // Add authorization token
            },
            body: JSON.stringify(updatedUser), // Send the updated user data in the body
        });
    
        if (!res.ok) {
            throw new Error(`Failed to update profile: ${res.statusText}`);
        }
    
        const data = await res.json();
        return data;
    }
    

};