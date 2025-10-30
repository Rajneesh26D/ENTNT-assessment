import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AtSign } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface NotesEditorProps {
  candidateId: string;
}

const mentionSuggestions = [
  'John Doe',
  'Jane Smith',
  'Alex Johnson',
  'Sarah Williams',
  'Michael Brown',
];

const NotesEditor: React.FC<NotesEditorProps> = ({ candidateId }) => {
  const [note, setNote] = useState('');
  const [showMentions, setShowMentions] = useState(false);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNote(value);

    const lastChar = value[value.length - 1];
    if (lastChar === '@') {
      setShowMentions(true);
    } else if (value[value.length - 1] === ' ') {
      setShowMentions(false);
    }
  };

  const handleMentionClick = (mention: string) => {
    setNote((prev) => prev + mention + ' ');
    setShowMentions(false);
  };

  const handleSubmit = () => {
    console.log('Note submitted for candidate:', candidateId, note);
    setNote('');
  };

  return (
    <Card title="Add Notes">
      <div className="space-y-4">
        <div className="relative">
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Add a note... Use @ to mention team members"
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
          />

          {showMentions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-0 mb-2 w-64 p-2 rounded-lg bg-slate-800 border border-white/10 shadow-xl z-10"
            >
              <p className="text-xs text-slate-400 px-2 py-1 flex items-center gap-1">
                <AtSign className="w-3 h-3" />
                Mention someone
              </p>
              {mentionSuggestions.map((mention) => (
                <button
                  key={mention}
                  onClick={() => handleMentionClick(mention)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
                >
                  @{mention}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="gradient"
            icon={<Send className="w-4 h-4" />}
            onClick={handleSubmit}
            disabled={!note.trim()}
          >
            Add Note
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotesEditor;
