import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import { Skeleton } from "../../components/common/Skeleton";
import { categoryApi } from "../../api/categoryApi";

const ICON_OPTIONS = ["Calendar", "Music", "Cpu", "Trophy", "Briefcase", "Palette", "UtensilsCrossed", "Heart", "Film", "BookOpen", "Plane", "Camera"];

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await categoryApi.getAllAdmin();
    setCategories(data.categories);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => { setEditing(null); reset({ name: "", icon: "Calendar", description: "" }); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); reset({ name: cat.name, icon: cat.icon, description: cat.description }); setModalOpen(true); };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await categoryApi.update(editing._id, data);
        toast.success("Category updated.");
      } else {
        await categoryApi.create(data);
        toast.success("Category created.");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await categoryApi.remove(deleteTarget._id);
      toast.success("Category deleted.");
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete category.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Organize events into categories</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>Add Category</Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
      ) : categories.length === 0 ? (
        <EmptyState icon={Tag} title="No categories yet" action={<Button icon={Plus} onClick={openCreate}>Add Category</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = Icons[cat.icon] || Icons.Calendar;
            return (
              <div key={cat._id} className="card flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500">{cat.eventCount} event{cat.eventCount !== 1 ? "s" : ""}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Category Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
            <select className="input-field" {...register("icon")}>
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <Input label="Description (optional)" {...register("description")} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save Changes" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category">
        <p className="text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete "<strong>{deleteTarget?.name}</strong>"?</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageCategories;
