import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { PlannerConfig } from "./PlannerGenerator";

interface ConfigurationFormProps {
  config: PlannerConfig;
  onChange: (config: PlannerConfig) => void;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
];

export const ConfigurationForm = ({ config, onChange }: ConfigurationFormProps) => {
  const updateConfig = (updates: Partial<PlannerConfig>) => {
    onChange({ ...config, ...updates });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  // Local selection for which configuration group to show
  const [section, setSection] = useState<'basic' | 'week' | 'time' | 'design'>('basic');

  return (
    <div className="space-y-6">
      {/* Configuration Type Selector */}
      <div className="space-y-2">
        <Label htmlFor="configType">Configuration Type</Label>
        <Select value={section} onValueChange={(value: 'basic' | 'week' | 'time' | 'design') => setSection(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic Settings</SelectItem>
            <SelectItem value="week">Week Settings</SelectItem>
            <SelectItem value="time">Time Configuration</SelectItem>
            <SelectItem value="design">Design Options</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Settings */}
      {section === 'basic' && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Basic Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Select
              value={config.year.toString()}
              onValueChange={(value) => updateConfig({ year: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paperSize">Paper Size</Label>
            <Select
              value={config.paperSize}
              onValueChange={(value: "A3" | "A4") => updateConfig({ paperSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                <SelectItem value="A3">A3 (297 × 420 mm)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startMonth">Start Month</Label>
            <Select
              value={config.startMonth.toString()}
              onValueChange={(value) => updateConfig({ startMonth: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endMonth">End Month</Label>
            <Select
              value={config.endMonth.toString()}
              onValueChange={(value) => updateConfig({ endMonth: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.slice(config.startMonth - 1).map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={config.language}
            onValueChange={(value: "en" | "es" | "fr" | "de") => updateConfig({ language: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      )}
      
      {/* Week Settings */}
      {section === 'week' && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Week Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weekStartDay">Week Start Day</Label>
            <Select
              value={config.weekStartDay.toString()}
              onValueChange={(value) => updateConfig({ weekStartDay: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="weekEndDay">Week End Day</Label>
            <Select
              value={config.weekEndDay.toString()}
              onValueChange={(value) => updateConfig({ weekEndDay: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sunday</SelectItem>
                <SelectItem value="1">Monday</SelectItem>
                <SelectItem value="2">Tuesday</SelectItem>
                <SelectItem value="3">Wednesday</SelectItem>
                <SelectItem value="4">Thursday</SelectItem>
                <SelectItem value="5">Friday</SelectItem>
                <SelectItem value="6">Saturday</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      )}
      
      {/* Time Configuration */}
      {section === 'time' && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Time Configuration</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startHour">Start Hour</Label>
            <Select
              value={config.startHour.toString()}
              onValueChange={(value) => updateConfig({ startHour: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {config.hourFormat === '12' 
                      ? i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
                      : `${i.toString().padStart(2, '0')}:00`
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endHour">End Hour</Label>
            <Select
              value={config.endHour.toString()}
              onValueChange={(value) => updateConfig({ endHour: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {config.hourFormat === '12' 
                      ? i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
                      : `${i.toString().padStart(2, '0')}:00`
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hourFormat">Hour Format</Label>
            <Select
              value={config.hourFormat}
              onValueChange={(value: '12' | '24') => updateConfig({ hourFormat: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24-hour (00:00)</SelectItem>
                <SelectItem value="12">12-hour (12:00 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeIntervals">Time Intervals</Label>
            <Select
              value={config.timeIntervals.toString()}
              onValueChange={(value) => updateConfig({ timeIntervals: parseInt(value) as 10 | 15 | 20 | 30 | 60 })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      )}
      
      {/* Design Options */}
      {section === 'design' && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Design Options</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showHeader">Show Header</Label>
              <p className="text-sm text-muted-foreground">
                Display week number and month information
              </p>
            </div>
            <Switch
              id="showHeader"
              checked={config.showHeader}
              onCheckedChange={(checked) => updateConfig({ showHeader: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showGrid">Show Grid Lines</Label>
              <p className="text-sm text-muted-foreground">
                Display subtle grid lines for better organization
              </p>
            </div>
            <Switch
              id="showGrid"
              checked={config.showGrid}
              onCheckedChange={(checked) => updateConfig({ showGrid: checked })}
            />
          </div>

        </div>
      </div>
      )}
    </div>
  );
};