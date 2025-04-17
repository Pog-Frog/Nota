import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  updateProfile,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import { auth } from '../api/firebase';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  autoLogin: () => Promise<void>;
}


const serializeUser = (user: User | null): { uid: string; email: string | null; displayName: string | null } | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
};

const deserializeUser = (data: { uid: string; email: string | null; displayName: string | null } | null): User | null => {
  if (!data) return null;
  return {
    ...data
  } as unknown as User;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);

          set({
            isAuthenticated: true,
            user: userCredential.user,
            isLoading: false
          });

          toast.info("Welcome back!");
        } catch (error: unknown) {
          const errorMessage = formatFirebaseError(error);
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (email: string, password: string, displayName?: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);

          if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
            await userCredential.user.reload();
          }

          const updatedUser = auth.currentUser;

          set({
            isAuthenticated: true,
            user: updatedUser,
            isLoading: false
          });

          toast.success("Account created successfully!");
        } catch (error: unknown) {
          const errorMessage = formatFirebaseError(error);
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await auth.signOut();

          set({
            isAuthenticated: false,
            user: null,
            isLoading: false
          });

          toast.info("You've logged out successfully!");
        } catch (error: unknown) {
          const errorMessage = formatFirebaseError(error);
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      autoLogin: async () => {
        set({ isLoading: true });
        try {
          await new Promise<void>((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
              unsubscribe();
              if (user) {
                set({
                  isAuthenticated: true,
                  user,
                  isLoading: false
                });
                resolve();
              } else {
                set({
                  isAuthenticated: false,
                  user: null,
                  isLoading: false
                });
                resolve();
              }
            }, (error) => {
              console.error("Error in onAuthStateChanged listener:", error);
              set({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: formatFirebaseError(error)
              });

              unsubscribe();
              reject(error);
            });
          });
        } catch (error: unknown) {
          const errorMessage = formatFirebaseError(error);
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: serializeUser(state.user)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
          // Rehydrate the user object
          state.user = deserializeUser(state.user);
        }
      }
    }
  )
);

function formatFirebaseError(error: unknown): string {
  const errorMessage = error instanceof Error && error.message as string || "An error occurred!";

  return errorMessage
    .replace("Firebase: Error (auth/", "")
    .replace(")", "")
    .replace(/-/g, " ")
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function setIsAuthenticated(isAuthenticated: boolean) {
  useAuthStore.setState({ isAuthenticated });
}