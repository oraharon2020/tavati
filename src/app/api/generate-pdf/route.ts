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

function generateClaimHTML(data: ClaimData): string {
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

  // סעיפי חוק רלוונטיים לפי סוג התביעה
  const legalBasis = {
    consumer: "חוק הגנת הצרכן, התשמ\"א-1981",
    contract: "חוק החוזים (חלק כללי), התשל\"ג-1973",
    rental: "חוק השכירות והשאילה, התשל\"א-1971",
    damage: "פקודת הנזיקין [נוסח חדש]",
    service: "חוק החוזים (תרופות בשל הפרת חוזה), התשל\"א-1970",
    other: "חוק החוזים (חלק כללי), התשל\"ג-1973"
  };
  
  const relevantLaw = legalBasis[data.claim.type as keyof typeof legalBasis] || legalBasis.other;

  const evidenceHTML = data.claim.evidence && data.claim.evidence.length > 0
    ? `
      <h3>ו. ראיות ומסמכים:</h3>
      <p>לכתב תביעה זה מצורפים המסמכים הבאים:</p>
      <ol>
        ${data.claim.evidence.map((item, i) => `<li>נספח ${String.fromCharCode(1488 + i)} - ${item}</li>`).join('')}
      </ol>
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
    
    ol {
      padding-right: 30px;
      margin-bottom: 15px;
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
  
  <div class="case-header" style="text-align: left; border: none; padding: 5px 0;">
    <div>תאריך: ${today}</div>
  </div>
  
  <div class="parties-section">
    <div class="party-row">
      <div class="party-label">התובע:</div>
      <div class="party-details">
        <div><strong>${data.plaintiff.fullName}</strong></div>
        <div>ת.ז. ${data.plaintiff.idNumber}</div>
        <div>${data.plaintiff.address}, ${data.plaintiff.city}${data.plaintiff.zipCode ? ` ${data.plaintiff.zipCode}` : ''}</div>
        <div>טל': ${data.plaintiff.phone} | דוא"ל: ${data.plaintiff.email}</div>
      </div>
    </div>
    
    <div class="vs-section">- נ ג ד -</div>
    
    <div class="party-row">
      <div class="party-label">הנתבע:</div>
      <div class="party-details">
        <div><strong>${data.defendant.name}</strong></div>
        <div>${defendantTypeLabel} ${data.defendant.idOrCompanyNumber}</div>
        <div>${data.defendant.address}, ${data.defendant.city}${data.defendant.zipCode ? ` ${data.defendant.zipCode}` : ''}</div>
        ${data.defendant.phone ? `<div>טל': ${data.defendant.phone}</div>` : ''}
      </div>
    </div>
  </div>
  
  <div class="main-title">כתב תביעה</div>
  
  <div class="section">
    <p style="text-align: center; margin-bottom: 20px;">
      <strong>סכום התביעה: ${data.claim.amount.toLocaleString("he-IL")} ₪</strong>
    </p>
  </div>
  
  <div class="section">
    <h3>א. מבוא</h3>
    <p class="numbered-paragraph">
      1. התובע מגיש בזאת תביעה כספית כנגד הנתבע, לתשלום סך של ${data.claim.amount.toLocaleString("he-IL")} ₪ (${claimTypeHeb}).
    </p>
    <p class="numbered-paragraph">
      2. לבית משפט נכבד זה סמכות עניינית לדון בתביעה, מכוח סעיף 60 לחוק בתי המשפט [נוסח משולב], התשמ"ד-1984, שכן סכום התביעה אינו עולה על 38,900 ₪.
    </p>
    <p class="numbered-paragraph">
      3. לבית משפט נכבד זה סמכות מקומית לדון בתביעה, שכן מקום מושבו של הנתבע הוא בתחום שיפוטו של בית משפט זה.
    </p>
  </div>
  
  <div class="section">
    <h3>ב. העובדות</h3>
    <p class="numbered-paragraph">
      4. ביום ${data.claim.date} התקיימו בין הצדדים יחסים עסקיים/משפטיים כמפורט להלן.
    </p>
    <p class="numbered-paragraph">
      5. ${data.claim.description}
    </p>
  </div>
  
  <div class="section">
    <h3>ג. הנזק</h3>
    <p class="numbered-paragraph">
      6. כתוצאה ממעשי ו/או מחדלי הנתבע, נגרם לתובע נזק כספי בסך של ${data.claim.amount.toLocaleString("he-IL")} ₪.
    </p>
    ${data.claim.breakdown ? `<p class="numbered-paragraph">7. פירוט הנזק: ${data.claim.breakdown}</p>` : ''}
  </div>
  
  <div class="section">
    <h3>ד. הבסיס המשפטי</h3>
    <div class="legal-basis">
      <strong>עילת התביעה מבוססת על:</strong> ${relevantLaw}
    </div>
    <p class="numbered-paragraph">
      ${data.claim.type === 'consumer' ? 
        '8. בהתאם לחוק הגנת הצרכן, התשמ"א-1981, עומדת לתובע הזכות לפיצוי בגין הפרת זכויותיו כצרכן.' :
        data.claim.type === 'contract' ?
        '8. בהתאם לחוק החוזים (חלק כללי), התשל"ג-1973 וחוק החוזים (תרופות בשל הפרת חוזה), התשל"א-1970, הפרת חוזה מקנה לנפגע זכות לפיצויים.' :
        data.claim.type === 'rental' ?
        '8. בהתאם לחוק השכירות והשאילה, התשל"א-1971, הפרת הסכם שכירות מקנה לצד הנפגע זכות לסעדים.' :
        data.claim.type === 'damage' ?
        '8. בהתאם לפקודת הנזיקין [נוסח חדש], מי שגרם לנזק בשל רשלנות חייב לפצות את הניזוק בגין נזקיו.' :
        '8. בהתאם לדין הכללי, הפרת התחייבות מקנה לנפגע זכות לתבוע פיצויים.'}
    </p>
  </div>
  
  <div class="section">
    <h3>ה. ניסיונות פנייה מוקדמת</h3>
    <p class="numbered-paragraph">
      9. התובע פנה אל הנתבע פעמים מספר בניסיון ליישב את המחלוקת מחוץ לכותלי בית המשפט, אך פניותיו לא נענו ו/או נדחו.
    </p>
  </div>
  
  ${data.claim.evidence && data.claim.evidence.length > 0 ? `
  <div class="section">
    <h3>ו. ראיות</h3>
    <p>לתמיכה בתביעה זו, מצורפים המסמכים הבאים:</p>
    <ol>
      ${data.claim.evidence.map((item, i) => `<li>נספח ${String.fromCharCode(1488 + i)}: ${item}</li>`).join('')}
    </ol>
  </div>
  ` : ''}
  
  <div class="section">
    <h3>ז. הסעד המבוקש</h3>
    <p>לאור כל האמור לעיל, מתבקש בית המשפט הנכבד:</p>
    <ol>
      <li>לחייב את הנתבע לשלם לתובע סך של <strong>${data.claim.amount.toLocaleString("he-IL")} ₪</strong>, בצירוף הפרשי הצמדה וריבית כחוק מיום הגשת התביעה ועד התשלום המלא בפועל.</li>
      <li>לחייב את הנתבע בתשלום אגרת בית המשפט.</li>
      <li>לחייב את הנתבע בהוצאות משפט.</li>
    </ol>
  </div>
  
  <div class="declaration-section">
    <div class="declaration-title">הצהרת התובע</div>
    <p>אני, החתום מטה, מצהיר בזאת כדלקמן:</p>
    <ol>
      <li>לא הגשתי בשנה האחרונה יותר מחמש תביעות בבית משפט זה לתביעות קטנות.</li>
      <li>כל העובדות המפורטות בכתב תביעה זה הן אמת.</li>
      <li>ידוע לי כי הצהרה זו מהווה תחליף לתצהיר, וכי מסירת פרטים כוזבים בה מהווה עבירה פלילית לפי חוק העונשין.</li>
    </ol>
  </div>
  
  <div class="signature-section">
    <p>בכבוד רב,</p>
    <div class="signature-line"></div>
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
