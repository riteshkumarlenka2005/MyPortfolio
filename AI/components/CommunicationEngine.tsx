import React, { useState, useEffect } from 'react';
import { useAIEngine } from '../hooks/useAIEngine';
import type { ContactFormData } from '../types/ai.types';

// ─── Input field component ────────────────────────────────────────────────────
interface FieldProps {
  id: string; label: string; type?: string; name: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; error?: string;
}

const Field: React.FC<FieldProps> = ({
  id, label, type = 'text', name, value, onChange, placeholder, required, error,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
    </label>
    <input
      id={id} name={name} type={type} value={value} required={required}
      autoComplete={name}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`
        w-full bg-[#1e1e1e] border text-white rounded-2xl px-4 py-3
        focus:outline-none transition-all duration-200 placeholder:text-gray-600 text-sm
        ${error
          ? 'border-red-500/50 focus:border-red-500/70'
          : 'border-transparent focus:border-gray-600 focus:bg-[#252525]'
        }
      `}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

// ─── Thinking Loader ──────────────────────────────────────────────────────────
const ThinkingLoader: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <span className="flex gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span className="text-sm text-gray-400">AI is generating...</span>
    </div>
  );
};

// ─── CommunicationEngine ──────────────────────────────────────────────────────
export const CommunicationEngine: React.FC = () => {
  const engine = useAIEngine();

  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    location: '', // Hidden but kept for type compatibility
  });
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormData | 'message', string>>>({});

  // Internal states
  const isGenerating = engine.status === 'generating';
  const isSent = engine.status === 'sent';

  // Sync generated content from engine response
  useEffect(() => {
    if (engine.response && engine.status === 'done') {
      setMessage(engine.response.message);
    }
  }, [engine.response, engine.status]);

  // Validation
  const validateFormFields = () => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = 'Letters and spaces only';
    }

    if (!formData.email.trim()) {
      errors.email = 'Required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Must be exactly 10 digits';
    }

    return errors;
  };

  const validateFields = (): boolean => {
    const errors = validateFormFields() as Partial<Record<keyof ContactFormData | 'message', string>>;
    if (!message.trim()) errors.message = 'Message is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSend = async () => {
    if (!validateFields()) return;

    // Direct send logic, without confirmation modal.
    const subject = `Message from ${formData.fullName}`;
    await engine.send(formData, subject, message);
  };

  const handleGenerate = async () => {
    // 1. Validation First
    const errors = validateFormFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Clear any previous errors if validation passes
    setFieldErrors({});

    // 2. If message is empty, fetch AI greeting
    if (!message.trim()) {
      setMessage("Thinking...");
      const greeting = await engine.generateGreeting(formData.fullName);
      setMessage(greeting + "\n\n(Type your description above and click ✨ Generate Mail again)");
      return;
    }

    // 3. Generate the actual mail
    engine.generate({
      formData,
      purpose: 'general',
      context: message
    });
  };

  // ─── Sent screen ───────────────────────────────────────────────────────────
  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[300px] py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
          Thanks for reaching out. Ritesh will get back to you as soon as possible.
        </p>
        <button
          onClick={() => { engine.reset(); setFormData({ fullName: '', email: '', phone: '', location: '' }); setMessage(''); }}
          className="text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-5 py-2 rounded-xl transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  // ─── Main Form ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* ── Form fields ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="ce-fullName" name="fullName" label="Full Name"
          value={formData.fullName} error={fieldErrors.fullName}
          onChange={v => {
            setFormData(p => ({ ...p, fullName: v }));
            if (fieldErrors.fullName) setFieldErrors(p => ({ ...p, fullName: undefined }));
          }}
          placeholder="Enter Full Name"
        />
        <Field
          id="ce-email" name="email" type="email" label="Email"
          value={formData.email} error={fieldErrors.email}
          onChange={v => {
            setFormData(p => ({ ...p, email: v }));
            if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: undefined }));
          }}
          placeholder="Enter Email"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          id="ce-phone" name="phone" type="tel" label="Phone Number"
          value={formData.phone} error={fieldErrors.phone}
          onChange={v => {
            setFormData(p => ({ ...p, phone: v }));
            if (fieldErrors.phone) setFieldErrors(p => ({ ...p, phone: undefined }));
          }}
          placeholder="Enter Phone Number"
        />
        <Field
          id="ce-location" name="location" type="text" label="Location (Optional)"
          value={formData.location || ''}
          onChange={v => setFormData(p => ({ ...p, location: v }))}
          placeholder="Enter Your Location"
        />
      </div>

      {/* ── Message textarea ── */}
      <div>
        <label htmlFor="ce-message" className="block text-sm font-medium text-gray-300 mb-1.5">
          Message
        </label>
        <textarea
          id="ce-message"
          rows={6}
          value={message}
          onChange={e => {
            setMessage(e.target.value);
            if (fieldErrors.message) setFieldErrors(p => ({ ...p, message: undefined }));
          }}
          placeholder="Write Your Message"
          disabled={isGenerating}
          className={`
            w-full bg-[#1e1e1e] border ${fieldErrors.message ? 'border-red-500/50 focus:border-red-500/70' : 'border-transparent focus:border-gray-600'}
            focus:bg-[#252525] text-white rounded-2xl px-4 py-3 focus:outline-none
            transition-all resize-none placeholder:text-gray-600 text-sm
            disabled:opacity-60
          `}
        />
        {fieldErrors.message && <p className="text-xs text-red-400 mt-1">{fieldErrors.message}</p>}
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleSend}
          disabled={isGenerating}
          className="
            w-full sm:w-auto flex items-center justify-center gap-2
            bg-white hover:bg-gray-100 text-black font-semibold
            px-6 py-3.5 rounded-full transition-all duration-200
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          Send Message →
        </button>

        {!isGenerating ? (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || engine.providerStatus === 'offline'}
            className="
              w-full sm:w-auto flex items-center justify-center gap-2
              bg-transparent hover:bg-white/5 border border-white/20 text-white font-medium
              px-6 py-3.5 rounded-full transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {engine.generationCount > 0 ? '✦ Regenerate Mail' : '✦ Generate Mail'}
          </button>
        ) : (
          <div className="w-full sm:w-auto px-6 py-3.5"><ThinkingLoader /></div>
        )}
      </div>

      {/* Error message from Engine */}
      {engine.status === 'error' && engine.error && (
        <p className="text-xs text-red-400 mt-2">{engine.error}</p>
      )}
    </div>
  );
};
