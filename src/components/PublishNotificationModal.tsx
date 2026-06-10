import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Mail, Link2, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notifyContentPublished } from "@/lib/notify.functions";

export function PublishNotificationModal({
  contentId,
  contentUrl,
  title,
  open,
  onClose,
}: {
  contentId: string | null;
  contentUrl?: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const notify = useServerFn(notifyContentPublished);

  const url =
    contentUrl ??
    (contentId && typeof window !== "undefined"
      ? `${window.location.origin}/content/${contentId}`
      : "");

  const notifyMut = useMutation({
    mutationFn: async () => {
      if (!contentId) throw new Error("Missing content id");
      return notify({ data: { contentId } });
    },
    onSuccess: (res) => {
      setSent(true);
      toast.success(
        `Emails sent to ${res.emailCount} member${res.emailCount === 1 ? "" : "s"}`,
      );
      setTimeout(onClose, 1200);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied — share it with whoever you like");
      onClose();
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-border bg-card">
        <div className="bg-primary text-primary-foreground p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold flex items-center gap-2">
              <Send className="h-5 w-5 text-gold" /> Content published
            </DialogTitle>
            <DialogDescription className="text-primary-foreground/70 mt-1">
              "{title}" is now live. How would you like to share it?
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-3">
          <button
            type="button"
            disabled={notifyMut.isPending || sent || !contentId}
            onClick={() => notifyMut.mutate()}
            className="w-full text-left rounded-lg border-2 border-gold bg-gold/5 hover:bg-gold/10 transition-colors p-4 flex items-start gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="rounded-lg bg-gold/15 text-gold p-2 shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">
                {notifyMut.isPending ? "Sending…" : "Notify All Members"}
              </div>
              <div className="text-sm text-muted-foreground">
                Email everyone with notifications enabled, with a direct link.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onCopy}
            className="w-full text-left rounded-lg border border-border bg-card hover:border-gold/60 hover:bg-muted/40 transition-colors p-4 flex items-start gap-3"
          >
            <div className="rounded-lg bg-primary/5 text-primary p-2 shrink-0">
              <Link2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">Copy Link Instead</div>
              <div className="text-sm text-muted-foreground">
                Grab the URL and share it manually — no notification sent.
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-left rounded-lg border border-border bg-card hover:border-border hover:bg-muted/40 transition-colors p-4 flex items-start gap-3"
          >
            <div className="rounded-lg bg-muted text-muted-foreground p-2 shrink-0">
              <X className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-display font-bold text-foreground">Skip for now</div>
              <div className="text-sm text-muted-foreground">
                Content is live — members will discover it naturally.
              </div>
            </div>
          </button>
        </div>

        <div className="px-6 pb-5">
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
