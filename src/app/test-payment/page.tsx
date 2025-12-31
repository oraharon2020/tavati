"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function TestPaymentPage() {
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const createTestSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: "0500000000",
          serviceType: "claims"
        }),
      });
      const data = await res.json();
      if (data.session?.id) {
        setSessionId(data.session.id);
        setResult(`Session created: ${data.session.id}`);
      }
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(false);
  };

  const openPayment = async () => {
    if (!sessionId) {
      setResult("Create a session first!");
      return;
    }
    
    setLoading(true);
    setResult("Creating payment...");
    
    try {
      // Create payment via API to get authCode
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          amount: 8,
          description: "טסט תשלום",
          customerName: "Test User",
          customerPhone: "0500000000",
          customerEmail: "test@test.com",
        }),
      });
      
      const data = await res.json();
      
      if (data.authCode && window.growPayment && window.meshulam_sdk_ready) {
        setResult(`Opening wallet with authCode: ${data.authCode}`);
        window.growPayment.renderPaymentOptions(data.authCode);
      } else if (data.paymentUrl) {
        setResult(`Opening payment URL: ${data.paymentUrl}`);
        window.open(data.paymentUrl, "_blank");
      } else {
        setResult(`Error: ${JSON.stringify(data)}`);
      }
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(false);
  };

  const simulateWebhook = async () => {
    if (!sessionId) {
      setResult("Create a session first!");
      return;
    }
    
    setLoading(true);
    try {
      // Simulate webhook call
      const formData = new URLSearchParams();
      formData.append("err", "");
      formData.append("status", "1");
      formData.append("data[status]", "שולם");
      formData.append("data[statusCode]", "2");
      formData.append("data[sum]", "8");
      formData.append("data[transactionId]", "TEST123");
      formData.append("data[fullName]", "Test User");
      formData.append("data[customFields][cField1]", sessionId);
      
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      
      const data = await res.json();
      setResult(`Webhook response: ${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      setResult(`Error: ${e}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">טסט תשלום</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Session ID:</label>
            <input
              type="text"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="או הזן ידנית"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={createTestSession}
              disabled={loading}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : "צור Session"}
            </button>
            
            <button
              onClick={openPayment}
              disabled={loading || !sessionId}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              פתח תשלום
            </button>
          </div>
          
          <button
            onClick={simulateWebhook}
            disabled={loading || !sessionId}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            סמלץ Webhook (ללא תשלום אמיתי)
          </button>
          
          {result && (
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-60 whitespace-pre-wrap">
              {result}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
