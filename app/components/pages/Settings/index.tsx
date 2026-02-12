"use client";
import {
  useGetCrosshairs,
  useCreateCrosshair,
  useDeleteCrosshair,
  useGetStorageStats,
} from "@/app/shared/hooks/crosshair/useCrosshair";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Download, Trash2, Upload } from "lucide-react";
import CrosshairLoading from "../../shared/crosshair-loading";
import { useState } from "react";
const SettingsComponent = () => {
  const { data, isLoading } = useGetCrosshairs(1, 1000);
  const { data: storageData, isLoading: storageLoading } = useGetStorageStats();
  const { mutate: createCrosshair } = useCreateCrosshair();
  const { mutate: deleteCrosshair } = useDeleteCrosshair();
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);
  const [exportCopied, setExportCopied] = useState<boolean>(false);
  const [importing, setImporting] = useState<boolean>(false);
  if (isLoading || !data) {
    return <CrosshairLoading />;
  }
  const { crosshairs, total } = data;

  const handleExport = () => {
    const dataStr = JSON.stringify(crosshairs, null, 2);
    navigator.clipboard.writeText(dataStr);
    setExportCopied(true);
    setTimeout(() => setExportCopied(false), 2000);
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(crosshairs, null, 2);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/json;charset=utf-8," + encodeURIComponent(dataStr),
    );
    element.setAttribute("download", `crosshair-backup-${Date.now()}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (Array.isArray(imported)) {
              setImporting(true);
              // Import each crosshair to the database
              for (const crosshair of imported) {
                // Validate that the crosshair has required fields
                if (
                  crosshair.name &&
                  crosshair.code &&
                  crosshair.imageUrl &&
                  crosshair.imagePublicId
                ) {
                  createCrosshair({
                    name: crosshair.name,
                    code: crosshair.code,
                    description: crosshair.description || "",
                    imageUrl: crosshair.imageUrl,
                    imagePublicId: crosshair.imagePublicId,
                  });
                }
              }
              setImporting(false);
              alert(`Successfully imported ${imported.length} crosshair(s)`);
            }
          } catch (e) {
            console.error("Failed to import crosshairs", e);
            setImporting(false);
            alert("Failed to import crosshairs. Please check the file format.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    for (const crosshair of crosshairs) {
      deleteCrosshair(crosshair.id);
    }
    setShowClearConfirm(false);
  };
  return (
    <main className='min-h-screen bg-background'>
      <div className='container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='py-20 max-w-4xl mx-auto'
        >
          <h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight'>
            <span className='text-accent'>Settings</span> & Data
          </h1>
          <p className='text-lg text-muted-foreground'>
            Manage your crosshair collection, backup your data, and import
            previous backups.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='max-w-3xl mx-auto mb-12'
        >
          <div className='bg-card border border-border/50 rounded-xl p-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              <div>
                <p className='text-muted-foreground text-sm mb-2'>
                  Total Crosshairs
                </p>
                <p className='text-4xl font-bold text-accent'>{total}</p>
              </div>
              <div className='text-right md:text-left'>
                <p className='text-muted-foreground text-sm mb-2'>Database</p>
                <p className='text-2xl font-semibold text-foreground'>
                  {storageLoading
                    ? "..."
                    : storageData?.databaseStorageKB.toFixed(2) || "0"}{" "}
                  KB
                </p>
              </div>
              <div className='text-left md:text-left'>
                <p className='text-muted-foreground text-sm mb-2'>Images</p>
                <p className='text-2xl font-semibold text-foreground'>
                  {storageLoading
                    ? "..."
                    : storageData?.cloudinaryStorageMB.toFixed(2) || "0"}{" "}
                  MB
                </p>
              </div>
              <div className='text-right'>
                <p className='text-muted-foreground text-sm mb-2'>
                  Total Storage
                </p>
                <p className='text-2xl font-semibold text-accent'>
                  {storageLoading
                    ? "..."
                    : storageData?.totalStorageMB.toFixed(2) || "0"}{" "}
                  MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'
        >
          <div className='bg-card border border-border/50 rounded-xl p-8'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-xl font-bold text-foreground mb-2'>
                  Export
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Copy your data or download as JSON file
                </p>
              </div>
              <Download className='w-6 h-6 text-accent' />
            </div>
            <div className='space-y-3'>
              <Button
                onClick={handleExport}
                className='w-full bg-accent/20 hover:bg-accent text-accent hover:text-accent-foreground border border-accent/50 transition-all'
              >
                {exportCopied ? "Copied to Clipboard" : "Copy to Clipboard"}
              </Button>
              <Button
                onClick={handleDownload}
                variant='outline'
                className='w-full border-border/50 hover:bg-background bg-transparent'
              >
                Download JSON
              </Button>
            </div>
          </div>

          <div className='bg-card border border-border/50 rounded-xl p-8'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-xl font-bold text-foreground mb-2'>
                  Import
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Restore crosshairs from a backup file
                </p>
              </div>
              <Upload className='w-6 h-6 text-accent' />
            </div>
            <Button
              onClick={handleImport}
              disabled={importing}
              className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50'
            >
              {importing ? "Importing..." : "Upload Backup"}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='max-w-3xl mx-auto mb-24'
        >
          <div className='bg-destructive/5 border border-destructive/30 rounded-xl p-8'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-xl font-bold text-destructive mb-2'>
                  Danger Zone
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Permanently delete all your crosshairs
                </p>
              </div>
              <Trash2 className='w-6 h-6 text-destructive' />
            </div>
            <Button
              onClick={() => setShowClearConfirm(true)}
              className='bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold'
            >
              Clear All Data
            </Button>
          </div>
        </motion.div>
      </div>

      <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <DialogContent className='max-w-sm bg-card border-border/50'>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader>
              <DialogTitle className='text-xl text-destructive'>
                Clear All Data?
              </DialogTitle>
              <DialogDescription className='text-muted-foreground'>
                This will permanently delete all {crosshairs.length} crosshair
                {crosshairs.length !== 1 ? "s" : ""} from your vault. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className='flex gap-2 mt-6'>
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant='outline'
                className='flex-1 border-border/50 hover:bg-background'
              >
                Cancel
              </Button>
              <Button
                onClick={handleClearAll}
                className='flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold'
              >
                Delete All
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default SettingsComponent;
