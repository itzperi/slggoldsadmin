'use server'

import { z } from "zod"
import { revalidatePath } from "next/cache"

const FUNCTION_URL = 'https://lvabuspixfgscqidyfki.supabase.co/functions/v1/admin-action';

async function callMcp(action: string, payload: any = {}) {
    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
}

const createStaffSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.string().optional().or(z.literal('')),
    staff_code: z.string().min(1, "Staff code is required"),
    default_route_id: z.string().uuid().optional().or(z.literal(null)).or(z.literal('')),
    status: z.enum(["active", "inactive"]).default("active"),
})

export async function getStaffList(query?: string) {
    try {
        const result = await callMcp('list-staff');
        // Handle client-side filtering if needed, or better, implement filtering in Edge Function
        // For now, filtering is done client-side or we ignore query here as per previous logic (previous logic did DB query)
        // With Edge Function returning all, we filter here in JS:
        let data = result.data || [];

        if (query) {
            const q = query.toLowerCase();
            data = data.filter((s: any) =>
                (s.name?.toLowerCase().includes(q)) ||
                (s.username?.toLowerCase().includes(q)) ||
                (s.staff_code?.toLowerCase().includes(q))
            );
        }
        return { data };
    } catch (error: any) {
        console.error("Fetch Staff Error:", error)
        return { error: error.message, data: [] }
    }
}

export async function toggleStaffStatus(id: string, currentStatus: string) {
    try {
        await callMcp('toggle-staff-status', { id, currentStatus });
        revalidatePath('/admin/staff/manage')
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}


export async function createStaffAction(prevState: any, formData: FormData) {
    console.log("[Staff Create Proxy] Starting staff creation process via MCP");

    const rawData = {
        username: formData.get("username"),
        password: formData.get("password"),
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        staff_code: formData.get("staff_code"),
        default_route_id: formData.get("default_route_id") || null,
        status: formData.get("status"),
    }

    const validatedFields = createStaffSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return { error: validatedFields.error.flatten().fieldErrors }
    }

    const data = validatedFields.data

    try {
        const result = await callMcp('create-staff', data);

        revalidatePath('/admin/staff/manage')
        return {
            success: true,
            username: data.username,
            password: data.password,
            message: `Staff created successfully. Username: ${data.username}.`
        }

    } catch (err: any) {
        console.error("[Staff Create Proxy] MCP Error:", err);
        return { error: `MCP Error: ${err.message || 'Unknown error'}` }
    }
}
