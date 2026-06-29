import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Twitter, MessageCircle, Award } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  courseTitle: string;
  certificateId?: string | null;
}

export function CourseCompleteModal({ open, onClose, courseTitle, certificateId }: Props) {
  useEffect(() => {
    if (!open) return;
    const end = Date.now() + 1200;
    const colors = ["#C9A24A", "#0B1B3A", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
  }, [open]);

  const navigate = useNavigate();
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const casualMsg = `I just completed ${courseTitle} taught by Ryan Rieder on the DCPG Membership Portal! #ChiropracticGrowth #DCPG`;
  const shortMsg = `Just completed "${courseTitle}" with Ryan Rieder on the DCPG Membership Portal! #ChiropracticGrowth #DCPG`;
  const proMsg = `Just completed ${courseTitle} — Ryan Rieder's chiropractic growth training. Highly recommend for any chiropractor looking to grow their practice. #Chiropractic #PracticeGrowth`;

  const shares = [
    {
      label: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(casualMsg)}`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${casualMsg} ${shareUrl}`)}`,
    },
    {
      label: "X / Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shortMsg)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(proMsg)}`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center text-foreground">
            Course Complete! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-gold font-medium pt-1">
            {courseTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          <p className="text-center text-sm text-muted-foreground">Share your win</p>
          <div className="grid grid-cols-2 gap-2">
            {shares.map(({ label, icon: Icon, href }) => (
              <Button
                key={label}
                asChild
                variant="outline"
                className="border-gold/40 text-foreground hover:bg-gold/10 hover:text-foreground"
              >
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-4 w-4 mr-2 text-gold" /> {label}
                </a>
              </Button>
            ))}
          </div>
          {certificateId && (
            <Button
              onClick={() => navigate({ to: `/certificate/${certificateId}` })}
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold/10 gap-2"
            >
              <Award className="h-4 w-4" />
              View Certificate
            </Button>
          )}
          <Button
            onClick={() => navigate({ to: "/dashboard" })}
            className="w-full bg-gold text-gold-foreground hover:bg-gold/90 mt-2"
          >
            Back to Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
