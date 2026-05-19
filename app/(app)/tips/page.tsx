import { ProTipsBoard } from "@/components/ProTipsBoard";
import { getProTips } from "@/lib/pro-tips";
import { createClient } from "@/lib/supabase/server";

export default async function ProTipsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const tips = await getProTips();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Pro Tips</h2>
      <p className="text-base-content/60 mb-6 text-sm">
        Share helpful advice with other fans — parking tricks, budgeting, what to bring, and more.
      </p>
      <ProTipsBoard tips={tips} currentUserId={user?.id ?? ""} />
    </div>
  );
}
