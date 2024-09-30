import { Test, TestingModule } from '@nestjs/testing';
import { mockFirebase } from 'firestore-jest-mock';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseApp } from '../firebase/firebase-app';
import { UploadService } from '../constants/common/storage/google-cloud-storage.service';
import { api_response } from '../constants/utility/response';
import { CreateUserDto } from '../database/dto/user.dto';


jest.mock('../constants/common/storage/google-cloud-storage.service');
jest.mock('../constants/utility/response')
jest.mock('firestore-jest-mock')

jest.mock('../firebase/firebase-app', () => ({
  FirebaseApp: jest.fn(() => ({
    getAuth: jest.fn(() => ({
      getUserByEmail: jest.fn(),
      verifyIdToken: jest.fn(),
    })),
    firestore: jest.fn(() => ({
      collection: jest.fn((collectionPath) => ({
        doc: jest.fn((documentPath) => ({
          get: jest.fn(),
          set: jest.fn(),
        })),
        get: jest.fn()
      })),
    })),
  })),
  api_response: jest.fn(),
}));

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let mockFirebaseApp = new mockFirebase();
  let mockUploadService: jest.Mocked<UploadService>;

  beforeEach(async () => {
    mockFirebaseApp = new FirebaseApp() as jest.Mocked<FirebaseApp>;
    mockUploadService = new UploadService() as jest.Mocked<UploadService>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthController,
        AuthService,
        {
          provide: FirebaseApp,
          useValue: mockFirebaseApp,
        },
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
  });

  describe('Defined', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });
  })

  describe('AuthController', () => {
    describe('signup', () => {
      it('should create a user successfully', async () => {
        const createUserDto: CreateUserDto = {
          email: 'johndoe@gmail.com',
          password: 'test@123',
          role: 'qIUBfRO2r6Wt4tafxZVT',
          name: 'Test User',
          createdAt: '2024-02-22 18:16:49',
          updatedAt: '2024-02-22 18:16:49'
        };
        const result = await authController.create(createUserDto);
        expect(result).toEqual(api_response([], 201, 'User registered successfully'));
      });  
    });
  })


});
