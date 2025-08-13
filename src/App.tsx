import React, { useState } from "react";
import ContactTable from "./components/ContactTable";
import ContactFormModal from "./components/ContactFormModal";
import ContactDetailsModal from "./components/ContactDetailsModal";
import ConfirmDialog from "./components/ConfirmDialog";
import {
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from "./api/contactApi";
import type { Contact } from "./types/contact";
import { showToast, ToastContainerWrapper } from "./components/Toast";
import Button from "./components/Button";

export default function App() {
  const [create] = useCreateContactMutation();
  const [update] = useUpdateContactMutation();
  const [remove] = useDeleteContactMutation();

  const [editing, setEditing] = useState<Contact | undefined>();
  const [viewId, setViewId] = useState<number | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [confirmId, setConfirmId] = useState<number | undefined>();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const onCreate = () => {
    setEditing(undefined);
    setShowForm(true);
  };
  const onEdit = (c: Contact) => {
    setEditing(c);
    setShowForm(true);
  };
  const onView = (id?: number) => setViewId(id);
  const onDelete = (id?: number) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editing?.id) {
        await update({ id: editing.id, ...data }).unwrap();
        showToast.success("Contact updated!");
      } else {
        await create(data).unwrap();
        showToast.success("Contact created!");
      }
      setShowForm(false);
    } catch (e) {
      showToast.error("Something went wrong!");
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmId) return;
    try {
      await remove(confirmId).unwrap();
      showToast.error("Contact deleted!");
      setConfirmOpen(false);
    } catch {
      showToast.error("Delete failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-2 sm:p-4 lg:p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl">Contact List</h1>
          <div>
            <Button
              onClick={onCreate}
              className="bg-green-600 hover:bg-green-700"
            >
              New Contact
            </Button>
          </div>
        </div>
        <ContactTable onEdit={onEdit} onView={onView} onDelete={onDelete} />
      </div>

      <ContactFormModal
        open={showForm}
        initial={editing}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmit}
      />
      <ContactDetailsModal id={viewId} onClose={() => setViewId(undefined)} />
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        message="Are you sure want to delete this contact?"
      />

      <ToastContainerWrapper />
    </div>
  );
}
