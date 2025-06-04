// basic data like your name and pick nickname
import { PickClientType } from '@/models/Pick';

export default function StepBasic({ pickForm, setPickForm }: {
  pickForm: PickClientType;
  setPickForm: React.Dispatch<React.SetStateAction<PickClientType>>;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Your Name</label>
        <input
          type="text"
          value={pickForm.name}
          onChange={(e) => setPickForm(prev => ({ ...prev, name: e.target.value }))}
          className="border p-2 w-full rounded"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Name this Pick</label>
        <input
          type="text"
          value={pickForm.nickname}
          onChange={(e) => setPickForm(prev => ({ ...prev, nickname: e.target.value }))}
          className="border p-2 w-full rounded"
        />
      </div>
    </div>
  );
}
