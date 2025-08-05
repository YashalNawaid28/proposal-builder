import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
    try {
      const supabase = getServerSupabase();
  
      // Get the user ID from the request headers
      const userId = request.headers.get("request.user.id");
      
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 401 });
      }

      const formData = await request.formData();
      const job_name = formData.get("job_name") as string;
      const job_no = formData.get("job_number") as string;
      const proposal_no = formData.get("proposal_no") as string;
      const site_street = formData.get("site_street") as string;
      const site_city = formData.get("site_city") as string;
      const site_state = formData.get("site_state") as string;
      const site_postcode = formData.get("site_postcode") as string;
      const site_country = formData.get("site_country") as string;
      const brand_id = formData.get("brand_id") as string;
      const pm_id = formData.get("pm_id") as string;
      const client_id = formData.get("client_id") as string;

      const { data, error } = await supabase
        .from("jobs")
        .insert({
          job_name,
          job_no,
          proposal_no,
          site_street,
          site_city,
          site_state,
          site_postcode,
          site_country,
          brand_id,
          pm_id, // Use pm_id instead of manager_id
          client_id, // Add client_id to the job
          creator_id: userId, // Use the user ID from headers
        })
        .select();
  
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
  
      return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
      console.error("POST /jobs error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }