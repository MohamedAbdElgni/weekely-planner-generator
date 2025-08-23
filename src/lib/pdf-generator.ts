import jsPDF from "jspdf";
import { format, startOfWeek, addDays, addWeeks, startOfMonth, getDaysInMonth, getWeek } from "date-fns";
import type { PlannerConfig } from "@/components/PlannerGenerator";

// Paper sizes in mm
const PAPER_SIZES = {
  A4: { width: 210, height: 297 },
  A3: { width: 297, height: 420 }
};

// Translations
const TRANSLATIONS = {
  en: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December'],
    notes: 'Notes',
    week: 'Week',
    reflections: 'Weekly Reflections',
    planning: 'Weekly Planning',
  },
  es: {
    days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    daysShort: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    notes: 'Notas',
    week: 'Semana',
    reflections: 'Reflexiones Semanales',
    planning: 'Planificación Semanal',
  },
  fr: {
    days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
    daysShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
             'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    notes: 'Notes',
    week: 'Semaine',
    reflections: 'Réflexions Hebdomadaires',
    planning: 'Planification Hebdomadaire',
  },
  de: {
    days: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    daysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
             'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    notes: 'Notizen',
    week: 'Woche',
    reflections: 'Wöchentliche Reflexionen',
    planning: 'Wochenplanung',
  }
};

// Type for translation entries to avoid using any
type Translation = typeof TRANSLATIONS['en'];

export const generatePlannerPDF = async (config: PlannerConfig) => {
  const paper = PAPER_SIZES[config.paperSize];
  const doc = new jsPDF('portrait', 'mm', [paper.width, paper.height]);
  const t = TRANSLATIONS[config.language];
  
  // Calculate weeks to generate
  const startDate = new Date(config.year, config.startMonth - 1, 1);
  const endDate = new Date(config.year, config.endMonth, 0);
  const weeks: Date[] = [];
  
  let currentWeekStart = startOfWeek(startDate, { weekStartsOn: config.weekStartDay as 0 | 1 | 2 | 3 | 4 | 5 | 6 });
  while (currentWeekStart <= endDate) {
    weeks.push(currentWeekStart);
    currentWeekStart = addWeeks(currentWeekStart, 1);
  }

  let pageCount = 0;

  for (const weekStart of weeks) {
    // Add planning page before each week
    if (pageCount > 0) doc.addPage();
    generateNotePage(doc, config, t.planning, weekStart, 'planning');
    pageCount++;

    // Add weekly planner page
    doc.addPage();
    generateWeeklyPage(doc, config, weekStart, t);
    pageCount++;

    // Add reflection page after each week
    doc.addPage();
    generateNotePage(doc, config, t.reflections, weekStart, 'reflection');
    pageCount++;
  }

  // Download the PDF
  const fileName = `weekly-planner-${config.year}-${config.paperSize.toLowerCase()}.pdf`;
  doc.save(fileName);
};

const generateNotePage = (
  doc: jsPDF, 
  config: PlannerConfig, 
  title: string, 
  weekStart: Date,
  type: 'planning' | 'reflection'
) => {
  const paper = PAPER_SIZES[config.paperSize];
  const margin = 15;
  const t = TRANSLATIONS[config.language];
  
  // Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, 20);
  
  // Week info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const weekNum = getWeek(weekStart);
  const weekInfo = `${t.week} ${weekNum} • ${format(weekStart, 'MMMM yyyy', { locale: undefined })}`;
  doc.text(weekInfo, margin, 30);
  
  // Subtle decorative line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(margin, 35, paper.width - margin, 35);
  
  // Simple dotted pages for both planning and reflection
  let yPos = 45;
  const pageHeight = paper.height - 60; // Leave some margin at bottom
  const lineSpacing = 8;
  
  while (yPos < pageHeight) {
    // Create dotted line effect using points
    doc.setDrawColor(210, 210, 210);
    const dotSpacing = 3;
    for (let x = margin; x < paper.width - margin; x += dotSpacing) {
      doc.setDrawColor(210, 210, 210);
      doc.circle(x, yPos, 0.2, 'F');
    }
    yPos += lineSpacing;
  }
  
  // Decorative footer
  doc.setDrawColor(150, 150, 150);
  doc.line(margin, paper.height - 20, paper.width - margin, paper.height - 20);
};

const generateWeeklyPage = (doc: jsPDF, config: PlannerConfig, weekStart: Date, t: Translation) => {
  const paper = PAPER_SIZES[config.paperSize];
  const margin = 10;
  
  // Calculate number of days to show based on start and end day
  const daysCount = (config.weekEndDay >= config.weekStartDay) 
    ? config.weekEndDay - config.weekStartDay + 1 
    : 7 - config.weekStartDay + config.weekEndDay + 1;
  
  // Generate weekdays array starting from the configured start day
  const baseWeekStart = startOfWeek(weekStart, { weekStartsOn: config.weekStartDay as 0 | 1 | 2 | 3 | 4 | 5 | 6 });
  const weekDays = Array.from({ length: daysCount }, (_, i) => addDays(baseWeekStart, i));
  
  // Header - conditionally rendered
  let yPos = 24; // Slightly reduced top spacing
  if (config.showHeader) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const weekNum = getWeek(weekStart);
    const monthYear = format(weekStart, 'MMMM yyyy');
    doc.text(`${t.week} ${weekNum} • ${monthYear}`, margin, 14);
  } else {
    yPos = 12; // Start higher if no header
  }
  
  // Mini calendar - removed as requested
  
  // Days header
  const timeColWidth = 12; // Narrower time column to widen planning columns
  const dayWidth = (paper.width - 2 * margin - timeColWidth) / daysCount;
  
  // yPos already set above based on header visibility
  
  // Day headers (single line: e.g., "Mon 15")
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  
  weekDays.forEach((day, index) => {
    const xPos = margin + timeColWidth + (index * dayWidth);
    const dayNum = format(day, 'd');
    const dayName = t.daysShort[((config.weekStartDay + index) + 6) % 7];
    const label = `${dayName} ${dayNum}`;
    doc.text(label, xPos + 2, yPos);
  });
  
  // Reduce spacing between day header and grid
  yPos += 10;
  
  // Compute dynamic slot height to fill available space
  const bottomNotesHeight = 50; // reserved space for notes section
  const limitY = paper.height - (bottomNotesHeight + 10); // keep a small gap above notes
  const slotsCount = (config.endHour - config.startHour + 1) * (60 / config.timeIntervals);
  const availableHeight = Math.max(60, limitY - yPos); // ensure a minimum available area
  const slotHeight = Math.max(3.5, availableHeight / slotsCount);

  // Connect header to grid with a subtle line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  weekDays.forEach((_, dayIndex) => {
    const xPos = margin + timeColWidth + (dayIndex * dayWidth);
    doc.line(xPos, yPos, xPos + dayWidth, yPos);
  });
  
  // Make intervals font lighter/minimal by default
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  
  // Generate time slots with proper loop control
  let shouldStop = false;
  let slotIndex = 0;
  
  for (let hour = config.startHour; hour <= config.endHour; hour++) {
    if (shouldStop) break;
    
    for (let minute = 0; minute < 60; minute += config.timeIntervals) {
      if (yPos > limitY) {
        shouldStop = true;
        break;
      }
      
      const isHourMark = minute === 0;
      const hourStr = config.hourFormat === '12' 
        ? hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString()
        : hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');
      const ampm = config.hourFormat === '12' ? (hour < 12 ? ' AM' : ' PM') : '';
      const timeStr = `${hourStr}:${minuteStr}${ampm}`;
      
      // Time column
      if (isHourMark) {
        // Hour marks: darker and slightly stronger for readability
        doc.setTextColor(40, 40, 40);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(timeStr, margin + 2, yPos + 3);
        // Restore lighter style for intervals by default after drawing hour mark
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
      } else {
        // Interval marks: lighter and smaller
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        const shortTime = config.hourFormat === '12' ? `:${minuteStr}` : minuteStr;
        doc.text(shortTime, margin + 11, yPos + 3);
      }
      
      // Day columns
      weekDays.forEach((_, dayIndex) => {
        const xPos = margin + timeColWidth + (dayIndex * dayWidth);
        

        
        // More minimal grid lines
        if (config.showGrid) {
          if (isHourMark) {
            doc.setDrawColor(200, 200, 200); // Lighter lines for a more minimal look
            doc.setLineWidth(0.2);
          } else {
            doc.setDrawColor(230, 230, 230); // Very light lines for intervals
            doc.setLineWidth(0.1);
          }
          
          // Only draw horizontal lines and vertical separators
          doc.line(xPos, yPos + slotHeight, xPos + dayWidth, yPos + slotHeight);
          if (dayIndex < daysCount - 1) { // Vertical lines between days
            doc.line(xPos + dayWidth, yPos, xPos + dayWidth, yPos + slotHeight);
          }
        } else {
          if (isHourMark) {
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.2);
          } else {
            doc.setDrawColor(240, 240, 240);
            doc.setLineWidth(0.1);
          }
          doc.line(xPos, yPos + slotHeight, xPos + dayWidth, yPos + slotHeight);
        }
      });
      
      yPos += slotHeight;
      slotIndex++;
    }
  }
  
  // Notes section at bottom
  yPos = paper.height - bottomNotesHeight;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 40);
  doc.text(t.notes, margin, yPos);
  
  // Dotted note lines per day column (no checkboxes)
  const notesTop = yPos + 6;
  const notesBottom = paper.height - 10;
  const notesLineSpacing = 6;
  const dotSpacing = 2.5;
  doc.setTextColor(0, 0, 0); // reset for any further text
  
  for (let rowY = notesTop; rowY < notesBottom; rowY += notesLineSpacing) {
    weekDays.forEach((_, dayIndex) => {
      const colX = margin + timeColWidth + (dayIndex * dayWidth);
      // draw dotted row within each day column width
      doc.setDrawColor(200, 200, 200);
      for (let x = colX + 2; x < colX + dayWidth - 2; x += dotSpacing) {
        doc.circle(x, rowY, 0.2, 'F');
      }
    });
  }
};

const generateMiniCalendar = (doc: jsPDF, config: PlannerConfig, weekStart: Date, t: Translation, x: number, y: number) => {
  const monthStart = startOfMonth(weekStart);
  const daysInMonth = getDaysInMonth(monthStart);
  const firstDayOfWeek = startOfWeek(monthStart, { weekStartsOn: 1 });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  
  // Month header
  const monthName = t.months[monthStart.getMonth()];
  doc.text(monthName, x, y);
  
  // Day headers
  doc.setFont('helvetica', 'normal');
  t.daysShort.forEach((day: string, index: number) => {
    doc.text(day.substr(0, 1), x + (index * 8), y + 8);
  });
  
  // Calendar grid
  let currentDate = firstDayOfWeek;
  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      const cellX = x + (day * 8);
      const cellY = y + 15 + (week * 6);
      
      if (currentDate.getMonth() === monthStart.getMonth()) {
        doc.text(currentDate.getDate().toString(), cellX, cellY);
      }
      
      currentDate = addDays(currentDate, 1);
    }
  }
};