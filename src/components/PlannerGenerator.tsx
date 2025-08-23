import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfigurationForm } from "./ConfigurationForm";
import { PlannerPreview } from "./PlannerPreview";
import { generatePlannerPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { Calendar, Download, FileText, Settings } from "lucide-react";

export interface PlannerConfig {
  year: number;
  startMonth: number;
  endMonth: number;
  paperSize: "A3" | "A4";
  language: "en" | "es" | "fr" | "de";
  showGrid: boolean;
  startHour: number;
  endHour: number;
  hourFormat: '12' | '24';
  timeIntervals: 10 | 15 | 20 | 30 | 60;
  showHeader: boolean;
  weekStartDay: number; // 0-6 (Sunday-Saturday)
  weekEndDay: number; // 0-6 (Sunday-Saturday)
}

const PlannerGenerator = () => {
  const [config, setConfig] = useState<PlannerConfig>({
    year: new Date().getFullYear(),
    startMonth: 1,
    endMonth: 12,
    paperSize: "A4",
    language: "en",
    showGrid: true,
    startHour: 6,
    endHour: 23,
    hourFormat: '24',
    timeIntervals: 20,
    showHeader: true,
    weekStartDay: 1, // Monday by default
    weekEndDay: 5, // Friday by default
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      toast("Generating your planner...", {
        description: "This may take a few moments",
      });
      
      await generatePlannerPDF(config);
      
      toast.success("Planner generated successfully!", {
        description: "Your PDF has been downloaded",
      });
    } catch (error) {
      toast.error("Failed to generate planner", {
        description: "Please try again or check your settings",
      });
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-accent">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6 shadow-medium">
            <Calendar className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Weekly Planner Generator
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Configuration Panel */}
          <Card className="shadow-soft border-0 md:col-span-1">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">Configuration</CardTitle>
                  <CardDescription>
                    Customize your planner settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ConfigurationForm config={config} onChange={setConfig} />
              
              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  size="lg"
                  className="w-full bg-gradient-primary shadow-medium hover:shadow-strong transition-all duration-300"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>
                    Will generate ~{Math.ceil((config.endMonth - config.startMonth + 1) * 4.3)} pages
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="shadow-soft border-0 md:col-span-3">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl">Preview</CardTitle>
                  <CardDescription>
                    Live preview of your planner design
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <PlannerPreview config={config} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlannerGenerator;