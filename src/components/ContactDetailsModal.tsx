import { useGetContactQuery } from "../api/contactApi";
import Button from "./Button";

type Props = {
  id?: number;
  onClose: () => void;
};

export default function ContactDetailsModal({ id, onClose }: Props) {
  const { data, isLoading, isError } = useGetContactQuery(id!, { skip: !id });
  if (!id) return null;
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md animate-fadeIn">
        <h3 className="text-xl font-bold mb-4 border-b pb-2">
          Contact details
        </h3>
        {isLoading && <div>Loading...</div>}
        {isError && <div className="text-red-600">Error</div>}
        {data && (
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> {data.firstName} {data.lastName}
            </div>
            <div>
              <strong>Email:</strong> {data.email}
            </div>
            <div>
              <strong>Role:</strong> {data.role}
            </div>
            <div>
              <strong>Gender:</strong> {data.gender}
            </div>
            <div>
              <strong>Active:</strong> {data.isActive ? "Yes" : "No"}
            </div>
            <div>
              <strong>Newsletter:</strong> {data.newsletter ? "Yes" : "No"}
            </div>
            <div>
              <strong>Birth:</strong> {data.birthDate}
            </div>
          </div>
        )}
        <div className="mt-4 text-right">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
