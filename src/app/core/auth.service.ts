import { Injectable, inject, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import {
  doc,
  docData,
  getDoc,
  Firestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserProfile } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  private profileDoc(uid: string) {
    return doc(this.firestore, 'users', uid);
  }

  readonly user = signal<User | null>(null);
  readonly profile = signal<UserProfile | null>(null);
  readonly isSeller = signal(false);

  private profileSub?: Subscription;
  private readyPromise: Promise<void>;
  private profileReady?: Promise<void>;
  private profileReadyResolve?: () => void;

  constructor() {
    this.readyPromise = new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.user.set(user);
        resolve();
        this.profile.set(null);
        this.isSeller.set(false);
        this.profileSub?.unsubscribe();
        if (user) {
          this.profileReady = new Promise<void>(
            (resolveProfile) => (this.profileReadyResolve = resolveProfile)
          );
          this.ensureProfileDoc(user.uid, user.email ?? '');
          this.profileSub = docData(this.profileDoc(user.uid)).subscribe(
            (data) => {
              const profile = data as UserProfile | undefined;
              this.profile.set(profile ?? null);
              this.isSeller.set(profile?.isSeller ?? false);
              this.profileReadyResolve?.();
            }
          );
        } else {
          this.profileReady = Promise.resolve();
        }
      });
    });
  }

  /**
   * Гарантирует, что Firebase сообщил о состоянии входа и профиль
   * (если пользователь вошёл) загружен из Firestore — важно для guard'ов.
   */
  ensureReady(): Promise<void> {
    return this.readyPromise.then(() => this.profileReady);
  }

  async register(email: string, password: string): Promise<void> {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await setDoc(this.profileDoc(credentials.user.uid), {
      email,
      isSeller: false,
      createdAt: serverTimestamp(),
    });
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  /** Пересоздаёт документ профиля, если регистрация оборвалась до его записи. */
  private async ensureProfileDoc(uid: string, email: string): Promise<void> {
    try {
      const ref = this.profileDoc(uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          email,
          isSeller: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch {
      // Нет доступа к Firestore (правила ещё не опубликованы) — повторим при следующем входе.
    }
  }

  async setSeller(isSeller: boolean): Promise<void> {
    const user = this.user();
    if (!user) return;
    await updateDoc(this.profileDoc(user.uid), { isSeller });
  }
}
