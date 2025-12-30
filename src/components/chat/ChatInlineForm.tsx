"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Building2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

// סוגי טפסים נתמכים
export type FormType = 
  | "plaintiff_details"   // פרטי התובע
  | "defendant_details"   // פרטי הנתבע
  | "defendant_type"      // סוג הנתבע
  | "amount_details";     // פרטי הסכום

interface ChatInlineFormProps {
  formType: FormType;
  onSubmit: (data: Record<string, string>) => void;
  disabled?: boolean;
}

// סגנון משותף לשדות קלט
const inputClassName = "w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

// קומפוננטת שדה עם תווית
function FormField({ 
  label, 
  required, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// טופס פרטי התובע
function PlaintiffForm({ onSubmit, disabled }: { onSubmit: (data: Record<string, string>) => void; disabled?: boolean }) {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.idNumber || !formData.phone) return;
    
    const text = `שם: ${formData.fullName}
ת.ז.: ${formData.idNumber}
טלפון: ${formData.phone}
${formData.email ? `אימייל: ${formData.email}` : ""}
${formData.address ? `כתובת: ${formData.address}` : ""}
${formData.city ? `עיר: ${formData.city}` : ""}`.trim();
    
    onSubmit({ text, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="שם מלא" required>
          <input
            type="text"
            placeholder="ישראל ישראלי"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className={inputClassName}
            required
            disabled={disabled}
          />
        </FormField>
        <FormField label="תעודת זהות" required>
          <input
            type="text"
            placeholder="123456789"
            value={formData.idNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value.replace(/\D/g, '').slice(0, 9) }))}
            className={inputClassName}
            required
            disabled={disabled}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="טלפון" required>
          <input
            type="tel"
            placeholder="050-1234567"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={inputClassName}
            required
            disabled={disabled}
          />
        </FormField>
        <FormField label="אימייל">
          <input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="כתובת">
          <input
            type="text"
            placeholder="רחוב והמספר"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
        <FormField label="עיר">
          <input
            type="text"
            placeholder="תל אביב"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
      </div>
      <button
        type="submit"
        disabled={disabled || !formData.fullName || !formData.idNumber || !formData.phone}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
          "bg-gradient-to-r from-blue-600 to-emerald-500 text-white",
          "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
      >
        <Send className="w-4 h-4" />
        שלח פרטים
      </button>
    </form>
  );
}

// טופס פרטי הנתבע
function DefendantForm({ onSubmit, disabled }: { onSubmit: (data: Record<string, string>) => void; disabled?: boolean }) {
  const [formData, setFormData] = useState({
    name: "",
    idOrCompanyNumber: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const text = `שם: ${formData.name}
${formData.idOrCompanyNumber ? `מספר זיהוי: ${formData.idOrCompanyNumber}` : ""}
${formData.phone ? `טלפון: ${formData.phone}` : ""}
${formData.address ? `כתובת: ${formData.address}` : ""}
${formData.city ? `עיר: ${formData.city}` : ""}`.trim();
    
    onSubmit({ text, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormField label="שם הנתבע / שם העסק" required>
        <input
          type="text"
          placeholder="לדוגמה: חברת ABC בע״מ"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={inputClassName}
          required
          disabled={disabled}
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="ת.ז. / ח.פ. / עוסק מורשה">
          <input
            type="text"
            placeholder="מספר זיהוי"
            value={formData.idOrCompanyNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, idOrCompanyNumber: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
        <FormField label="טלפון">
          <input
            type="tel"
            placeholder="050-1234567"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="כתובת">
          <input
            type="text"
            placeholder="רחוב והמספר"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
        <FormField label="עיר">
          <input
            type="text"
            placeholder="תל אביב"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className={inputClassName}
            disabled={disabled}
          />
        </FormField>
      </div>
      <button
        type="submit"
        disabled={disabled || !formData.name}
        className={cn(
          "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
          "bg-gradient-to-r from-blue-600 to-emerald-500 text-white",
          "hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
      >
        <Send className="w-4 h-4" />
        שלח פרטים
      </button>
    </form>
  );
}

// בחירת סוג נתבע עם כפתורים יפים
function DefendantTypeSelector({ onSubmit, disabled }: { onSubmit: (data: Record<string, string>) => void; disabled?: boolean }) {
  const options = [
    { value: "individual", label: "אדם פרטי", icon: User, desc: "אזרח רגיל", color: "hover:border-blue-400 hover:bg-blue-50" },
    { value: "business", label: "עוסק מורשה", icon: Briefcase, desc: "עסק קטן", color: "hover:border-purple-400 hover:bg-purple-50" },
    { value: "company", label: "חברה בע״מ", icon: Building2, desc: "חברה רשומה", color: "hover:border-emerald-400 hover:bg-emerald-50" },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-600 text-center">בחר את סוג הנתבע:</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.value}
              onClick={() => !disabled && onSubmit({ text: option.label, value: option.value })}
              disabled={disabled}
              className={cn(
                "p-3 rounded-xl border-2 border-gray-200 bg-white transition-all",
                option.color,
                "hover:shadow-md",
                "flex flex-col items-center gap-1.5",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              whileHover={!disabled ? { scale: 1.02 } : undefined}
              whileTap={!disabled ? { scale: 0.98 } : undefined}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">{option.label}</span>
              <span className="text-xs text-gray-500">{option.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function ChatInlineForm({ formType, onSubmit, disabled }: ChatInlineFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-4 border-2 border-blue-100 shadow-sm my-2"
    >
      {formType === "plaintiff_details" && (
        <>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            פרטי התובע (שלך)
          </h3>
          <PlaintiffForm onSubmit={onSubmit} disabled={disabled} />
        </>
      )}
      {formType === "defendant_details" && (
        <>
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            פרטי הנתבע
          </h3>
          <DefendantForm onSubmit={onSubmit} disabled={disabled} />
        </>
      )}
      {formType === "defendant_type" && (
        <DefendantTypeSelector onSubmit={onSubmit} disabled={disabled} />
      )}
    </motion.div>
  );
}

// פרסור טפסים מתגובת AI
// פורמט: [FORM: form_type]
export function parseInlineForm(content: string): {
  cleanContent: string;
  formType: FormType | null;
} {
  const formMatch = content.match(/\[FORM:\s*(\w+)\]/);
  
  if (!formMatch) {
    return { cleanContent: content, formType: null };
  }
  
  const cleanContent = content.replace(/\[FORM:\s*\w+\]/g, '').trim();
  const formType = formMatch[1] as FormType;
  
  // ודא שזה סוג טופס תקין
  const validForms: FormType[] = ["plaintiff_details", "defendant_details", "defendant_type", "amount_details"];
  if (!validForms.includes(formType)) {
    return { cleanContent: content, formType: null };
  }
  
  return { cleanContent, formType };
}
