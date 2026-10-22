import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/authApi";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authApi.resetPassword(token, { password });
      toast.success("Password reset successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a new, strong password</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <Input label="New Password" type="password" icon={Lock} placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm Password" type="password" icon={Lock} placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" loading={loading} className="w-full">Reset Password</Button>
          </form>
          <Link to="/login" className="mt-6 block text-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Back to login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
