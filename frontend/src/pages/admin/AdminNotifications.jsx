import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Megaphone } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { notificationApi } from "../../api/notificationApi";

const AdminNotifications = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sending, setSending] = useState(false);

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await notificationApi.broadcast(data);
      toast.success("Notification sent to all users.");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Broadcast announcements, reminders, or booking updates to users</p>
      </div>

      <div className="card p-6">
        <div className="mb-5 flex items-center gap-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 p-4">
          <Megaphone className="h-5 w-5 shrink-0 text-indigo-600" />
          <p className="text-sm text-indigo-700 dark:text-indigo-300">This will send a notification to every registered user immediately.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register("title", { required: "Title is required" })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea rows={4} className="input-field" {...register("message", { required: "Message is required" })} />
            {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select className="input-field" {...register("type")}>
              <option value="admin">General Announcement</option>
              <option value="reminder">Event Reminder</option>
              <option value="system">System Update</option>
            </select>
          </div>
          <Button type="submit" icon={Send} loading={sending}>Send Notification</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
