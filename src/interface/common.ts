export interface category{
    id:number,
    name:string,
    createdDate:Date,
    totalProducts:number
}
export interface categoryEdit{
    id:number,
    name:string,
}
export interface Task {
    id:number;
    name: string;
    completed: boolean;
    subtasks?: Task[];
  }
