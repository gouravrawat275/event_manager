import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { eventApi } from "../../api/eventApi";
import { categoryApi } from "../../api/categoryApi";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  venue: z.string().min(2, "Venue is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  organizerName: z.string().min(2, "Organizer name is required"),
  organizerEmail: z.string().email().optional().or(z.literal("")),
  organizerPhone: z.string().optional(),
  seats: z.coerce.number().int().min(1, "Must have at least 1 seat"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  status: z.enum(["draft", "published"]),
});

const EventForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft" },
  });

  useEffect(() => {
    categoryApi.getAll().then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    eventApi.getById(id).then(({ data }) => {
      const e = data.event;
      reset({
        title: e.title,
        description: e.description,
        shortDescription: e.shortDescription || "",
        category: e.category?._id,
        venue: e.venue,
        city: e.city,
        address: e.address || "",
        date: e.date?.slice(0, 10),
        time: e.time,
        organizerName: e.organizer?.name,
        organizerEmail: e.organizer?.email || "",
        organizerPhone: e.organizer?.phone || "",
        seats: e.seats,
        price: e.price,
        status: e.status === "published" ? "published" : "draft",
      });
      setExistingImages(e.images || []);
      setLoading(false);
    });
  }, [id, isEdit, reset]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files].slice(0, 6));
  };

  const removeNewImage = (idx) => setNewImages((prev) => prev.filter((_, i) => i !== idx));

  const removeExistingImage = async (publicId) => {
    try {
      await eventApi.removeImage(id, publicId);
      setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
      toast.success("Image removed.");
    } catch {
      toast.error("Could not remove image.");
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => formData.append(key, value ?? ""));
      newImages.forEach((file) => formData.append("images", file));

      if (isEdit) {
        await eventApi.update(id, formData);
        toast.success("Event updated successfully.");
      } else {
        await eventApi.create(formData);
        toast.success("Event created successfully.");
      }
      navigate("/admin/events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner full />;

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate("/admin/events")} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <ArrowLeft className="h-4 w-4" /> Back to events
      </button>

      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? "Edit Event" : "Create New Event"}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          <Input label="Event Title" error={errors.title?.message} {...register("title")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea rows={5} className="input-field" {...register("description")} />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>}
          </div>
          <Input label="Short Description (for cards)" error={errors.shortDescription?.message} {...register("shortDescription")} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select className="input-field" {...register("category")}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {errors.category && <p className="mt-1.5 text-xs text-red-500">{errors.category.message}</p>}
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Venue & Schedule</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Venue Name" error={errors.venue?.message} {...register("venue")} />
            <Input label="City" error={errors.city?.message} {...register("city")} />
          </div>
          <Input label="Full Address (optional)" error={errors.address?.message} {...register("address")} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Date" type="date" error={errors.date?.message} {...register("date")} />
            <Input label="Time" type="time" error={errors.time?.message} {...register("time")} />
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Organizer</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Organizer Name" error={errors.organizerName?.message} {...register("organizerName")} />
            <Input label="Organizer Email" error={errors.organizerEmail?.message} {...register("organizerEmail")} />
          </div>
          <Input label="Organizer Phone" error={errors.organizerPhone?.message} {...register("organizerPhone")} />
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Capacity, Pricing & Status</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Total Seats" type="number" error={errors.seats?.message} {...register("seats")} />
            <Input label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register("price")} />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select className="input-field" {...register("status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card space-y-4 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">Images</h3>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.publicId} className="group relative h-24 w-24 overflow-hidden rounded-xl">
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeExistingImage(img.publicId)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {newImages.map((file, idx) => (
              <div key={idx} className="group relative h-24 w-24 overflow-hidden rounded-xl">
                <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => removeNewImage(idx)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-gray-400 hover:border-indigo-400 hover:text-indigo-500">
              <Upload className="h-5 w-5" />
              <span className="text-xs">Add</span>
              <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-gray-400">Up to 6 images. JPEG, PNG, or WEBP, max 5MB each.</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate("/admin/events")}>Cancel</Button>
          <Button type="submit" loading={saving}>{isEdit ? "Update Event" : "Create Event"}</Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
