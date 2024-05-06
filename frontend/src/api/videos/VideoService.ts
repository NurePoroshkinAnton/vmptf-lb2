import { Video } from "@/types/models/videos/Video"
import { UploadVideoDto } from "@/types/models/videos/dto/UploadVideoDto"
import axios from "axios"
import dayjs from "dayjs"

export class VideoService {
    private static axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_API_BASE_URL}/videos`,
        withCredentials: true,
    })

    static async upload(dto: UploadVideoDto) {
        await this.axiosInstance.post("", dto)
    }

    static async getAll() {
        const resp = await this.axiosInstance.get<Video[]>("")
        const videos = resp.data.map((video) => ({
            ...video,
            createdAt: dayjs(video.createdAt),
        }))
        return videos
    }

    static async getById(id: string) {
        const resp = await this.axiosInstance.get<Video>(`/${id}`)
        return resp.data
    }
}

