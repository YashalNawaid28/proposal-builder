import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const brand_id = searchParams.get("brand_id");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    let query = supabase.from("jobs").select("*", { count: "exact" });

    if (status) {
      query = query.eq("status", status);
    }
    if (brand_id) {
      query = query.eq("brand_id", brand_id);
    }
    if (search) {
      query = query.or(
        `job_name.ilike.%${search}%,job_no.ilike.%${search}%,site_city.ilike.%${search}%`
      );
    }
    query = query.order("created_at", { ascending: false });
    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Raw data from query:", JSON.stringify(data, null, 2));

    // Fetch user data for creators and project managers
    const userIds = [
      ...new Set([
        ...(data?.map((job) => job.creator_id).filter(Boolean) || []),
        ...(data?.map((job) => job.pm_id).filter(Boolean) || []),
      ]),
    ];

    console.log("User IDs to fetch:", userIds);

    let usersData: Record<
      string,
      {
        id: string;
        display_name: string;
        avatar_url: string;
        job_title: string;
      }
    > = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, display_name, avatar_url, job_title")
        .in("id", userIds);

      console.log("Users query result:", { users, error: usersError });

      if (!usersError && users) {
        usersData = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {} as Record<string, { id: string; display_name: string; avatar_url: string; job_title: string }>);
      }
    }

    console.log("Users data lookup:", usersData);

    const transformedData =
      data?.map((job) => {
        const creator = job.creator_id
          ? usersData[job.creator_id] || null
          : null;
        const project_manager = job.pm_id ? usersData[job.pm_id] || null : null;

        console.log(
          `Job ${job.id}: creator_id=${job.creator_id}, pm_id=${job.pm_id}`
        );
        console.log(
          `Job ${job.id}: creator=${creator}, project_manager=${project_manager}`
        );

        return {
          ...job,
          creator,
          project_manager,
        };
      }) || [];

    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json(
      {
        data: transformedData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPreviousPage,
          nextPage: hasNextPage ? page + 1 : null,
          previousPage: hasPreviousPage ? page - 1 : null,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("GET /jobs error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
