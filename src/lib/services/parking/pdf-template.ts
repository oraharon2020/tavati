// תבנית PDF למכתב ערעור על דוח חניה
import { ParkingAppealData } from './types';

// פונקציה להמרת תאריך לפורמט ישראלי
function formatHebrewDate(dateStr: string): string {
  if (!dateStr) return '';
  
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('he-IL');
    }
  } catch {
    // ignore
  }
  
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[3]}/${match[2]}/${match[1]}`;
  }
  
  return dateStr;
}

// נימוקים משפטיים לפי סיבת הערעור - כלליים וזהירים בלי מספרי סעיפים
function getLegalArguments(reason: string): string {
  const legalArgs: Record<string, string> = {
    no_sign: `
      <p>על פי תקנות התעבורה, חובה לסמן כל איסור חניה בשילוט ברור ונראה לעין. 
      בהעדר שילוט תקין, לא ניתן לצפות מהנהג לדעת על איסור החניה במקום.</p>
      <p>בהתאם לפסיקה, נקבע כי אין להטיל קנס על עבירת חניה במקום שבו השילוט אינו ברור דיו או אינו קיים כלל.</p>
      <p>הרשות המקומית מחויבת להבטיח שילוט תקין וברור, ובהיעדרו - אין להטיל אחריות על הנהג.</p>
    `,
    paid: `
      <p>על פי הדין, תשלום באמצעות אפליקציה או מד חניה מהווה אישור חוקי לחניה במקום.</p>
      <p>במקרה דנן, בוצע תשלום כדין עבור החניה, כפי שניתן להוכיח באמצעות רישומי האפליקציה/קבלה.</p>
      <p>בהתאם לפסיקה, כאשר קיים אישור תשלום תקף - הדוח בטל מעיקרו, 
      גם אם הפקח לא ראה את התשלום בזמן הרישום.</p>
    `,
    disabled: `
      <p>על פי חוק חניה לנכים, בעל תג נכה רשאי לחנות בחניית נכים ובמקומות נוספים הקבועים בחוק.</p>
      <p>התג היה בתוקף בעת האירוע והוצג כנדרש ברכב.</p>
      <p>בהתאם לפסיקה, כאשר תג נכה תקף היה מוצג ברכב - הדוח צריך להתבטל, 
      גם אם הפקח טען שלא ראה את התג.</p>
    `,
    emergency: `
      <p>בהתאם לפסיקה הישראלית, מצב חירום או צורך דחוף מהווים הגנה מפני עבירות חניה.</p>
      <p>בנסיבות שתוארו, לא הייתה ברירה אלא לעצור במקום, וזאת בשל נסיבות דחופות שלא איפשרו 
      חיפוש חניה חוקית.</p>
      <p>נקבע כי יש לבחון כל מקרה לגופו, וכאשר קיימות נסיבות מקלות משמעותיות - 
      יש לשקול ביטול הדוח או הפחתת הקנס.</p>
    `,
    incorrect: `
      <p>על פי תקנות התעבורה, דוח חניה חייב לכלול פרטים מדויקים על העבירה, לרבות מיקום, שעה, ומספר רכב.</p>
      <p>כאשר הפרטים הרשומים בדוח אינם תואמים את המציאות, הדוח פגום ויש לבטלו.</p>
      <p>בהתאם לפסיקה, טעות בפרטים מהותיים בדוח (כגון מספר רכב, מיקום או שעה שגויים) 
      פוגעת בתוקפו ומצדיקה את ביטולו.</p>
    `,
    loading: `
      <p>על פי תקנות התעבורה, פריקה וטעינה מורשות במקומות מסוימים לפרק זמן קצוב.</p>
      <p>במקרה זה, הרכב היה בפריקה/טעינה פעילה בזמן רישום הדוח, פעולה המותרת על פי החוק.</p>
      <p>בהתאם לפסיקה, יש לאפשר זמן סביר לביצוע פריקה וטעינה, ורישום דוח תוך כדי פעולה זו אינו סביר.</p>
    `,
    other: `
      <p>על פי עקרונות הצדק הטבעי והמשפט המנהלי, יש לבחון כל מקרה לגופו ולשקול את מכלול הנסיבות.</p>
      <p>במקרה זה, קיימות נסיבות מיוחדות המצדיקות את ביטול הדוח או הפחתת הקנס.</p>
    `,
  };
  
  return legalArgs[reason] || legalArgs.other;
}

export function generateParkingAppealHTML(data: ParkingAppealData & { signature?: string }): string {
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

  const evidenceHTML = data.appeal?.evidence && data.appeal.evidence.length > 0
    ? `
      <div class="evidence-section">
        <h3>מסמכים וראיות מצורפים:</h3>
        <ul>
          ${data.appeal.evidence.map((item, i) => `<li>נספח ${i + 1} - ${item}</li>`).join('')}
        </ul>
        <p class="evidence-note">* המסמכים והראיות הנ"ל מצורפים לערעור זה ומהווים חלק בלתי נפרד ממנו.</p>
      </div>
    `
    : '';

  const signatureHTML = data.signature 
    ? `<img src="${data.signature}" alt="חתימה" class="signature-image" />`
    : `<div class="signature-line">_________________</div>`;

  const legalArguments = getLegalArguments(data.appeal?.reason || 'other');

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
      margin: 20mm 18mm 20mm 18mm;
    }
    
    body {
      font-family: 'Rubik', 'David', 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.7;
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
      margin-bottom: 25px;
      padding-bottom: 15px;
      border-bottom: 2px solid #16a34a;
    }
    
    .header h1 {
      font-size: 16pt;
      color: #16a34a;
      margin-bottom: 5px;
    }
    
    .header h2 {
      font-size: 13pt;
      color: #333;
      font-weight: normal;
    }
    
    .date-line {
      text-align: left;
      margin-bottom: 15px;
      color: #666;
      font-size: 10pt;
    }
    
    .recipient {
      margin-bottom: 20px;
    }
    
    .recipient strong {
      display: block;
      font-size: 12pt;
    }
    
    .subject {
      margin-bottom: 20px;
      padding: 12px;
      background: #f0fdf4;
      border-right: 4px solid #16a34a;
    }
    
    .subject strong {
      color: #16a34a;
    }
    
    .ticket-details {
      margin-bottom: 20px;
      padding: 12px;
      background: #fafafa;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
    }
    
    .ticket-details table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .ticket-details td {
      padding: 6px 0;
      border-bottom: 1px solid #eee;
      font-size: 10pt;
    }
    
    .ticket-details td:first-child {
      font-weight: bold;
      width: 100px;
      color: #666;
    }
    
    .content {
      margin-bottom: 20px;
    }
    
    .content p {
      margin-bottom: 12px;
      text-align: justify;
    }
    
    .content h3 {
      color: #16a34a;
      margin: 18px 0 10px 0;
      font-size: 12pt;
    }
    
    .content ul {
      margin-right: 20px;
      margin-bottom: 12px;
    }
    
    .content li {
      margin-bottom: 4px;
    }
    
    .legal-section {
      margin: 20px 0;
      padding: 15px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    
    .legal-section h3 {
      color: #1e40af;
      margin-bottom: 10px;
    }
    
    .legal-section p {
      margin-bottom: 10px;
      font-size: 10pt;
    }
    
    .evidence-section {
      margin: 20px 0;
      padding: 12px;
      background: #fffbeb;
      border: 1px solid #fcd34d;
      border-radius: 6px;
    }
    
    .evidence-section h3 {
      color: #92400e;
      margin-bottom: 8px;
    }
    
    .evidence-note {
      font-size: 9pt;
      color: #666;
      font-style: italic;
      margin-top: 10px;
    }
    
    .request {
      margin: 25px 0;
      padding: 15px;
      background: #f0fdf4;
      border: 2px solid #16a34a;
      border-radius: 8px;
      text-align: center;
    }
    
    .request strong {
      font-size: 12pt;
      color: #166534;
    }
    
    .signature-section {
      margin-top: 35px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .signature-block {
      width: 45%;
    }
    
    .signature-block p {
      margin-bottom: 5px;
      font-size: 10pt;
    }
    
    .signature-block .name {
      font-weight: bold;
      font-size: 11pt;
    }
    
    .signature-image {
      max-width: 150px;
      max-height: 60px;
      margin-top: 10px;
    }
    
    .signature-line {
      margin-top: 15px;
      font-size: 14pt;
    }
    
    .declaration {
      margin-top: 25px;
      padding: 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      font-size: 10pt;
    }
    
    .declaration strong {
      color: #991b1b;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="letter">
    <div class="header">
      <h1>בקשה לביטול דו"ח חניה</h1>
      <h2>ערעור על דו"ח מספר ${data.ticket?.ticketNumber || ''}</h2>
    </div>
    
    <div class="date-line">
      תאריך: ${today}
    </div>
    
    <div class="recipient">
      <strong>לכבוד:</strong>
      ${data.ticket?.authority || 'הרשות המקומית'}
      <br>
      מחלקת פניות הציבור / ועדת ערעורים
    </div>
    
    <div class="subject">
      <strong>הנדון: בקשה לביטול דו"ח חניה מספר ${data.ticket?.ticketNumber || ''}</strong>
    </div>
    
    <div class="ticket-details">
      <table>
        <tr>
          <td>מספר דו"ח:</td>
          <td>${data.ticket?.ticketNumber || ''}</td>
        </tr>
        <tr>
          <td>תאריך הדו"ח:</td>
          <td>${formatHebrewDate(data.ticket?.date || '')}${data.ticket?.time ? ` בשעה ${data.ticket.time}` : ''}</td>
        </tr>
        <tr>
          <td>מיקום:</td>
          <td>${data.ticket?.location || ''}</td>
        </tr>
        <tr>
          <td>מספר רכב:</td>
          <td>${data.ticket?.vehicleNumber || ''}</td>
        </tr>
        <tr>
          <td>סכום הדו"ח:</td>
          <td>${data.ticket?.amount || 0} ₪</td>
        </tr>
      </table>
    </div>
    
    <div class="content">
      <p>אני הח"מ, <strong>${data.appellant?.fullName || ''}</strong>, ת.ז. <strong>${data.appellant?.idNumber || ''}</strong>, 
      פונה אליכם בבקשה מנומקת לבטל את הדו"ח שבנדון, מהנימוקים המפורטים להלן.</p>
      
      <h3>א. סיבת הערעור: ${reasonLabels[data.appeal?.reason || ''] || data.appeal?.reasonLabel || 'לא צוינה'}</h3>
      
      <p>${data.appeal?.description || ''}</p>
      
      <div class="legal-section">
        <h3>ב. הנימוקים המשפטיים:</h3>
        ${legalArguments}
      </div>
      
      ${evidenceHTML}
    </div>
    
    <div class="request">
      <strong>לאור כל האמור לעיל, מתבקשת הרשות הנכבדה לבטל את הדו"ח במלואו.</strong>
      <br>
      <span style="font-size: 10pt;">לחלופין, ככל שלא יתקבל הערעור במלואו, מתבקשת הפחתת סכום הקנס בהתאם לנסיבות המקרה.</span>
    </div>
    
    <div class="declaration">
      <strong>הצהרה:</strong> אני מצהיר/ה בזאת כי כל הפרטים הרשומים לעיל הם נכונים ומדויקים, וכי ידוע לי 
      שמסירת פרטים כוזבים מהווה עבירה על פי חוק.
    </div>
    
    <div class="signature-section">
      <div class="signature-block">
        <p>בכבוד רב,</p>
        <p class="name">${data.appellant?.fullName || ''}</p>
        <p>ת.ז.: ${data.appellant?.idNumber || ''}</p>
        <p>טלפון: ${data.appellant?.phone || ''}</p>
        <p>דוא"ל: ${data.appellant?.email || ''}</p>
        <p>כתובת: ${data.appellant?.address || ''}${data.appellant?.city ? `, ${data.appellant.city}` : ''}${data.appellant?.zipCode ? ` ${data.appellant.zipCode}` : ''}</p>
      </div>
      <div class="signature-block" style="text-align: center;">
        <p><strong>חתימה:</strong></p>
        ${signatureHTML}
        <p style="margin-top: 5px; font-size: 9pt;">תאריך: ${today}</p>
      </div>
    </div>
    
    <div class="footer">
      מסמך זה הופק באמצעות מערכת תבעתי | tavati.app
    </div>
  </div>
</body>
</html>
`;
}
