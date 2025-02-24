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
  }
  