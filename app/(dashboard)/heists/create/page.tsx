"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/context/AuthContext";

interface FormState {
  title: string;
  description: string;
  expiresAt: string;
}

interface FormErrors {
  title?: string;
  expiresAt?: string;
}

export default function CreateHeistPage() {
  const router = useRouter();
  const { user } = useUser();
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    expiresAt: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.expiresAt) {
      errs.expiresAt = "Expiry date is required";
    } else if (new Date(form.expiresAt) <= new Date()) {
      errs.expiresAt = "Expiry must be in the future";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "heists"), {
        title: form.title.trim(),
        description: form.description.trim(),
        createdBy: user!.uid,
        createdAt: Timestamp.fromDate(new Date()),
        expiresAt: Timestamp.fromDate(new Date(form.expiresAt)),
      });
      router.push("/heists");
    } catch (err) {
      console.error("Failed to create heist:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-content">
      <h2 className="form-title">Create a New Heist</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <p role="alert">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="expiresAt">Expiry date</label>
          <input
            id="expiresAt"
            name="expiresAt"
            type="datetime-local"
            value={form.expiresAt}
            onChange={handleChange}
          />
          {errors.expiresAt && <p role="alert">{errors.expiresAt}</p>}
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Creating..." : "Create Heist"}
        </button>
      </form>
    </div>
  );
}
