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

      console.log("Job creation - Received userId:", userId);

      // Get the user's email from the request headers
      const userEmail = request.headers.get("request.user.email");
      
      if (!userEmail) {
        console.error("Job creation - No user email provided");
        return NextResponse.json({ error: "User email is required" }, { status: 400 });
      }

      console.log("Job creation - User email from headers:", userEmail);

      // Get the user from the users table by email
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .single();

      if (userError || !userData) {
        console.error("Job creation - User not found in database:", userError);
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
      }

      console.log("Job creation - Found user in database with ID:", userData.id);

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
          creator_id: userData.id, // Use the user ID from the users table
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