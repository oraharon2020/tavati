// TextMe.co.il SMS Service
// Israeli SMS provider - much cheaper than Twilio for Israeli numbers

interface TextMeResponse {
  status: number;
  message: string;
  shipment_id?: string;
}

interface SendSMSParams {
  phone: string;
  message: string;
}

class TextMeService {
  private username: string;
  private token: string;
  private source: string;
  private apiUrl = "https://my.textme.co.il/api";

  constructor() {
    this.username = process.env.TEXTME_USERNAME || "";
    this.token = process.env.TEXTME_TOKEN || "";
    this.source = process.env.TEXTME_SOURCE || "TviaKtana";
  }

  private formatPhone(phone: string): string {
    // Remove all non-digits
    let digits = phone.replace(/\D/g, "");
    
    // Remove leading 0 if present
    if (digits.startsWith("0")) {
      digits = digits.slice(1);
    }
    // Remove 972 prefix if present
    if (digits.startsWith("972")) {
      digits = digits.slice(3);
    }
    
    return digits; // Returns format: 5xxxxxxxx
  }

  async sendSMS({ phone, message }: SendSMSParams): Promise<{ success: boolean; error?: string }> {
    const formattedPhone = this.formatPhone(phone);

    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<sms>
    <user>
        <username>${this.username}</username>
    </user>
    <source>${this.source}</source>
    <destinations>
        <phone>${formattedPhone}</phone>
    </destinations>
    <message>${message}</message>
</sms>`;

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
          "Authorization": `Bearer ${this.token}`,
        },
        body: xmlBody,
      });

      const text = await response.text();
      
      // Parse XML response
      const statusMatch = text.match(/<status>(\d+)<\/status>/);
      const messageMatch = text.match(/<message>([^<]*)<\/message>/);

      const status = statusMatch ? parseInt(statusMatch[1]) : -1;
      const responseMessage = messageMatch ? messageMatch[1] : "Unknown error";

      if (status === 0) {
        return { success: true };
      } else {
        console.error("TextMe error:", responseMessage);
        return { success: false, error: responseMessage };
      }
    } catch (error) {
      console.error("TextMe API error:", error);
      return { success: false, error: "שגיאה בשליחת SMS" };
    }
  }

  async sendOTP(phone: string): Promise<{ success: boolean; code?: string; error?: string }> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    const message = `קוד האימות שלך לתבעתי: ${code}\nתוקף: 5 דקות`;

    const result = await this.sendSMS({ phone, message });

    if (result.success) {
      return { success: true, code };
    } else {
      return { success: false, error: result.error };
    }
  }
}

export const textMeService = new TextMeService();
