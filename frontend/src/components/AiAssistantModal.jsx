import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { BotIcon, MicIcon } from './Icons';

export default function AiAssistantModal({ isOpen, onClose }) {
  const { currentLanguage, languages, setCurrentLanguage } = useLanguage();
  const { isListening, isSpeaking, transcript, hasVoiceSupport, startListening, stopListening, speak, stopSpeaking } = useVoiceAssistant(currentLanguage);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      type: 'insight',
      text: "Hello! I am BizPartner AI, your business intelligence partner. I have direct visibility into your live sales velocity, inventory stock levels, and operating margins. How can I assist your business today?",
      context: "Verified Business Database Engine",
      actions: [
        "Which products should I purchase?",
        "Which product sells the most?",
        "Which products are selling slowly?",
        "What is my current stock?",
        "How was my sales performance this month?"
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const resp = await api.sendAiChat(text, currentLanguage);
      if (resp && resp.reply) {
        // Classify response type for visual styling
        let respType = 'normal';
        const lowerReply = resp.reply.toLowerCase();
        if (lowerReply.includes('alert') || lowerReply.includes('critical') || lowerReply.includes('out of stock')) {
          respType = 'alert';
        } else if (lowerReply.includes('recommend') || lowerReply.includes('purchase order') || lowerReply.includes('suggest')) {
          respType = 'recommendation';
        } else if (lowerReply.includes('velocity') || lowerReply.includes('margin') || lowerReply.includes('profit')) {
          respType = 'insight';
        }

        setMessages(prev => [...prev, {
          sender: 'ai',
          type: respType,
          text: resp.reply,
          context: resp.contextSummary || 'Live Business Data',
          actions: resp.suggestedActions && resp.suggestedActions.length > 0 ? resp.suggestedActions : [
            "What is my net profit?",
            "Which products should I purchase?",
            "Show low stock products"
          ]
        }]);

        if (isListening) {
          speak(resp.reply);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        type: 'alert',
        text: "I encountered an error querying your store database. Please ensure the backend server is reachable.",
        context: "Telemetry Error"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-container"
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '740px',
          height: '84vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Editorial Header (Section 21) */}
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent-contrast)',
              fontWeight: 800,
              fontSize: '1.1rem',
              boxShadow: '0 0 16px var(--color-accent-soft)'
            }}>
              AI
            </div>
            <div>
              <div className="editorial-kicker" style={{ fontSize: '0.675rem' }}>
                BIZPARTNER AI
              </div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                Your Business Intelligence Partner
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Language Selector in Header */}
            {languages && languages.length > 0 && (
              <select
                value={currentLanguage}
                onChange={e => setCurrentLanguage && setCurrentLanguage(e.target.value)}
                className="form-select"
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  width: 'auto',
                  background: 'var(--color-surface-subtle)',
                  border: '1px solid var(--color-border)'
                }}
                title="Switch AI Language (23 Languages Supported)"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1
              }}
              title="Close Assistant"
            >
              ×
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'var(--color-surface-subtle)'
        }}>
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            const isAlert = m.type === 'alert';
            const isRecommendation = m.type === 'recommendation';
            const isInsight = m.type === 'insight';

            return (
              <div
                key={idx}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '88%'
                }}
              >
                <div style={{
                  padding: '0.9rem 1.2rem',
                  borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: isUser
                    ? 'var(--color-accent)'
                    : isAlert
                    ? 'var(--color-surface)'
                    : 'var(--color-surface)',
                  color: isUser ? 'var(--color-accent-contrast)' : 'var(--color-text-primary)',
                  border: isUser
                    ? '1px solid var(--color-accent)'
                    : isAlert
                    ? '1px solid var(--color-danger-border)'
                    : isRecommendation
                    ? '1px solid var(--color-border-accent)'
                    : '1px solid var(--color-border)',
                  borderLeft: (!isUser && isRecommendation) ? '3px solid var(--color-accent)' : undefined,
                  fontSize: '0.9rem',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  {/* Category Pill for AI responses */}
                  {!isUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      {isInsight && <span className="badge" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent-strong)', fontSize: '0.65rem' }}>Business Insight</span>}
                      {isRecommendation && <span className="badge" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent-strong)', fontSize: '0.65rem' }}>Purchase Recommendation</span>}
                      {isAlert && <span className="badge status-badge-outofstock" style={{ fontSize: '0.65rem' }}>Critical Notice</span>}
                    </div>
                  )}

                  <div style={{ fontFamily: !isUser && isInsight ? 'var(--font-display)' : 'var(--font-body)', fontSize: !isUser && isInsight ? '1.02rem' : '0.9rem' }}>
                    {m.text}
                  </div>

                  {!isUser && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '0.5rem',
                      paddingTop: '0.4rem',
                      borderTop: '1px solid var(--color-border-subtle)'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                        ✦ {m.context || 'Verified Store Data'}
                      </span>
                      {speak && (
                        <button
                          type="button"
                          onClick={() => speak(m.text)}
                          title="Read aloud"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            color: 'var(--color-accent-strong)',
                            fontWeight: 600
                          }}
                        >
                          🔊 Read
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Suggested Prompts / Actions (Section 21) */}
                {m.actions && m.actions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => handleSend(act)}
                        style={{
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.76rem',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--color-accent)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        {act} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span className="dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                Synthesizing verified business records...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'center'
        }}>
          {hasVoiceSupport && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={isListening ? stopListening : startListening}
              style={{
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                borderColor: isListening ? 'var(--color-danger)' : 'var(--color-border)',
                color: isListening ? 'var(--color-danger)' : 'var(--color-text-primary)'
              }}
              title={isListening ? "Listening... Click to stop" : "Voice Query (STT)"}
            >
              <MicIcon size={18} />
            </button>
          )}

          <input
            type="text"
            className="form-input"
            placeholder="Ask about sales, stock, reorders, or profit (23 languages supported)..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={loading}
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSend()}
            disabled={!inputMessage.trim() || loading}
          >
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
