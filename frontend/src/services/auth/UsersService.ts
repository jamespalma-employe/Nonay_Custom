import Api from "../interceptors/Api";
import type { User } from "@/types/User";

export async function  getUsers(): Promise<User[]>  {
        const res = await Api.get('/users')
        return res.data
}


