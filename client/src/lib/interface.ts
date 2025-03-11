export interface User {
    _id: string;
    username: string;
    email: string;
  }

export interface userDetails {
    _id: string;
    username: string;
    email: string;
    joinedDate: string;
    googleId?: string;
  }

export interface Project {
    _id: string;
    name: string;
    apiKey: string;
    passKey: string;
    notificationStatus: boolean;
    created: Date;
    status: { connectionStatus: boolean; updatedAt: Date };
  }


export interface ErrorLog {
  statusCode: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  message: string;
  createdAt: string;
  _id?: string;
  projectId?: string;
  __v?: number;
}

export interface Log {
  _id: string;
  message: string;
  level: string;
  statusCode: number;
  method: string;
  duration: number;
  route: string;
  project: string;
  __v: number;
}