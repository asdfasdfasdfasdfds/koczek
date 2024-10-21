
export interface WaitingStudent {
    _id: string;
    name: string;
    surname: string;
    school: string;
    schoolNumber: number;
   
}


export interface Student {
  id: string;
  name: string;
  class: string;
  successRate: number;
  workTime: number;
  schoolNumber: number;
  }

export interface StudentResponse {
  student: Student[];
}
