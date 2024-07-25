"use client";

import { useState, useEffect, FormEvent } from "react";
import {
	signInWithEmailAndPassword,
	setPersistence,
	browserSessionPersistence,
	browserLocalPersistence,
	onAuthStateChanged,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/app/firebase/config";
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation";

declare global {
	interface Window {
		logout: () => void;
	}
}

export default function Home() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await auth.signOut();
			console.log("Successfully logged out");
			router.push("/"); // replace "/" with your desired route after logout
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	useEffect(() => {
		window.logout = handleLogout;
	}, []);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="absolute top-5 right-5">
				<ModeToggle />
			</div>
			<div>
				<Button onClick={handleLogout}>Kijelentkezés</Button>
			</div>
		</main>
	);
}
