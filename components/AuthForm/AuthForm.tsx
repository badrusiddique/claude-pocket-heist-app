"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { extractDisplayName } from "@/lib/utils";
import styles from "./AuthForm.module.css";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "login") {
      setLoading(true);
      setError(null);
      try {
        const { email, password } = formData;
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/heists");
      } catch (authError) {
        const message =
          authError instanceof Error ? authError.message : "Login failed";
        setError(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { email, password } = formData;

      // 1. Create the Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      // 2. Derive display name from email prefix
      const displayName = extractDisplayName(email);

      // 3. Update the Auth profile with the display name
      await updateProfile(firebaseUser, { displayName });

      // 4. Write the user document to Firestore (non-critical: log but don't block)
      try {
        await setDoc(doc(db, "users", firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName,
        });
      } catch (firestoreError) {
        console.error("Firestore write failed:", firestoreError);
        // Per spec: do not roll back — user is still signed in
      }

      // 5. onAuthStateChanged picks up the new user automatically
      // 6. Redirect to /heists
      router.push("/heists");
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className="form-title italic">
        {mode === "login" ? "Log in to Your Account" : "Sign Up for an Account"}
      </h1>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="password">
          Password
        </label>
        <div className={styles.passwordWrapper}>
          <input
            className={styles.input}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            className={styles.toggleButton}
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className={styles.errorMessage}>
          {error}
        </p>
      )}

      <button type="submit" className="btn" disabled={loading}>
        {loading
          ? mode === "login"
            ? "Logging in..."
            : "Signing up..."
          : mode === "login"
            ? "Login"
            : "Sign Up"}
      </button>

      <p className={styles.navLink}>
        {mode === "login" ? (
          <>
            Don&apos;t have an account? <Link href="/signup">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account? <Link href="/login">Log in</Link>
          </>
        )}
      </p>
    </form>
  );
}
