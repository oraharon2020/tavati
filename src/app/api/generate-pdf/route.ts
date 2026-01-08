import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { ClaimData, calculateFee, findCourtByCity, CLAIM_TYPES } from "@/lib/types";
import { generateParkingAppealHTML } from "@/lib/services/parking";
import { ParkingAppealData } from "@/lib/services/parking/types";
import { ServiceType } from "@/lib/services";

// Helper to get browser for Vercel or local
async function getBrowser() {
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  
  if (isVercel) {
    // Running on Vercel - use chromium
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    // Running locally - use system Chrome
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.platform === 'darwin' 
        ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : '/usr/bin/google-chrome',
    });
  }
}

function generateClaimHTML(data: ClaimData & { signature?: string }): string {
  const today = new Date().toLocaleDateString("he-IL");
  const fee = calculateFee(data.claim.amount);
  
  // בחירת בית משפט אוטומטית לפי עיר הנתבע
  const court = data.court || findCourtByCity(data.defendant.city);
  
  // סוג התביעה בעברית
  const claimTypeHeb = CLAIM_TYPES[data.claim.type as keyof typeof CLAIM_TYPES]?.label || "כספית";
  
  const defendantTypeLabel =
    data.defendant.type === "company"
      ? "ח.פ."
      : data.defendant.type === "business"
      ? "ע.מ."
      : "ת.ז.";

  // תיאור סוג הנתבע
  const defendantTypeDescription =
    data.defendant.type === "company"
      ? `חברה בע"מ, ח.פ. ${data.defendant.idOrCompanyNumber}`
      : data.defendant.type === "business"
      ? `עוסק מורשה, ע.מ. ${data.defendant.idOrCompanyNumber}`
      : `אדם פרטי, ת.ז. ${data.defendant.idOrCompanyNumber}`;

  // חתימה - תמונה או קו
  const signatureHTML = data.signature 
    ? `<img src="${data.signature}" alt="חתימה" style="max-width: 150px; max-height: 60px;" />`
    : `<div class="signature-line"></div>`;

  // סעיפי חוק רלוונטיים לפי סוג התביעה
  const legalBasis: Record<string, string> = {
    consumer: "חוק הגנת הצרכן, התשמ\"א-1981",
    contract: "חוק החוזים (חלק כללי), התשל\"ג-1973",
    rental: "חוק השכירות והשאילה, התשל\"א-1971",
    damage: "פקודת הנזיקין [נוסח חדש]",
    service: "חוק החוזים (תרופות בשל הפרת חוזה), התשל\"א-1970",
    defamation: "חוק איסור לשון הרע, התשכ\"ה-1965",
    privacy: "חוק הגנת הפרטיות, התשמ\"א-1981",
    employment: "חוק הגנת השכר, התשי\"ח-1958 וחוק פיצויי פיטורים, התשכ\"ג-1963",
    insurance: "חוק חוזה הביטוח, התשמ\"א-1981",
    copyright: "חוק זכות יוצרים, התשס\"ח-2007",
    other: "חוק החוזים (חלק כללי), התשל\"ג-1973"
  };
  
  const relevantLaw = legalBasis[data.claim.type] || legalBasis.other;

  // פירוט נזקים (אם יש breakdown)
  const damageItems = data.claim.breakdown ? data.claim.breakdown.split(/[,،;]/).map(s => s.trim()).filter(s => s.length > 0) : [];
  
  // ראיות ונספחים
  const evidenceItems = data.claim.evidence || [];

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
      margin: 20mm 15mm 25mm 15mm;
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
    
    .header {
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    
    .state-emblem {
      font-size: 11pt;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .court-name {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .court-address {
      font-size: 10pt;
      color: #333;
    }
    
    .case-info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      border: 1px solid #000;
    }
    
    .case-info-table td {
      padding: 8px 12px;
      border: 1px solid #000;
    }
    
    .case-info-table .info-label {
      font-weight: bold;
      background: #f5f5f5;
      width: 20%;
    }
    
    .case-info-table .info-value {
      width: 30%;
    }
    
    .case-header {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      padding: 8px 15px;
      border: 1px solid #000;
    }
    
    .case-number {
      font-weight: bold;
      font-size: 13pt;
    }
    
    .parties-section {
      margin: 25px 0;
      page-break-inside: avoid;
    }
    
    .party-row {
      display: flex;
      margin-bottom: 15px;
    }
    
    .party-label {
      font-weight: bold;
      font-size: 12pt;
      min-width: 80px;
    }
    
    .party-details {
      flex: 1;
    }
    
    .party-details div {
      margin-bottom: 2px;
    }
    
    .vs-section {
      text-align: center;
      margin: 20px 0;
      font-size: 13pt;
      font-weight: bold;
    }
    
    .main-title {
      text-align: center;
      font-size: 18pt;
      font-weight: bold;
      margin: 30px 0 25px 0;
      text-decoration: underline;
    }
    
    .section {
      page-break-inside: avoid;
      margin-bottom: 20px;
    }
    
    .summary-section {
      background: #f9f9f9;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 25px;
    }
    
    .conclusion-section {
      background: #f0f7ff;
      padding: 15px;
      border: 1px solid #ccc;
      margin-top: 25px;
    }
    
    h3 {
      font-size: 13pt;
      font-weight: bold;
      margin: 25px 0 12px 0;
      text-decoration: underline;
    }
    
    p {
      margin-bottom: 12px;
      text-align: justify;
      text-indent: 0;
    }
    
    .numbered-paragraph {
      margin-bottom: 12px;
      text-align: justify;
      padding-right: 25px;
      text-indent: -25px;
    }
    
    ol, ul {
      padding-right: 30px;
      margin-bottom: 15px;
    }
    
    ul.evidence-list, ul.damage-list {
      list-style-type: none;
      padding-right: 25px;
    }
    
    ul.evidence-list li, ul.damage-list li {
      margin-bottom: 8px;
      padding-right: 0;
    }
    
    li {
      margin-bottom: 8px;
      text-align: justify;
    }
    
    .legal-basis {
      margin: 15px 0;
      padding: 12px;
      border: 1px solid #000;
      background: #f9f9f9;
    }
    
    .signature-section {
      margin-top: 50px;
      page-break-inside: avoid;
    }
    
    .signature-line {
      margin-top: 40px;
      width: 200px;
      border-bottom: 1px solid #000;
      display: inline-block;
    }
    
    .declaration-section {
      margin-top: 30px;
      padding: 15px;
      border: 2px solid #000;
      page-break-inside: avoid;
    }
    
    .declaration-title {
      font-weight: bold;
      font-size: 13pt;
      text-decoration: underline;
      margin-bottom: 12px;
    }
    
    .fee-section {
      margin-top: 25px;
      padding: 12px;
      border: 1px solid #000;
      page-break-inside: avoid;
    }
    
    .fee-title {
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 8px;
    }
    
    .fee-amount {
      font-size: 14pt;
      font-weight: bold;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #000;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
    
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="state-emblem">מדינת ישראל</div>
    <div class="state-emblem">הרשות השופטת</div>
    <div class="court-name">${court?.name || "בית משפט לתביעות קטנות"}</div>
    ${court?.address ? `<div class="court-address">${court.address}</div>` : ''}
  </div>
  
  <table class="case-info-table">
    <tr>
      <td class="info-label">תיק מס':</td>
      <td class="info-value">____________</td>
      <td class="info-label">מהות התביעה:</td>
      <td class="info-value">${claimTypeHeb}</td>
    </tr>
    <tr>
      <td class="info-label">סכום התביעה:</td>
      <td class="info-value"><strong>${data.claim.amount.toLocaleString("he-IL")} ₪</strong></td>
      <td class="info-label">תאריך:</td>
      <td class="info-value">${today}</td>
    </tr>
  </table>
  
  <div class="parties-section">
    <div class="party-row">
      <div class="party-label">התובע:</div>
      <div class="party-details">
        <div><strong>${data.plaintiff.fullName}</strong>, ת.ז. ${data.plaintiff.idNumber}</div>
        <div>מרח' ${data.plaintiff.address}, ${data.plaintiff.city}${data.plaintiff.zipCode ? ` ${data.plaintiff.zipCode}` : ''}</div>
        <div>טל': ${data.plaintiff.phone} | דוא"ל: ${data.plaintiff.email}</div>
      </div>
    </div>
    
    <div class="vs-section">- נגד -</div>
    
    <div class="party-row">
      <div class="party-label">הנתבע:</div>
      <div class="party-details">
        <div><strong>${data.defendant.name}</strong>, ${defendantTypeLabel} ${data.defendant.idOrCompanyNumber}</div>
        <div>מרח' ${data.defendant.address}, ${data.defendant.city}${data.defendant.zipCode ? ` ${data.defendant.zipCode}` : ''}</div>
        ${data.defendant.phone ? `<div>טל': ${data.defendant.phone}</div>` : ''}
      </div>
    </div>
  </div>
  
  <div class="main-title">כתב תביעה</div>
  
  <!-- התביעה בתמצית -->
  <div class="section summary-section">
    <h3>התביעה בתמצית</h3>
    <p>
      התובע מתכבד להגיש לבית המשפט הנכבד כתב תביעה זה כנגד הנתבע. בית המשפט הנכבד יתבקש להורות לנתבע להשיב לתובע את מלוא הסכום בסך <strong>${data.claim.amount.toLocaleString("he-IL")} ₪</strong> בצירוף הפרשי הצמדה וריבית כחוק מיום התשלום ועד למועד התשלום בפועל.
    </p>
  </div>
  
  <!-- הצדדים -->
  <div class="section">
    <h3>הצדדים</h3>
    <p class="numbered-paragraph">
      1. התובע הינו אדם פרטי, בעל ת.ז. ${data.plaintiff.idNumber}, המתגורר ב${data.plaintiff.city}.
    </p>
    <p class="numbered-paragraph">
      2. הנתבע הינו ${defendantTypeDescription}, הפועל מ${data.defendant.city}.
    </p>
  </div>
  
  <!-- הרקע העובדתי -->
  <div class="section">
    <h3>הרקע העובדתי</h3>
    <p class="numbered-paragraph">
      3. ביום ${data.claim.date} נוצר קשר עסקי/משפטי בין התובע לבין הנתבע בעניין ${claimTypeHeb}.
    </p>
    <p class="numbered-paragraph">
      4. ${data.claim.description}
    </p>
    ${evidenceItems.length > 0 ? `
    <p class="numbered-paragraph">
      5. לכתב תביעה זה מצורפים המסמכים הבאים כנספחים:
    </p>
    <ul class="evidence-list">
      ${evidenceItems.map((item, i) => `<li>מצ"ב ${item}, מסומן כנספח ${String.fromCharCode(1488 + i)}.</li>`).join('')}
    </ul>
    ` : ''}
    <p class="numbered-paragraph">
      ${evidenceItems.length > 0 ? '6' : '5'}. כפי שיוכח, הנתבע בחר לפעול בחוסר תום לב כלפי התובע, תוך ניסיונות להתחמק מהשלמת התחייבויותיו כנדרש.
    </p>
  </div>
  
  ${damageItems.length > 0 ? `
  <!-- הליקויים/הנזקים -->
  <div class="section">
    <h3>הנזקים והליקויים</h3>
    <p class="numbered-paragraph">
      ${evidenceItems.length > 0 ? '7' : '6'}. הנתבע הפר את התחייבויותיו ואת החוזה, באופן שגרם לתובע את הנזקים הבאים:
    </p>
    <ul class="damage-list">
      ${damageItems.map((item, i) => `<li>${evidenceItems.length > 0 ? '7' : '6'}.${i + 1}. ${item}</li>`).join('')}
    </ul>
  </div>
  ` : `
  <!-- הנזק -->
  <div class="section">
    <h3>הנזק</h3>
    <p class="numbered-paragraph">
      ${evidenceItems.length > 0 ? '7' : '6'}. כתוצאה ממעשי ו/או מחדלי הנתבע, נגרם לתובע נזק כספי בסך של ${data.claim.amount.toLocaleString("he-IL")} ₪.
    </p>
    <p class="numbered-paragraph">
      ${evidenceItems.length > 0 ? '8' : '7'}. התובע יצא נפסד על לא עוול בכפו מההתקשרות עם הנתבע, שלא כדין ובניגוד גמור להסכמות בין הצדדים.
    </p>
  </div>
  `}
  
  <!-- הבסיס המשפטי -->
  <div class="section">
    <h3>הבסיס המשפטי</h3>
    <div class="legal-basis">
      <strong>עילת התביעה מבוססת על:</strong> ${relevantLaw}
    </div>
    <p class="numbered-paragraph">
      ${data.claim.type === 'consumer' ? 
        'הפרת התחייבויות הנתבע כמפורט לעיל מהווה הפרה של חוק הגנת הצרכן, התשמ"א-1981, המקנה לתובע זכות לפיצוי בגין הפרת זכויותיו כצרכן.' :
        data.claim.type === 'contract' ?
        'הפרת ההסכם על ידי הנתבע מהווה הפרה יסודית של חוק החוזים (חלק כללי), התשל"ג-1973, וחוק החוזים (תרופות בשל הפרת חוזה), התשל"א-1970, אשר מקנה לנפגע זכות לפיצויים, ביטול והשבה.' :
        data.claim.type === 'rental' ?
        'הפרת הסכם השכירות מהווה הפרה של חוק השכירות והשאילה, התשל"א-1971, המקנה לצד הנפגע זכות לסעדים.' :
        data.claim.type === 'damage' ?
        'מעשי הנתבע מהווים עוולה לפי פקודת הנזיקין [נוסח חדש], ומי שגרם לנזק בשל רשלנות חייב לפצות את הניזוק בגין נזקיו.' :
        data.claim.type === 'defamation' ?
        'מעשי הנתבע מהווים עוולה של לשון הרע בהתאם לחוק איסור לשון הרע, התשכ"ה-1965. הפרסום הפוגע פגע בשמו הטוב של התובע והמקנה לו זכות לפיצויים ללא הוכחת נזק.' :
        data.claim.type === 'privacy' ?
        'מעשי הנתבע מהווים פגיעה בפרטיות בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, המקנה לנפגע זכות לפיצויים בגין הפגיעה בפרטיותו.' :
        data.claim.type === 'employment' ?
        'מעשי הנתבע מהווים הפרה של חוקי העבודה, לרבות חוק הגנת השכר, התשי"ח-1958, חוק פיצויי פיטורים, התשכ"ג-1963, וחוקי המגן השונים, המקנים לתובע זכות לפיצויים.' :
        data.claim.type === 'insurance' ?
        'התנהלות הנתבעת (חברת הביטוח) מהווה הפרה של חוק חוזה הביטוח, התשמ"א-1981, ושל חובת תום הלב המוגברת החלה על מבטחים, המקנה לתובע זכות לפיצויים.' :
        data.claim.type === 'copyright' ?
        'מעשי הנתבע מהווים הפרה של חוק זכות יוצרים, התשס"ח-2007, אשר קובע כי שימוש ביצירה ללא רשות מהווה הפרת זכויות יוצרים המקנה לבעל הזכויות פיצויים.' :
        'הפרת ההתחייבות על ידי הנתבע מקנה לתובע זכות לתבוע פיצויים בהתאם לדין.'}
    </p>
    <p class="numbered-paragraph">
      למותר לציין שהתנהלות הנתבע מפרה אינספור חוקים ודינים, שרירותית וחסרת תום לב, תוך שהיא מסבה נזקים מגוונים ועוגמת נפש עצומה לתובע.
    </p>
  </div>
  
  <!-- הסעדים המבוקשים -->
  <div class="section">
    <h3>הסעדים המבוקשים</h3>
    <p>לאור מעשיו ומחדליו של הנתבע כפי שפורטו לעיל, יתבקש בית המשפט הנכבד להורות לנתבע לפעול כדלקמן:</p>
    <p class="numbered-paragraph">
      א. להשיב לתובע את מלוא הסכום בסך <strong>${data.claim.amount.toLocaleString("he-IL")} ₪</strong>, בצירוף הפרשי הצמדה וריבית כחוק מיום התשלום ועד התשלום המלא בפועל.
    </p>
    <p class="numbered-paragraph">
      ב. לשלם לתובע פיצויים בגין עוגמת הנפש, בזבוז הזמן והטרחה שנגרמו לו.
    </p>
    <p class="numbered-paragraph">
      ג. לשאת בכל הוצאות המשפט, כולל אגרת בית משפט.
    </p>
  </div>
  
  <!-- סעיפי סגירה משפטיים -->
  <div class="section">
    <h3>הוראות כלליות</h3>
    <p class="numbered-paragraph">
      לבית המשפט הנכבד סמכות מקומית ועניינית לדון בתביעה.
    </p>
    <p class="numbered-paragraph">
      כל טענה או עובדה הנטענת ע"י התובע בכתב תביעה זה נטענת באופן מצטבר, משלים או חלופי לכל טענה או עובדה אחרת הנכללת בו, בין אם נאמר הדבר באופן מפורש ובין אם לאו, והכל לפי הקשר הדברים.
    </p>
    <p class="numbered-paragraph">
      התובע אינו מקבל על עצמו את עול ההוכחה, נטל השכנוע, או נטל הראיה בכל מקום שעול או נטל זה אינו מוטל עליו על פי דין, ושום דבר הכלול בתביעה זו לא יתפרש בניגוד לכך.
    </p>
  </div>
  
  <!-- סוף דבר -->
  <div class="section conclusion-section">
    <h3>סוף דבר</h3>
    <p>
      <strong>אשר על כן</strong>, ולאור כל האמור לעיל, מתבקש בית המשפט הנכבד לחייב את הנתבע לשלם לתובע סך <strong>${data.claim.amount.toLocaleString("he-IL")} ₪</strong>, בצירוף הפרשי הצמדה וריבית ממועד הגשת התביעה ועד התשלום המלא בפועל.
    </p>
    <p style="text-align: center; margin-top: 15px;">
      <em>יהא זה מן הדין ומן הצדק להיעתר למבוקש במסגרת כתב תביעה זה.</em>
    </p>
  </div>
  
  <div class="declaration-section">
    <div class="declaration-title">הצהרת התובע</div>
    <p>אני, החתום מטה, מצהיר בזאת כדלקמן:</p>
    <ol>
      <li>התובע מצהיר שהוא עומד בתנאי החוק בקשר להגשת תביעה זו.</li>
      <li>לא הגשתי בשנה האחרונה יותר מחמש תביעות בבית משפט זה לתביעות קטנות.</li>
      <li>כל העובדות המפורטות בכתב תביעה זה הן אמת.</li>
      <li>ידוע לי כי הצהרה זו מהווה תחליף לתצהיר, וכי מסירת פרטים כוזבים בה מהווה עבירה פלילית לפי חוק העונשין.</li>
    </ol>
  </div>
  
  <div class="signature-section">
    <p>בכבוד רב,</p>
    ${signatureHTML}
    <p style="margin-top: 5px;">____________________</p>
    <p><strong>${data.plaintiff.fullName}</strong></p>
    <p>תאריך: ${today}</p>
  </div>
  
  <div class="footer">
    מסמך זה הופק באמצעות מערכת "תבעתי" | ${today}
  </div>
</body>
</html>
  `;
}

interface PDFAttachment {
  name: string;
  url?: string;
  type: string;
}

function generateAttachmentsHTML(attachments: PDFAttachment[]): string {
  if (!attachments || attachments.length === 0) return '';
  
  return attachments.map((attachment, idx) => {
    const letter = String.fromCharCode(1488 + idx); // Hebrew letters: א, ב, ג...
    const isImage = attachment.type?.startsWith('image/') || attachment.url?.startsWith('data:image');
    
    if (isImage && attachment.url) {
      return `
        <div class="attachment-page" style="page-break-before: always; padding: 20mm;">
          <div style="text-align: center; margin-bottom: 15mm;">
            <h2 style="font-size: 18pt; margin-bottom: 5mm;">נספח ${letter} - ${attachment.name}</h2>
            <p style="font-size: 10pt; color: #666;">מצורף לכתב תביעה</p>
          </div>
          <div style="text-align: center;">
            <img src="${attachment.url}" style="max-width: 100%; max-height: 220mm; object-fit: contain;" />
          </div>
        </div>
      `;
    } else {
      // For non-image files, show a placeholder
      return `
        <div class="attachment-page" style="page-break-before: always; padding: 20mm;">
          <div style="text-align: center; margin-bottom: 15mm;">
            <h2 style="font-size: 18pt; margin-bottom: 5mm;">נספח ${letter} - ${attachment.name}</h2>
            <p style="font-size: 10pt; color: #666;">מצורף לכתב תביעה</p>
          </div>
          <div style="text-align: center; padding: 40mm 20mm; border: 2px dashed #ccc; border-radius: 10px;">
            <p style="font-size: 14pt; color: #666;">קובץ מסוג ${attachment.type || 'לא ידוע'}</p>
            <p style="font-size: 12pt; color: #999; margin-top: 5mm;">יש לצרף את הקובץ בנפרד בעת הגשה לבית המשפט</p>
          </div>
        </div>
      `;
    }
  }).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Detect service type - from explicit param or by inspecting data structure
    let serviceType: ServiceType = body.serviceType;
    
    if (!serviceType) {
      // Auto-detect based on data structure
      const data = body.parkingAppealData || body.claimData || body;
      if (data.appellant && data.ticket) {
        serviceType = 'parking';
      } else {
        serviceType = 'claims';
      }
    }
    
    // Support both old format (data directly) and new format
    const attachments: PDFAttachment[] = body.attachments || [];
    
    let html: string;
    let filename: string;
    
    if (serviceType === 'parking') {
      // Parking appeal
      const data: ParkingAppealData = body.parkingAppealData || body.claimData || body;
      html = generateParkingAppealHTML(data);
      filename = `parking-appeal-${data.ticket?.ticketNumber || 'document'}.pdf`;
    } else {
      // Small claims (default)
      const data: ClaimData = body.claimData || body;
      html = generateClaimHTML(data);
      filename = 'claim.pdf';
      
      // If there are attachments, add them before closing </body>
      if (attachments.length > 0) {
        const attachmentsHtml = generateAttachmentsHTML(attachments);
        html = html.replace('</body>', `${attachmentsHtml}</body>`);
      }
    }
    
    const browser = await getBrowser();
    
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; font-size: 9px; text-align: center; color: #666; font-family: Arial, sans-serif; padding: 5px 0;">
          עמוד <span class="pageNumber"></span> מתוך <span class="totalPages"></span>
        </div>
      `,
      margin: {
        top: '15mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    });
    
    await browser.close();
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
