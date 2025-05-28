import { getDocs } from "@/http/get-docs";

export default function teste() {
    const ret = getDocs()

    console.log(ret)
}