import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserAccount } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  // In a real application, this would be an API endpoint
  private apiUrl = 'api/users';

  // Mock data for demonstration
  private users: UserAccount[] = [
    {
      userId: 'user-1',
      username: 'john.doe',
      fullName: 'John Doe',
      roleName: 'Admin',
      token: 'mock-token-admin',
    },
    {
      userId: 'user-2',
      username: 'jane.smith',
      fullName: 'Jane Smith',
      roleName: 'Server',
      token: 'mock-token-server',
    },
    {
      userId: 'user-3',
      username: 'peter.jones',
      fullName: 'Peter Jones',
      roleName: 'Server',
      token: 'mock-token-server',
    },
  ];

  constructor() {
    // Load users from localStorage if available
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // Save initial mock data to localStorage if not present
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  private saveUsers() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUsers(): Observable<UserAccount[]> {
    // In a real app, this would be an HTTP GET request
    return of(this.users);
  }

  getUserById(id: string): Observable<UserAccount | undefined> {
    return of(this.users.find((user) => user.userId === id));
  }

  createUser(user: Omit<UserAccount, 'userId' | 'token'>): Observable<UserAccount> {
    const newUser: UserAccount = {
      ...user,
      userId: `user-${this.users.length + 1}`,
      token: `mock-token-${user.roleName.toLowerCase()}`,
    };
    this.users.push(newUser);
    this.saveUsers();
    return of(newUser);
  }

  updateUser(updatedUser: UserAccount): Observable<UserAccount> {
    const index = this.users.findIndex((user) => user.userId === updatedUser.userId);
    if (index > -1) {
      this.users[index] = updatedUser;
      this.saveUsers();
      return of(updatedUser);
    }
    return of(); // Or throw an error
  }

  deleteUser(id: string): Observable<boolean> {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.userId !== id);
    this.saveUsers();
    return of(this.users.length < initialLength);
  }
}
