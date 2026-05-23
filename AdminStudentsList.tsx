import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Search, Coins } from "lucide-react";
import { Input } from "@/components/ui/input";

interface StudentProfile {
  user_id: string;
  username: string;
  display_name: string | null;
  created_at: string;
  referral_code: string | null;
  role: string;
  coin_balance: number;
}

const AdminStudentsList = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);

      // Get all profiles (admin RLS allows viewing all)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, created_at, referral_code")
        .order("created_at", { ascending: false });

      if (profilesError || !profiles) {
        console.error("Error fetching profiles:", profilesError);
        setLoading(false);
        return;
      }

      // Get all roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      const roleMap: Record<string, string> = {};
      roles?.forEach((r) => {
        roleMap[r.user_id] = r.role;
      });

      // Get coin balances for each student
      const studentsWithData: StudentProfile[] = await Promise.all(
        profiles.map(async (p) => {
          const { data: balance } = await supabase.rpc("get_user_coin_balance", {
            _user_id: p.user_id,
          });
          return {
            ...p,
            role: roleMap[p.user_id] || "student",
            coin_balance: (balance as number) || 0,
          };
        })
      );

      // Only show students (not admins/staff)
      setStudents(studentsWithData.filter((s) => s.role === "student"));
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      (s.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-card rounded-xl p-8 shadow-card">
        <h2 className="text-xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" /> Students
        </h2>
        <p className="text-muted-foreground animate-pulse">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-secondary" /> Students ({students.length})
        </h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">
          {search ? "No students match your search." : "No students have joined yet."}
        </p>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((student) => (
            <div
              key={student.user_id}
              className="flex items-center gap-3 bg-muted rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {student.display_name || student.username}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  @{student.username}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 text-secondary text-xs font-bold">
                  <Coins className="w-3 h-3" />
                  {student.coin_balance} AC
                </div>
                <p className="text-muted-foreground text-[10px]">
                  Joined {new Date(student.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminStudentsList;
