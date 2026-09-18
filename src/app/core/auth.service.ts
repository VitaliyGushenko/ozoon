import { Injectable, computed, inject, signal } from '@angular/core';
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
} from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
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

  /** Роли пересекаются; покупатель — неявная роль любого пользователя. */
  readonly isAdmin = computed(() => this.user()?.email === environment.adminEmail);
  readonly isModerator = computed(() => this.profile()?.roles?.moderator === true);
  readonly isSeller = computed(
    () =>
      this.profile()?.roles?.seller === true ||
      // легаси: профили, созданные до появления ролей
      this.profile()?.isSeller === true
  );

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
        this.profileSub?.unsubscribe();
        if (user) {
          this.profileReady = new Promise<void>(
            (resolveProfile) => (this.profileReadyResolve = resolveProfile)
          );
          this.ensureProfileDoc(user.uid, user.email ?? '');
          this.profileSub = docData(this.profileDoc(user.uid)).subscribe(
            (data) => {
              this.profile.set((data as UserProfile) ?? null);
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
}
