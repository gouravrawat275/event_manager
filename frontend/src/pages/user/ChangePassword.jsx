import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { authApi } from "../../api/authApi";

const schema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Add an uppercase letter").regex(/[0-9]/, "Add a number"),
});

const ChangePassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.changePassword(data);
      toast.success("Password updated successfully.");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
        <Input label="Current Password" type="password" icon={Lock} error={errors.currentPassword?.message} {...register("currentPassword")} />
        <Input label="New Password" type="password" icon={Lock} error={errors.newPassword?.message} {...register("newPassword")} />
        <Button type="submit" loading={loading}>Update Password</Button>
      </form>
    </div>
  );
};

export default ChangePassword;
