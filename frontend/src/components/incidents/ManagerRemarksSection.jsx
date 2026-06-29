import { useState } from 'react';
import { Save } from 'lucide-react';

export default function ManagerRemarksSection({ remarks, isManager, onSave, saving }) {
  const [text, setText] = useState(remarks || '');
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    await onSave(text);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Manager Remarks</p>
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-colors"
            placeholder="Add your remarks about this incident..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setEditing(false); setText(remarks || ''); }}
              className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {text ? (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{text}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No remarks added yet.</p>
          )}
          {isManager && (
            <button
              onClick={() => setEditing(true)}
              className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {text ? 'Edit Remarks' : 'Add Remarks'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
