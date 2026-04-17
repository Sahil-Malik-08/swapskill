import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/chat';

const ChatPage = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [activeSwapId, setActiveSwapId] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const activeConversation = useMemo(
    () => conversations.find((c) => c.swapRequestId === activeSwapId),
    [conversations, activeSwapId]
  );

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_BASE}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load chats');
      }
      setConversations(data.conversations || []);

      if (!activeSwapId && data.conversations?.length) {
        setActiveSwapId(data.conversations[0].swapRequestId);
      }
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load chats');
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (swapRequestId) => {
    if (!swapRequestId) return;

    setLoadingMessages(true);
    try {
      const response = await fetch(`${API_BASE}/${swapRequestId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to load messages');
      }

      setMessages(data.messages || []);
      setChatMeta(data.chatMeta);
      setError('');
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages(activeSwapId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSwapId]);

  useEffect(() => {
    if (!activeSwapId) return undefined;
    const id = setInterval(() => {
      fetchMessages(activeSwapId);
      fetchConversations();
    }, 6000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSwapId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeSwapId) return;

    try {
      const response = await fetch(`${API_BASE}/${activeSwapId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setMessageText('');
      setMessages((prev) => [...prev, data.chatMessage]);
      fetchConversations();
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="hero-shell card border-slate-300/40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <span className="section-chip mb-3 border-white/20 bg-white/10 text-slate-100">Realtime Collaboration</span>
        <h1 className="mb-2 text-3xl font-black tracking-tight">Skill Chat</h1>
        <p className="text-slate-200">
          Message your swap partner after a request is accepted and coordinate your learning sessions.
        </p>
      </div>

      {error && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h2 className="mb-3 text-lg font-bold text-slate-900">Conversations</h2>
          {loadingConversations ? (
            <p className="text-slate-600">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-slate-600">
              No chat available yet. Accept a swap request first to unlock chat.
            </p>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <button
                  key={conversation.swapRequestId}
                  onClick={() => setActiveSwapId(conversation.swapRequestId)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    activeSwapId === conversation.swapRequestId
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <p className="font-semibold">{conversation.otherUser.name}</p>
                  <p className={`text-xs ${activeSwapId === conversation.swapRequestId ? 'text-slate-200' : 'text-slate-500'}`}>
                    {conversation.latestMessage?.message || 'No messages yet'}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card lg:col-span-2">
          {!activeConversation ? (
            <p className="text-slate-600">Select a conversation to start chatting.</p>
          ) : (
            <>
              <div className="mb-4 border-b border-slate-200 pb-3">
                <h2 className="text-xl font-bold text-slate-900">{chatMeta?.otherUser?.name || activeConversation.otherUser.name}</h2>
                <p className="text-sm text-slate-500">
                  Swap status: {chatMeta?.status || activeConversation.status}
                </p>
              </div>

              <div className="mb-4 h-[380px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                {loadingMessages ? (
                  <p className="text-slate-600">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-slate-600">Start the conversation with your partner.</p>
                ) : (
                  messages.map((msg) => {
                    const isMine = msg.sender?._id === user._id;
                    const timestamp = new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                            isMine
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-200 bg-white text-slate-800'
                          }`}
                        >
                          {!isMine && <p className="mb-1 text-xs font-semibold text-slate-500">{msg.sender?.name}</p>}
                          <p>{msg.message}</p>
                          <p className={`mt-1 text-[11px] ${isMine ? 'text-slate-300' : 'text-slate-400'}`}>{timestamp}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="form-input"
                  placeholder="Write a message..."
                  maxLength={1000}
                />
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
