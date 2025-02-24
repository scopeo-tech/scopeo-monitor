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
  