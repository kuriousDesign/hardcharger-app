// basic data like your name and pick nickname
import { PickClientType } from '@/models/Pick';
import { getRandomNicknameSuggestion } from './nicknameSuggestions';
import { useEffect, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';


export default function StepBasic({ pickForm, setPickForm }: {
  pickForm: PickClientType;
  setPickForm: React.Dispatch<React.SetStateAction<PickClientType>>;
}) {
  const [nicknameSuggestion, setNicknameSuggestion] = useState("");

  useEffect(() => {
    const loadSuggestion = async () => {
      const suggestion = await getRandomNicknameSuggestion();
      setNicknameSuggestion(suggestion);
    };
    loadSuggestion();
  }, []);
  return (
    <div className="space-y-4  w-full">
      <div>
        <label className="block mb-2 font-medium">Your Name</label>
        <input
          type="text"
          value={pickForm.name}
          onChange={(e) => setPickForm(prev => ({ ...prev, name: e.target.value }))}
          className="border p-2 w-3/4 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">Name this Pick</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={pickForm.nickname}
            onChange={(e) => setPickForm(prev => ({ ...prev, nickname: e.target.value }))}
            className="border p-2 w-full rounded"
            placeholder={nicknameSuggestion}
          />
          <button
            onClick={async () => setNicknameSuggestion(await getRandomNicknameSuggestion())}
            className="p-2 rounded-full hover:bg-gray-100 border"
            type="button"
          >
            <BiRefresh className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
