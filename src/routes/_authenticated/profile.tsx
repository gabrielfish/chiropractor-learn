import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MemberNav } from "@/components/MemberNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileDropzone } from "@/components/FileDropzone";
import { uploadAvatar } from "@/lib/storage";
import {
  getMyProfile,
  updateMyProfile,
  updateNotifications,
  submitSupportRequest,
  sendPasswordReset,
} from "@/lib/profile.functions";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — DCPG Membership Portal" }] }),
  component: ProfilePage,
});

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-border shadow-card p-6 md:p-8">
      <h2 className="font-display text-xl font-bold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function ProfilePage() {
  const fetchProfile = useServerFn(getMyProfile);
  const saveProfile = useServerFn(updateMyProfile);
  const saveNotifs = useServerFn(updateNotifications);
  const submitSupport = useServerFn(submitSupportRequest);
  const resetPassword = useServerFn(sendPasswordReset);

  const profileQ = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });

  // Edit profile state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Support form
  const [category, setCategory] = useState<string>("Technical Issue");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submittingSupport, setSubmittingSupport] = useState(false);

  const [sendingReset, setSendingReset] = useState(false);

  useEffect(() => {
    const p = profileQ.data?.profile;
    if (!p) return;
    setFullName(p.full_name ?? "");
    setPhone(p.phone ?? "");
    setPracticeName(p.practice_name ?? "");
    setAvatarUrl(p.avatar_url ?? "");
    setEmailNotif(p.email_notifications ?? true);
    setSmsNotif(p.sms_notifications ?? false);
  }, [profileQ.data]);

  const onSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await saveProfile({
        data: {
          full_name: fullName || null,
          phone: phone || null,
          practice_name: practiceName || null,
          avatar_url: avatarUrl || null,
        },
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingProfile(false);
    }
  };

  const onResetPassword = async () => {
    setSendingReset(true);
    try {
      await resetPassword();
      toast.success("Password reset email sent — check your inbox");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setSendingReset(false);
    }
  };

  const onToggleEmail = async (v: boolean) => {
    setEmailNotif(v);
    try {
      await saveNotifs({ data: { email_notifications: v, sms_notifications: smsNotif } });
    } catch {
      setEmailNotif(!v);
      toast.error("Failed to update preference");
    }
  };

  const onToggleSms = async (v: boolean) => {
    setSmsNotif(v);
    try {
      await saveNotifs({ data: { email_notifications: emailNotif, sms_notifications: v } });
    } catch {
      setSmsNotif(!v);
      toast.error("Failed to update preference");
    }
  };

  const onSubmitSupport = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingSupport(true);
    try {
      await submitSupport({
        data: {
          category: category as "Technical Issue" | "Content Question" | "Account Help" | "Other",
          subject,
          message,
        },
      });
      toast.success("Your message has been received — we'll get back to you shortly.");
      setSubject("");
      setMessage("");
      setCategory("Technical Issue");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmittingSupport(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MemberNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
        <header>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
            Profile & Account
          </h1>
          <p className="text-muted-foreground mt-2">Manage your personal info, security, and preferences.</p>
        </header>

        {/* Edit Profile */}
        <form onSubmit={onSaveProfile}>
          <Section title="Edit Profile" description="Update your personal information.">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="practice_name">Practice Name</Label>
                <Input id="practice_name" value={practiceName} onChange={(e) => setPracticeName(e.target.value)} maxLength={160} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Profile Photo</Label>
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20 shrink-0">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {(fullName || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <FileDropzone
                      label="Upload profile photo"
                      accept="image/*"
                      uploaded={!!avatarUrl}
                      hint="JPG or PNG, square works best"
                      onFile={async (file) => {
                        try {
                          const url = await uploadAvatar(user.id, file);
                          setAvatarUrl(url);
                          await saveProfile({
                            data: {
                              full_name: fullName || null,
                              phone: phone || null,
                              practice_name: practiceName || null,
                              avatar_url: url,
                            },
                          });
                          toast.success("Profile photo updated");
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Upload failed");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

            </div>
            <div className="pt-2">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </Section>
        </form>

        {/* Reset Password */}
        <Section title="Reset Password" description="We'll email you a secure link to set a new password.">
          <Button variant="outline" onClick={onResetPassword} disabled={sendingReset}>
            {sendingReset ? "Sending..." : "Send Reset Email"}
          </Button>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" description="Choose how you want to hear from us.">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div>
              <div className="font-medium text-foreground">Email Notifications</div>
              <div className="text-sm text-muted-foreground">New content, announcements, and account updates.</div>
            </div>
            <Switch checked={emailNotif} onCheckedChange={onToggleEmail} />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium text-foreground">SMS Notifications</div>
              <div className="text-sm text-muted-foreground">Time-sensitive alerts via text message.</div>
            </div>
            <Switch checked={smsNotif} onCheckedChange={onToggleSms} />
          </div>
        </Section>

        {/* Support */}
        <form onSubmit={onSubmitSupport}>
          <Section title="Support" description="Tell us what's going on and we'll get back to you.">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                  <SelectItem value="Content Question">Content Question</SelectItem>
                  <SelectItem value="Account Help">Account Help</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                required
                maxLength={200}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                required
                maxLength={5000}
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={submittingSupport || !subject.trim() || !message.trim()}>
                {submittingSupport ? "Sending..." : "Submit"}
              </Button>
            </div>
          </Section>
        </form>
      </main>
    </div>
  );
}
