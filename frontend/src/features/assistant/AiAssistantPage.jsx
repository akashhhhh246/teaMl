import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  User,
  Heart,
  Thermometer,
  ChevronRight,
} from 'lucide-react';
import { chatAPI } from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { TeaImage } from '../../components/common/TeaImage';
import { useFavorites } from '../../context/FavoritesContext';

export function AiAssistantPage() {
  const { isFavorited, toggleFavorite } = useFavorites();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Namaste! I am your **TeaML India AI Chai & Botanical Sommelier** 🍵.\n\nI have deep expertise across over 1,050 Indian estate terroirs—from the delicate muscatel flushes of **Darjeeling** and rich malt of **Upper Assam Kadak Chai**, to saffron-infused **Kashmiri Kahwa** and restorative **Ayurvedic Kadhas** (Ashwagandha, Tulsi, Curcumin). How can I assist your tea ritual today?",
      suggestions: [
        'How to brew authentic Kadak Masala Chai?',
        'How to make traditional Kashmiri Kahwa?',
        'Best Darjeeling First Flush brewing guide',
        'Ayurvedic botanicals for deep sleep & stress',
        'Best Indian tea pairings with hot samosas',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = input) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatAPI.sendMessage(textToSend.trim());
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data.response,
        recommendedTeas: res.data.recommendedTeas || [],
        suggestions: res.data.suggestions || [
          'Take the 19-point AI Chai Quiz',
          'Explore single-estate Darjeeling',
          'Best Ayurvedic nightcaps',
        ],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "For an exquisite **Kadak Masala Chai**, simmer water with crushed fresh **Adrak (Ginger)** and **Elaichi (Cardamom)** for 2 minutes before adding Assam CTC and whole milk!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Chai cellar context refreshed! What Indian harvest, spice combination, or brewing ritual can I help you with?",
        suggestions: [
          'Best Kadak Chai ratio for milk and water',
          'Health benefits of Kashmiri Saffron Kahwa',
          'Darjeeling Second Flush vs First Flush',
        ],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-6rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/60 dark:border-slate-800/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                AI Chai & Botanical Sommelier
              </h1>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-500">
              India Edition • 1,050+ Terroirs (Darjeeling, Assam, Nilgiri, Kashmir, Kangra)
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                🍵
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-3`}>
              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'glass-card text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-800/60'
                }`}
              >
                <div className="whitespace-pre-line space-y-1">
                  {msg.text}
                </div>
              </div>

              {/* Embedded Recommended Teas */}
              {msg.recommendedTeas && msg.recommendedTeas.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {msg.recommendedTeas.map((tea) => (
                    <div
                      key={tea.id}
                      className="glass-panel rounded-2xl p-3 border border-emerald-500/30 flex gap-3 items-center group"
                    >
                      <TeaImage
                        src={tea.imageUrl}
                        alt={tea.name}
                        category={tea.teaType}
                        className="w-14 h-14 rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-400 truncate">{tea.origin}</div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          <Link to={`/teas/${tea.id}`}>{tea.name}</Link>
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{tea.price}
                          </span>
                          <Link
                            to={`/teas/${tea.id}`}
                            className="text-[10px] font-semibold text-emerald-500 hover:underline flex items-center gap-0.5"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[11px] px-3 py-1.5 rounded-full glass-card hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-500 text-slate-600 dark:text-slate-300 font-medium transition-all shadow-sm"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold">
                👤
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-600 flex items-center justify-center text-sm">
              🍵
            </div>
            <div className="glass-card rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Sommelier is consulting the Indian terroir library...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for Kadak Chai ratios, Kashmiri Kahwa recipes, Darjeeling flushes, or samosa pairings..."
          className="flex-1 px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
