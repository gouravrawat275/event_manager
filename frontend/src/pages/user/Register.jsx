import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Add an uppercase letter")
      .regex(/[0-9]/, "Add a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async ({ confirmPassword, ...data }) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success("Account created! Welcome to Event Hub.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <Calendar className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Join Event Hub and start booking in minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" icon={User} placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
            <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            <Input label="Phone (optional)" icon={Phone} placeholder="+1 555 123 4567" error={errors.phone?.message} {...register("phone")} />
            <Input label="Password" type="password" icon={Lock} placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm Password" type="password" icon={Lock} placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />

            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
