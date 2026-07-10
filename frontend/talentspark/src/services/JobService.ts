import api from "./api";
import type {job} from "../types/job";

export async function getJobs(): Promise<job[]> {
    const response = await api.get("/job/");
    return response.data;
}

export async function getJob(id: number): 
    Promise<job> {
        const response = await api.get(`/job/${id}`);
        return response.data;
}

export async function createJob(job: Omit<job, "id"> & { id?: number }): Promise<job> {
    const response = await api.post("/job/",job);
    return response.data;
}

export async function updateJob(id: number,job: Partial<job>): Promise<job> {
    const response = await api.put(`/job/${id}`,job);
    return response.data;
}

export async function deleteJob(id: number): Promise<void> {
    const response = await api.delete(`/job/${id}`);
    return response.data;
}