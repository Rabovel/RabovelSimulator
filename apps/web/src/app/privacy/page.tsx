import Link from "next/link";
import { TrendingUp, ArrowLeft } from "lucide-react";
import { LegalDocument } from "@/components/auth/legal-document";
import { PRIVACY_SECTIONS } from "@/content/legal";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold">Raboovel Earn</span>
          </Link>
          <Link
            href="/register"
            className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to register
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-10">
        <LegalDocument title="Privacy Policy" sections={PRIVACY_SECTIONS} />
      </main>
    </div>
  );
}
