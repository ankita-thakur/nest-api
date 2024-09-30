import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import { FirebaseApp } from '../firebase/firebase-app';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }

  use(req: Request, res: Response, next: () => void) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.auth
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          req['user'] = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.userRole || null,
            type: decodedToken.type,
          };
          next();
        })
        .catch(() => {
          AuthMiddleware.accessDenied(req.url, res);
        });
    } else {
      AuthMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Token is not valid',
    });
  }
}

@Injectable()
export class EventMiddleware implements NestMiddleware {
  private auth: firebase.auth.Auth;

  constructor(private firebaseApp: FirebaseApp) {
    this.auth = firebaseApp.getAuth();
  }

  use(req: any, res: Response, next: () => void) {
    if (req.user) {
      if (
        req.user['role'] === "admin" ||
        (req.user['role'] === "user" && !req.url.includes('/admin/'))
      ) {
        next();
      } else {
        EventMiddleware.accessDenied(req.url, res);
      }
    } else {
      EventMiddleware.accessDenied(req.url, res);
    }
  }

  private static accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: "You don't have permission to perform this action",
    });
  }
}
