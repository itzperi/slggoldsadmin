'use server'

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

export async function getStaffDetails(id: string) {
    try {
        const result = await callMcp('get-staff-details', { id });
        return { data: result.data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function getAvailableCustomers() {
    try {
        const result = await callMcp('list-customers');
        return { data: result.data }
    } catch (error: any) {
        return { error: error.message, data: [] }
    }
}

export async function updateStaffAssignments(staffId: string, customerIds: string[]) {
    try {
        await callMcp('update-staff-assignments', { staffId, customerIds });
        revalidatePath(`/admin/staff/${staffId}`)
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function schedulePayment(staffId: string, customerId: string, amount: number, dueDate: string) {
    try {
        await callMcp('schedule-payment', { staffId, customerId, amount, dueDate });
        revalidatePath(`/admin/staff/${staffId}`)
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
