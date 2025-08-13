import Button from "./Button";

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
};

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  message,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div>{message ?? "Are you sure?"}</div>
        <div className="mt-4 flex gap-2 justify-end">
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="danger">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
