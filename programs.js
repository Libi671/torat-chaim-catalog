// ═══ PROGRAM DATA ═══
//   details   – "תקציר": text taken from the program's summary doc in the Drive folder,
//               plus explanatory images that stay in Drive.
//   materials – "תכנים", one block per item, by type:
//     pdf / doc – a Drive file embedded with Drive's preview. Files too big for the preview
//                 get a compressed "(גרסה לאתר)" copy next to the original.
//     pages     – page images of a booklet in content/<dir>/001.webp…, with the PDF for download
//                 (`pdf`, in content/) or the original in Drive (`driveId`; `excerpt` when only the first pages are shown).
//                 Drive PDFs are shown this way rather than in Drive's preview, which is slow for large files.
//     videos    – YouTube videos (`items: [{ id, title }]`), each with a copy-link button.
//     audio     – podcast episodes played in place (`items: [{ src, driveId, title }]`, the Drive file as fallback).
//     units     – unit buttons; each opens its page images in a popup (`items: [{ dir, count, driveId, title }]`).
//     canva     – a Canva design embedded with its public view link.
//     image     – a single image (`src`), with the source file in Drive (`driveId`).
//     link      – a button to an external page (`url`, `label`).
//     order     – an order form that sends the details to Elad by email.
// Source folder: https://drive.google.com/drive/folders/1j9-xWXyYmwrABB5XXKBGHcTsBw35-D9n
const programs = [
  { id: 1, title: 'אירועי תורת חיים תשפ"ז', desc: 'אירועים קהילתיים ורוחניים לכלל תלמידי הרשת – חוויות שמחברות ומחזקות זהות יהודית.', badge: 'אירועים', file: 'P/WhatsApp Image 2026-05-19 at 05.48.01.jpeg',
    cats: ['ימי שיא'] },
  { id: 2, title: 'השתלמויות תשפ"ו', desc: 'רישום ועדכון ההכשרות לתשפז - יפורסם בקרוב...', badge: 'לוח שנה', file: 'P/אירועים שנתיים תשפו פלייר.jpg',
    cats: ['הכשרת צוותים'] },
  { id: 3, slug: 'emun-veemuna', title: 'אמון ואמונה', desc: 'תוכנית חווייתית לפיתוח חוסן אמוני לתלמידים – דרך העמקה ב-9 עקרונות רוחניים.', badge: 'חוסן אמוני', file: 'P/אמון ואמונה פלייר תשפו.jpg',
    cats: ['מסעות זהות לתלמידים'],
    details: [
      { p: 'תוכנית אמון ואמונה מציעה מודל של תהליך התפתחות רוחנית לבני נוער.' },
      { p: 'התלמידים עוברים מסע העובר בין תשעה עקרונות רוחניים שיוצרים יחד תפיסה אמונית רחבה.' },
      { p: 'המסע מתרחש במהלך שיעור שבועי המוקדש ללימוד אמונה שבו המורה בעזרת מערכי שיעור בנויים מנחה את התלמידים בין תחנות המסע האישי והקבוצתי.' },
      { p: 'התהליך מלווה בספרון אישי לכל תלמיד שמתאר התמודדויות יום-יומיות של בני נוער דתיים, ומגלה כיצד עולם האמונה מחזק ונותן כלים מעשיים לבני הנוער להתחבר לכוחותיהם, מתוך החיבור לאמונה ולזהותם היהודית.' },
      { p: 'הכלים המוצעים למורה בהנחיית התוכנית כוללים: מצגת עם מערכי שיעור, חוברת מערכים למורה, סרטונים יחודיים שפותחו, פודקאסטים ועוד…' },
      { listTitle: 'באתר תוכלו למצוא:', list: ['ספרון הלימוד לתלמיד', 'ספרון למורה הכולל מערכי שיעור', 'סרטונים ופודקאסטים', 'מצגת מלווה'] },
    ],
    // From the doc "אמון ואמונה כלים מלווים להוראה בכיתה" (1lyrEk-dAOhiiv4jmZCqfMr-XY0DzWm5PP2sFQD5qxwU)
    materials: [
      { title: 'מצגת על הנושאים הראשונים', note: 'המצגת מתעדכנת', type: 'canva',
        url: 'https://www.canva.com/design/DAG9ZDzME0I/4Wg3i_MeKXWvIGJuKYevdg/view' },
      { title: 'ספר הדרכה למורה', note: 'עם הצעות למערכים, שיושב על הספרון לתלמיד. אפשר לקבל גם בעותק קשיח. כאן מוצגים העמודים הראשונים',
        type: 'pages', dir: 'emun-guide', count: 24, ratio: 1.387, driveId: '1MknNAouw48Qc75HGP9iGLUzaiyY5Cv5h', excerpt: true, fullLabel: 'לספר המלא' },
      { title: 'סרטונים מקוריים שנבנו לתוכנית', type: 'videos', items: [
        { id: 'm7D0aynRyXw', title: 'הכרה במציאות הרוחנית (עיקרון 1)' },
        { id: '8K4m5WmYvPU', title: 'נפש ארצית – נשמה אלוקית (עיקרון 2)' },
        { id: 'Ss398FYucZE', title: 'השגחה פרטית (עיקרון 3)' },
        { id: 'wP7iAB1-mgk', title: 'קבלה עצמית (עיקרון 4)' },
      ] },
      { title: 'תיקיית סרטונים מלווים ממקורות שונים', type: 'link', label: 'לתיקיית הסרטונים',
        url: 'https://drive.google.com/drive/folders/1vARkpvZoNl3ItmOHoEZtZ6X6ZLK9hTuG' },
      { title: 'בוט מלווה לתלמיד בלימוד התוכנית', note: 'בוט Gemini שמכיר את חומרי התוכנית. נפתח בחלון חדש', type: 'link', label: 'לשיחה עם הבוט',
        url: 'https://gemini.google.com/gem/0c754808d9b3' },
      // One audio file from each principle's Drive folder, re-encoded small (48k mono) and served from content/podcasts,
      // since Drive does not stream reliably to <audio>. The podcasts folder itself also holds an event's
      // registration form and its responses, so it is not linked.
      { title: 'פודקאסטים לכל עיקרון', note: 'לוחצים על כפתור הניגון ליד הפרק', type: 'audio', items: [
        { src: 'content/podcasts/principle-1.m4a', driveId: '1C6IsLlNDon6DGif2_vIV5QL5UJoWr60Y', title: 'עיקרון ראשון – הכרה במציאות הרוחנית' },
        { src: 'content/podcasts/principle-2.m4a', driveId: '1195MluGwHbaBIgZZgKsKvTWyMibP46FS', title: 'עיקרון שני – נשמה ונפש ארצית' },
        { src: 'content/podcasts/principle-3.m4a', driveId: '1pc0CW-LMW-jm8h9f_2F9pPqUEey5U13f', title: 'עיקרון שלישי – השגחה פרטית' },
        { src: 'content/podcasts/principle-4.m4a', driveId: '1aMNZwZVgWzPI_0ouZUetedMQxCr7freJ', title: 'עיקרון רביעי – קבלה עצמית' },
        { src: 'content/podcasts/principle-5.m4a', driveId: '1LqQiw8kjI6svjcrhEu-kYa_vR1HFRB9-', title: 'עיקרון חמישי – הכרת הטוב' },
        { src: 'content/podcasts/principle-6.m4a', driveId: '1A8Fvdim9nLUaRM6m1VF_6z4c4ZV9KFkV', title: 'עיקרון שישי – מקורבן למנהיג' },
        { src: 'content/podcasts/principle-7.m4a', driveId: '1iM6D3PTAITNR6Ez5tLASCt6xspg5CgLb', title: 'עיקרון שביעי – מרכז החיים' },
        { src: 'content/podcasts/principle-8.m4a', driveId: '11LjeyroK86rEnm8hE-_tGad-C4wxGfVi', title: 'עיקרון שמיני' },
        { src: 'content/podcasts/principle-9.m4a', driveId: '1qN79F2QkO5ceRXHs-DJJODy8Scv3RT2D', title: 'עיקרון תשיעי' },
      ] },
    ] },
  { id: 4, slug: 'bar-mitzva', title: 'תוכנית בר/בת מצווה', desc: 'מסלול מקיף ומרתק לקראת בר ובת מצווה – חוויות, ספר לימוד, ליווי אישי ואירועי שיא.', badge: 'בר/בת מצווה', file: 'P/בר מצווה פלייר.jpg',
    cats: ['מסעות זהות לתלמידים'],
    materials: [
      { title: 'עמודי דוגמה מתוך ספר בר המצווה', note: 'לצפייה והתרשמות בלבד. רכישת הספר מתבצעת בטופס ההזמנה בסוף העמוד', jump: { to: 'order', label: 'לטופס ההזמנה' },
        type: 'pages', dir: 'bar-mitzva-sample', count: 24, ratio: 0.686, driveId: '1-M9899AxBOWR8oemwR19dzYeLEpT9A58' },
      { title: 'הזמנת ספרים לבית הספר', note: 'ממלאים את הפרטים, וההזמנה נשלחת במייל לאלעד בר שלום שיחזור אליכם', type: 'order',
        item: 'ספר בר המצווה', email: 'eladbrs@gmail.com' },
    ] },
  { id: 5, slug: 'yeshiva-kehilatit', title: 'הישיבה הקהילתית – בנים', desc: 'חוויית לימוד ישיבתית אותנטית בתוך בית הספר – לימוד עמוק, מפגש בין-גילאי וקהילה.', badge: 'לימוד מעמיק', file: 'P/הישיבה הקהילתית בנים פלייר.jpg',
    cats: ['בית מדרש'],
    // "סיירת הקודש – גרסה 1": the yeshiva version (Community Yeshiva logo, includes highlight days)
    materials: [
      { title: 'סיירת הקודש – מסע זהות רוחני-ערכי', note: 'תחנות המסע, תוכנית הצמיחה, מערכי שיעור ושפת החבורה למנחה',
        type: 'pages', dir: 'sayeret-yeshiva', count: 98, ratio: 1.414, pdf: 'sayeret-yeshiva.pdf' },
    ] },
  { id: 6, slug: 'rabbi-sacks', title: 'מסע זהות יהודית – הרב זקס', desc: 'מסלול דיגיטלי עשיר על פי משנתו של הרב יונתן זקס – מסע לזהות היהודית הייחודית ביותר.', badge: 'זהות יהודית', file: 'P/הרב זקס פלייר תשפו.jpg',
    cats: ['מסעות זהות לתלמידים'],
    materials: [
      { title: 'סרטון הפתיחה – שנת 2044', type: 'videos', items: [
        { id: '-tHqydEB1tY', title: 'סרטון פתיחה: זהות יהודית לאור משנת הרב זקס' },
      ] },
      { title: 'יומן מורים – הרב זקס', note: 'גרסה מעודכנת 2026, להדפסה', type: 'pages', dir: 'sacks-teacher', count: 40, ratio: 0.723, pdf: 'sacks-teacher-journal.pdf' },
      { title: 'יומן מסע לתלמיד – הרב זקס', note: 'גרסה מעודכנת 2026, להדפסה', type: 'pages', dir: 'sacks-student', count: 24, ratio: 0.723, pdf: 'sacks-student-journal.pdf' },
    ] },
  { id: 7, slug: 'musagei-yesod', title: 'מושגי יסוד ביהדות', desc: 'יחידות ללימוד חווייתי ומעמיק של מושגי יסוד – שמע ישראל, מצוות, קידוש ועוד.', badge: 'יחידות לימוד', file: 'P/מושגי יסוד יהדות פלייר.jpg',
    cats: ['מסעות זהות לתלמידים'],
    details: [
      { p: 'יחידות הלימוד להכרות עם מושגי יסוד ביהדות נועדה ליצור הכרות בסיסית עם מושגי היסוד היהודיים, כל זאת כדי לפתח את הזהות היהודית.' },
      { p: 'היחידות פותחו בשילוב מורים ממקיף אמית ב.ש. והמרכז הטכנולוגי של אמית בירושלים.' },
    ],
    // The unit PDFs from Yehuda Rotenberg's folder (1Kav0mQiY2WZth-rxCQQAIBZty7wqdrzm). The folder itself is
    // not linked: it also holds exams and drafts.
    materials: [
      { title: 'יחידות הלימוד', note: 'לוחצים על יחידה והיא נפתחת', type: 'units', items: [
        { dir: 'unit-teacher', count: 4, driveId: '1aVbK3Po7Pb8i54saXdmAg5t13kJfR0rD', title: 'קובץ למורה' },
        { dir: 'unit-shema', count: 16, driveId: '1mrB9toEqjj39NSwWqFX-n46EHrDhoWcl', title: 'שמע ישראל' },
        { dir: 'unit-mezuza', count: 8, driveId: '1a3nOgI0fDU0I8C-jwuTmSgkxnSPah-rm', title: 'מצוות מזוזה' },
        { dir: 'unit-nerot', count: 15, driveId: '1Mozom-apw78ZA4xYbAU1rTswonk4evj-', title: 'מצוות הדלקת נרות' },
        { dir: 'unit-kidush', count: 23, driveId: '1J06ifbFVk_105cSqdKzAAtwFOR9AoEQA', title: 'קידוש' },
        { dir: 'unit-lechem-mishne', count: 11, driveId: '1bxG-TO6LUImTWyl4563R38zv44xz3-I3', title: 'לחם משנה' },
        { dir: 'unit-havdala', count: 11, driveId: '1ftRqARs6aNlPicdD-6Tn7J6bP89HSMuX', title: 'מצוות הבדלה' },
        { dir: 'unit-basar-chalav', count: 14, driveId: '1zYY4pUx3lRZHElOy-a-AZ3FbhlKT2e2d', title: 'הפרדה בין בשר לחלב' },
        { dir: 'unit-asher-yatzar', count: 10, driveId: '1iMb7q3efoD019XwKG4kAjFgEEtKyfrd6', title: 'ברכת אשר יצר' },
        { dir: 'unit-bikur-cholim', count: 9, driveId: '1Yss8wvrWyZx_EE1oWGqRmGmy4kvHpZ7b', title: 'מצוות ביקור חולים' },
        { dir: 'unit-hachnasat-orchim', count: 7, driveId: '17ONjsL8lUbtk2sTNG9AZO4UZc0uNc-X1', title: 'מצוות הכנסת אורחים' },
        { dir: 'unit-luach', count: 8, driveId: '1eiZuaRfJnJlDeKvBSjOmd462MVbTUyys', title: 'לוח השנה העברי' },
        { dir: 'unit-chagim', count: 68, driveId: '1FfnP5Q-CEaltRMcd6WkgJvpR0JoUX13I', title: 'חוברת חגים' },
        { dir: 'unit-kotel', count: 12, driveId: '1z1UpG74J4BMKWYnfdrc67INlM98spJeS', title: 'הכותל המערבי' },
        { dir: 'unit-rabbi-akiva', count: 10, driveId: '1zZ5drUSF4hrd3TBA6h3SfNsRUceMUgOr', title: 'רבי עקיבא' },
      ] },
    ] },
  { id: 8, slug: 'baba-sali', title: 'מסורת בית אבא', desc: 'תוכנית ייחודית שמחברת בין מסורת לחיים המודרניים – דרך עולם הגסטרונומיה היהודית.', badge: 'תרבות יהודית', file: 'P/פלייר בבאסאלי.jpg',
    cats: ['מסעות זהות לתלמידים'],
    materials: [
      { title: 'חוברת מלווה לתלמידים – מסע זהות לאור חכמי ספרד', type: 'pages', dir: 'baba-sali', count: 65, ratio: 1.414, driveId: '10uG-h04LFrBhCjDGJlnin7ucVxSHUXSr' },
    ] },
  { id: 9, slug: 'tefila', title: 'תפילה – תשפ"ו', desc: 'תוכנית לפיתוח קשר אותנטי לתפילה – כלים מעשיים למורים ולתלמידים לתפילה חיה ומשמעותית.', badge: 'תפילה', file: 'P/tefila-flyer-5787-v2.jpg',
    cats: ['מסעות זהות לתלמידים'],
    details: [
      { p: 'תוכנית התפילה באמית מציעה מהלך הוליסטי לקדם את חיבור התלמידים לתפילה' },
      { p: 'המהלך כולל פעילויות שונות ומגוונות.' },
      { listTitle: 'אנו מציעים להתחבר לתפילה דרך מיקוד ב-3 תחנות במהלך התפילה:', list: ['נוכחות', 'הודיה', 'רצון'] },
      { p: 'כדי להכיר ולהעמיק את התחנות אנו מציעים למורים מערכי שיעור בנושא תפילה המחולקים לפי מודל זה, בנוסף לסידור הכולל הדרכה והכוונה לבני הנוער המתפללים.' },
      { p: 'בנוסף אנו מציעים יום שיא עם פעילות VR יחודיות הממחישה את עולם התפילה באופן חוויתי.' },
      { p: 'באתר אנו מציעים לכם גם את מניפת ההדרכות היומיות שמבוססות על התכנים בסידור, ומאפשרות למחנכים לתת הדרכה קצרה וממוקדת לתלמידים לפני התפילה.' },
      { image: '1gu05lcJ-isHERw2dpelukPc2oIRV6WZD', alt: 'תוכנית הוליסטית לקידום התפילה' },
      { image: '1u8bx0MQujAmCkb3BUg_XzfoRm7yx8PVr', alt: 'יום שיא בנושא התפילה בשילוב משקפי VR' },
    ],
    // The siddur first (sent by Elad later), then the order he asked for: fan, booklet, sticky notes; then the videos
    materials: [
      { title: 'סידור נה"ר הלב – עמודי דוגמה', note: 'הסידור שכל תלמיד מקבל בתוכנית, נוסח עדות המזרח. כריכה ועמודים לדוגמה',
        type: 'pages', dir: 'tefila-siddur', count: 5, ratio: 0.77 },
      { title: 'מניפת ההדרכות היומיות – כרטיסיות', type: 'pages', dir: 'tefila-fan', count: 50, ratio: 2.371, driveId: '1iouHSU2hXzRempNZewsmDcUNAij5eJ4N' },
      { title: 'חוברת מערכי שיעור – מסע בסידור התפילה דרך תחנות', note: 'חוברת מעודכנת', type: 'pages', dir: 'tefila-booklet', count: 96, ratio: 1.381, pdf: 'tefila-booklet.pdf' },
      { title: 'פתקיות סטיקינוט להדפסה לכתיבת הערות בסידור', note: 'גודל 45×60', type: 'image', src: 'content/tefila-sticky.webp', ratio: 1.381, driveId: '1gbXcTe6c-bTBXmu1TwKle4RY12sAdlft' },
      { title: 'סרטונים לתלמידים', type: 'videos', items: [
        { id: 'elpQoEiXrFY', title: 'התפילה כטיסה' },
        { id: 'rC9IeoWmgUs', title: 'יסודות התפילה – כוח הנשמה' },
        { id: 'nv2ltgY8G0k', title: 'הצמח צדק (AI) על התפילה' },
        { id: 'kJmYalonImI', title: 'תפילת קבע או רחמים (מחלוקת רמב"ם-רמב"ן)' },
        { id: '8K4m5WmYvPU', title: 'נפש ארצית מול נשמה אלוקית' },
      ] },
    ] },
  { id: 10, title: 'בית מדרש מורים', desc: 'תוכנית בית מדרש לצוותים חינוכיים ומורים – לימוד משותף וצמיחה רוחנית.', badge: 'בית מדרש', file: 'P/BMD_M.jpeg',
    cats: ['בית מדרש'] },
  { id: 11, slug: 'kehilat-habanot', title: 'בית מדרש- קהילת הבנות', desc: 'מדרשת נוטעות שמים לתלמידות קהילת הבנות', badge: 'שואפות גבוהה', file: 'P/WhatsApp Image 2026-05-25 at 23.56.44.jpeg',
    cats: ['בית מדרש'],
    // "סיירת הקודש – גרסה 2": the women's version, for the girls' community and the comprehensive schools
    materials: [
      { title: 'סיירת הקודש – מסע נשי ללמידה בית מדרשית תשפ"ז', note: 'תחנות המסע, תוכנית הצמיחה, מערכי שיעור ושפת החבורה למנחה',
        type: 'pages', dir: 'sayeret-banot', count: 98, ratio: 1.414, pdf: 'sayeret-banot.pdf' },
    ] },
];
