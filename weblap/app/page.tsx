"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/kezelo");
			} else {
				router.push("bejelentkezes");
			}
		});
		return () => unsubscribe();
	}, [router]);

	return <main className="bg-background"></main>;
}
