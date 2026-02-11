import { Crosshair } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { convertToLocalDateString, toSentenceCase } from "@/lib/helper";
import { motion } from "framer-motion";
import { Trash2, Copy, Check, Calendar } from "lucide-react";
import Image from "next/image";
import { Fragment, useState } from "react";

interface CrosshairModalProps {
  crosshair: Crosshair;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

const CrosshairModal = ({
  crosshair,
  onOpenChange,
  open,
  onDelete,
}: CrosshairModalProps) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(crosshair.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(crosshair.id);
      onOpenChange(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Fragment>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-5xl bg-card border-border/50 p-0 overflow-hidden'>
          {/* Header */}
          <DialogHeader className='px-6 pt-6 pb-4 border-b border-border/30'>
            <DialogTitle className='text-2xl font-bold text-foreground'>
              {toSentenceCase(crosshair.name)}
            </DialogTitle>
            <DialogDescription className='text-muted-foreground'>
              {crosshair.description || "No description provided"}
            </DialogDescription>
            <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2'>
              <Calendar className='w-3.5 h-3.5' />
              <span>
                Created {convertToLocalDateString(crosshair.createdAt)}
              </span>
            </div>
          </DialogHeader>

          {/* Main Content */}
          <div className='p-6 space-y-6'>
            {/* Large Image */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='relative w-full aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted/20'
            >
              <Image
                src={crosshair.imageUrl || "/placeholder.svg"}
                alt={crosshair.name}
                fill
                sizes='(max-width: 1280px) 90vw, 1200px'
                className='object-contain'
                quality={95}
                priority
              />
            </motion.div>

            {/* Code Section */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-semibold text-foreground'>
                  Crosshair Code
                </label>
                <span className='text-xs text-muted-foreground'>
                  {crosshair.code.length} characters
                </span>
              </div>
              <div className='w-full p-4 bg-muted/30 border border-border/50 rounded-lg font-mono text-sm text-foreground break-all max-h-32 overflow-y-auto'>
                {crosshair.code}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className='px-6 pb-6 flex gap-3'>
            <Button
              onClick={handleCopyCode}
              className='flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11'
            >
              {copied ? (
                <>
                  <Check className='w-4 h-4 mr-2' />
                  Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy Code
                </>
              )}
            </Button>

            {onDelete && (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant='outline'
                className='flex-1 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground h-11'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Delete
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className='max-w-md bg-card border-border/50'>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <DialogHeader className='space-y-3'>
              <div className='w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto'>
                <Trash2 className='w-6 h-6 text-destructive' />
              </div>
              <DialogTitle className='text-2xl text-center'>
                Delete Crosshair?
              </DialogTitle>
              <DialogDescription className='text-muted-foreground text-center'>
                Are you sure you want to delete{" "}
                <span className='font-semibold text-foreground'>
                  &quot;{crosshair.name}&quot;
                </span>
                ?
                <br />
                <span className='text-sm'>This action cannot be undone.</span>
              </DialogDescription>
            </DialogHeader>

            <div className='flex gap-3 mt-6'>
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant='outline'
                className='flex-1 h-11'
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className='flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground h-11'
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default CrosshairModal;
