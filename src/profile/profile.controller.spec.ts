import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { mockFirebase } from 'firestore-jest-mock';
import { UploadService } from '../constants/common/storage/google-cloud-storage.service';
import { FirebaseApp } from '../firebase/firebase-app';
import { api_response } from '../constants/utility/response';

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

describe('ProfileController', () => {
  let controller: ProfileController;
  let mockFirebaseApp = new mockFirebase();
  let mockUploadService: jest.Mocked<UploadService>;

  beforeEach(async () => {
    
    mockFirebaseApp = new FirebaseApp() as jest.Mocked<FirebaseApp>;
    mockUploadService = new UploadService() as jest.Mocked<UploadService>;
    mockUploadService.uploadFile.mockResolvedValue(
      'https://storage.googleapis.com/thisbucket/thisfile',
    );
    mockUploadService.uploadQrCode.mockResolvedValue(
      'https://storage.googleapis.com/thisbucket/thisqrcode',
    );
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileController,
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

    controller = app.get(ProfileController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
