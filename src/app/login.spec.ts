import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { UserAccount } from './types/pos.types';
import { environment } from '../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiBaseUrl}/Account/login`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to the login API', () => {
    const mockUser: UserAccount = {
      userId: '1',
      username: 'testuser',
      password: '',
    };
    const credentials = { userName: 'testuser', password: 'demodemo' };

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockUser);
  });
});
