import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, Globe, Phone, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { settingsApi } from "../../api/settingsApi";

const Settings = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    settingsApi.get().then(({ data }) => {
      const s = data.settings;
      reset({
        siteName: s.siteName,
        siteDescription: s.siteDescription,
        contactEmail: s.contactEmail,
        contactPhone: s.contactPhone,
        address: s.address,
        facebook: s.socialLinks?.facebook,
        twitter: s.socialLinks?.twitter,
        instagram: s.socialLinks?.instagram,
        linkedin: s.socialLinks?.linkedin,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const { facebook, twitter, instagram, linkedin, ...rest } = data;
      await settingsApi.update({ ...rest, socialLinks: { facebook, twitter, instagram, linkedin } });
      toast.success("Settings updated successfully.");
    } catch {
      toast.error("Could not update settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your website configuration</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-4 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><Globe className="h-4 w-4" /> Website Settings</h3>
          <Input label="Site Name" {...register("siteName")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Site Description</label>
            <textarea rows={3} className="input-field" {...register("siteDescription")} />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><Phone className="h-4 w-4" /> Contact Information</h3>
          <Input label="Contact Email" {...register("contactEmail")} />
          <Input label="Contact Phone" {...register("contactPhone")} />
          <Input label="Address" {...register("address")} />
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"><Share2 className="h-4 w-4" /> Social Links</h3>
          <Input label="Facebook URL" {...register("facebook")} />
          <Input label="Twitter / X URL" {...register("twitter")} />
          <Input label="Instagram URL" {...register("instagram")} />
          <Input label="LinkedIn URL" {...register("linkedin")} />
        </div>

        <Button type="submit" icon={Save} loading={saving}>Save Settings</Button>
      </form>
    </div>
  );
};

export default Settings;
