interface Task {
    completedAt: string | null;
    taskId: TaskDetails;
    state: number;
    _id: string;
  }
  
  interface TaskDetails {
    _id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
  }
  
  export interface HomeworkDetail {
    _id: string;
    name: string;
    surname: string;
    tasks: Task[];
  }