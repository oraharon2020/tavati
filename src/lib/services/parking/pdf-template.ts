// תבנית PDF למכתב ערעור על דוח חניה
import { ParkingAppealData } from './types';

export function generateParkingAppealHTML(data: ParkingAppealData): string {
  const today = new Date().toLocaleDateString("he-IL");
  
  const reasonLabels: Record<string, string> = {
    no_sign: 'העדר שילוט או שילוט לקוי',
    paid: 'תשלום בוצע כנדרש',
    disabled: 'תו נכה בתוקף',
    emergency: 'מצב חירום',
    incorrect: 'פרטים שגויים בדוח',
    loading: 'פריקה/טעינה מורשית',
    other: 'סיבה אחרת',
  };

  const evidenceHTML = data.appeal.evidence && data.appeal.evidence.length > 0
    ? `
      <h3>מסמכים ותמונות מצורפים:</h3>
      <ul>
        ${data.appeal.evidence.map((item, i) => `<li>נספח ${i + 1} - ${item}</li>`).join('')}
      </ul>
    `
    : '';

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <style>
    @font-face {
      font-family: 'Rubik';
      src: url('file://${process.cwd()}/public/fonts/Rubik-Regular.ttf') format('truetype');
      font-weight: 400;
    }
    @font-face {
      font-family: 'Rubik';
      src: url('file://${process.cwd()}/public/fonts/Rubik-Bold.ttf') format('truetype');
      font-weight: 700;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      size: A4;
      margin: 25mm 20mm 25mm 20mm;
    }
    
    body {
      font-family: 'Rubik', 'David', 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.8;
      direction: rtl;
      text-align: right;
      color: #000;
      background: #fff;
    }
    
    .letter {
      max-width: 100%;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #16a34a;
    }
    
    .header h1 {
      font-size: 18pt;
      color: #16a34a;
      margin-bottom: 5px;
    }
    
    .header h2 {
      font-size: 14pt;
      color: #333;
      font-weight: normal;
    }
    
    .date-line {
      text-align: left;
      margin-bottom: 20px;
      color: #666;
    }
    
    .recipient {
      margin-bottom: 25px;
    }
    
    .recipient strong {
      display: block;
      font-size: 13pt;
    }
    
    .subject {
      margin-bottom: 25px;
      padding: 15px;
      background: #f0fdf4;
      border-right: 4px solid #16a34a;
    }
    
    .subject strong {
      color: #16a34a;
    }
    
    .ticket-details {
      margin-bottom: 25px;
      padding: 15px;
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
    }
    
    .ticket-details table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .ticket-details td {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    
    .ticket-details td:first-child {
      font-weight: bold;
      width: 120px;
      color: #666;
    }
    
    .content {
      margin-bottom: 25px;
    }
    
    .content p {
      margin-bottom: 15px;
      text-align: justify;
    }
    
    .content h3 {
      color: #16a34a;
      margin: 20px 0 10px 0;
      font-size: 13pt;
    }
    
    .content ul {
      margin-right: 20px;
      margin-bottom: 15px;
    }
    
    .content li {
      margin-bottom: 5px;
    }
    
    .request {
      margin: 30px 0;
      padding: 15px;
      background: #f0fdf4;
      border: 1px solid #16a34a;
      border-radius: 8px;
      text-align: center;
    }
    
    .request strong {
      font-size: 13pt;
    }
    
    .signature {
      margin-top: 40px;
    }
    
    .signature p {
      margin-bottom: 5px;
    }
    
    .signature .name {
      font-weight: bold;
      font-size: 13pt;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="letter">
    <div class="header">
      <h1>בקשה לביטול דו"ח חניה</h1>
      <h2>ערעור על דו"ח מספר ${data.ticket.ticketNumber}</h2>
    </div>
    
    <div class="date-line">
      תאריך: ${today}
    </div>
    
    <div class="recipient">
      <strong>לכבוד:</strong>
      ${data.ticket.authority}
      <br>
      מחלקת פניות הציבור / ועדת ערעורים
    </div>
    
    <div class="subject">
      <strong>הנדון: בקשה לביטול דו"ח חניה מספר ${data.ticket.ticketNumber}</strong>
    </div>
    
    <div class="ticket-details">
      <table>
        <tr>
          <td>מספר דו"ח:</td>
          <td>${data.ticket.ticketNumber}</td>
        </tr>
        <tr>
          <td>תאריך הדו"ח:</td>
          <td>${data.ticket.date}${data.ticket.time ? ` בשעה ${data.ticket.time}` : ''}</td>
        </tr>
        <tr>
          <td>מיקום:</td>
          <td>${data.ticket.location}</td>
        </tr>
        <tr>
          <td>מספר רכב:</td>
          <td>${data.ticket.vehicleNumber}</td>
        </tr>
        <tr>
          <td>סכום הדו"ח:</td>
          <td>${data.ticket.amount} ₪</td>
        </tr>
      </table>
    </div>
    
    <div class="content">
      <p>אני הח"מ, <strong>${data.appellant.fullName}</strong>, ת.ז. <strong>${data.appellant.idNumber}</strong>, פונה אליכם בבקשה לבטל את הדו"ח שבנדון.</p>
      
      <h3>סיבת הערעור: ${reasonLabels[data.appeal.reason] || data.appeal.reasonLabel}</h3>
      
      <p>${data.appeal.description}</p>
      
      ${evidenceHTML}
    </div>
    
    <div class="request">
      <strong>לאור האמור לעיל, אבקש בכבוד לבטל את הדו"ח.</strong>
    </div>
    
    <div class="signature">
      <p>בכבוד רב,</p>
      <p class="name">${data.appellant.fullName}</p>
      <p>ת.ז.: ${data.appellant.idNumber}</p>
      <p>טלפון: ${data.appellant.phone}</p>
      <p>דוא"ל: ${data.appellant.email}</p>
      <p>כתובת: ${data.appellant.address}, ${data.appellant.city}</p>
    </div>
    
    <div class="footer">
      מסמך זה הופק באמצעות מערכת תבעתי | tavati.app
    </div>
  </div>
</body>
</html>
`;
}
