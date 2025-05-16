import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, User, Clock, Search, Ban } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { supabase } from '../contexts/supabaseClient';
import { useTranslation } from "react-i18next";

type ChatMessage = {
  id: number;
  created_at: string;
  nickname: string;
  message: string;
  zone_id: number;
};

type Zone = {
  id: number;
  name: string;
};

const ChatPage: React.FC = () => {
  // const { currentUser } = useUserContext();
  useUserContext();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [nicknameInput, setNicknameInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();


  const fetchZones = async () => {
    const { data, error } = await supabase.from('zones').select();
    if (data) {
      setZones(data);
      setSelectedZoneId(data[0]?.id || null);
    }
    if (error) {
      console.error('Error fetching zones:', error);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!selectedZoneId) return;

    const { data, error } = await supabase
      .from('messages')
      .select()
      .eq('zone_id', selectedZoneId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data as ChatMessage[]);
    }
  }, [selectedZoneId]);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed || !selectedZoneId || !nicknameInput.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        message: trimmed,
        nickname: nicknameInput.trim(),
        zone_id: selectedZoneId
      }
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessageText('');
      fetchMessages();
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.message?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
    msg.nickname?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("communityChat")}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t("localChatDescription")}
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="zone-select" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{t("zone")}:</label>
        <select
          id="zone-select"
          value={selectedZoneId || ''}
          onChange={(e) => setSelectedZoneId(Number(e.target.value))}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800"
        >
          {zones.map((zone) => (
            <option key={zone.id} value={zone.id}>{zone.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <h2 className="font-semibold">{t("communityChat")}</h2>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-2">
              {filteredMessages.length} {t("nbMessages")}
            </span>
          </div>

          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search chat..."
              className="w-full sm:w-48 pl-8 pr-2 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-neutral-500">
              <Search size={16} />
            </div>
          </div>
        </div>

        <div className="h-[500px] overflow-y-auto p-4 bg-gray-50 dark:bg-neutral-900">
          {filteredMessages.length > 0 ? (
            <div className="space-y-4">
              {filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.nickname === nicknameInput ? 'justify-end' : 'justify-start'
                    }`}
                >
                  <div className={`
                    max-w-[75%] rounded-lg px-4 py-3 shadow-sm
                    ${msg.nickname === nicknameInput
                      ? 'bg-primary-50 border border-primary-200 dark:bg-primary-900/20 dark:border-primary-800/50'
                      : 'bg-white border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700'
                    }
                  `}>
                    <div className="flex items-center mb-1">
                      <User size={14} className="mr-1 text-neutral-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {msg.nickname}
                      </span>
                      <div className="flex items-center ml-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock size={12} className="mr-1" />
                        <span>{format(new Date(msg.created_at), 'p')}</span>
                      </div>
                    </div>
                    <p className="text-neutral-800 dark:text-neutral-200">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <Ban size={40} className="mb-3 text-neutral-400" />
              <p className="text-neutral-600 dark:text-neutral-400 text-center">
                {t("noMessagesinZone")}.<br />
                {t("be_first")}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-l-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              autoComplete="off"
              required
            />
            <button
              type="submit"
              className="flex items-center justify-center h-10 px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={!messageText.trim() || !nicknameInput.trim()}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-2">{t("chatGuidelines")}</h3>
        <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside space-y-1">
          <li>{t("chatGuidelinesText")}</li>
          <li>{t("chatGuidelinesText2")}</li>
          <li>{t("chatGuidelinesText3")}</li>
          <li>{t("chatGuidelinesText4")}</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;
