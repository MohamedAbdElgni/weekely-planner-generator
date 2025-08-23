import { format, startOfWeek, addDays, getWeek } from "date-fns";
import type { PlannerConfig } from "./PlannerGenerator";
import { Badge } from "@/components/ui/badge";

interface PlannerPreviewProps {
  config: PlannerConfig;
}

export const PlannerPreview = ({ config }: PlannerPreviewProps) => {
  // Create a sample week for preview
  const sampleDate = new Date(config.year, config.startMonth - 1, 15);
  const baseWeekStart = startOfWeek(sampleDate, { weekStartsOn: config.weekStartDay as 0 | 1 | 2 | 3 | 4 | 5 | 6 });
  const daysCount = (config.weekEndDay >= config.weekStartDay)
    ? (config.weekEndDay - config.weekStartDay + 1)
    : (7 - config.weekStartDay + config.weekEndDay + 1);
  const weekDays = Array.from({ length: daysCount }, (_, i) => addDays(baseWeekStart, i));
  const weekNumber = getWeek(sampleDate);

  // Generate time slots based on configuration
  const timeSlots: string[] = [];
  for (let hour = config.startHour; hour <= config.endHour; hour++) {
    for (let minute = 0; minute < 60; minute += config.timeIntervals) {
      const hourStr = config.hourFormat === '12' 
        ? hour === 0 ? '12' : hour > 12 ? (hour - 12).toString() : hour.toString()
        : hour.toString().padStart(2, '0');
      const minuteStr = minute.toString().padStart(2, '0');
      const ampm = config.hourFormat === '12' ? (hour < 12 ? ' AM' : ' PM') : '';
      timeSlots.push(`${hourStr}:${minuteStr}${ampm}`);
    }
  }

  const dayNames = {
    en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  };

  return (
    <div className="w-full">
      <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
        {/* Preview Header - Conditionally rendered */}
        {config.showHeader && (
          <div className="p-4 bg-gradient-secondary border-b">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-xs">
                Week {weekNumber} • {config.paperSize}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Preview
              </Badge>
            </div>
            <h3 className="font-semibold text-sm text-foreground">
              {format(baseWeekStart, 'MMMM yyyy')}
            </h3>
          </div>
        )}

        {/* Week Header (now visually part of the table) */}
        <div className="border-t border-b bg-gradient-accent" style={{ display: 'grid', gridTemplateColumns: `56px repeat(${weekDays.length}, minmax(0, 1fr))` }}>
          <div className="p-1 text-[11px] font-medium border-r">Time</div>
          {weekDays.map((day, index) => {
            const dayLabelIndex = (config.weekStartDay + index + 6) % 7; // align with Mon-first arrays
            return (
              <div
                key={index}
                className="p-1 text-center border-r last:border-r-0"
              >
                <div className="text-[13px] font-semibold leading-tight">
                  {dayNames[config.language][dayLabelIndex]} {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Slots Preview */}
        <div>
          {timeSlots.slice(0, Math.min(timeSlots.length, 15)).map((time, timeIndex) => {
            const isHourMark = timeIndex % (60 / config.timeIntervals) === 0;
            return (
              <div 
                key={time} 
                className={`${
                  isHourMark ? 'border-b-2 border-border' : 'border-b border-border/30'
                }`}
                style={{ display: 'grid', gridTemplateColumns: `56px repeat(${weekDays.length}, minmax(0, 1fr))` }}
              >
                <div className={`p-1 border-r bg-muted/10 flex items-center ${isHourMark ? 'text-[11px] font-medium text-foreground' : 'text-[10px] text-muted-foreground'}`}>
                  {time}
                </div>
                {weekDays.map((day, dayIndex) => {
                  return (
                    <div
                      key={dayIndex}
                      className={`min-h-[22px] border-r last:border-r-0 relative ${
                        config.showGrid ? 'bg-grid-pattern' : ''
                      }`}
                    >
                      {/* Sample content */}
                      {timeIndex === 2 && dayIndex === 1 && (
                        <div className="absolute inset-0 p-1">
                          <div className="bg-primary/10 text-primary text-xs rounded px-1 py-0.5 truncate">
                            Meeting
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Notes Section Preview */}
        <div className="p-3 bg-gradient-secondary/30 border-t">
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${weekDays.length}, minmax(0, 1fr))` }}>
            {weekDays.map((_, index) => (
              <div key={index} className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Notes</div>
                <div className="space-y-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="h-4 border-b border-dotted border-muted-foreground/40" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Format Info */}
      <div className="mt-4 text-center">
        <div className="text-sm text-muted-foreground">
          {config.paperSize} format • {config.language.toUpperCase()} locale
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {config.hourFormat === '12' ? '12-hour' : '24-hour'} format • 
          {config.timeIntervals}min intervals • 
          {config.startHour}:00-{config.endHour}:00
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {config.showGrid ? 'With grid lines' : 'Clean layout'} • 
          {config.showHeader ? ' With header' : ' No header'}
        </div>
      </div>
    </div>
  );
};