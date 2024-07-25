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

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [stayLoggedIn, setStayLoggedIn] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/kezelo");
			}
		});
		return () => unsubscribe();
	}, [router]);

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		try {
			await setPersistence(
				auth,
				stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
			);
			await signInWithEmailAndPassword(auth, email, password);
			router.push("/kezelo");
		} catch (err) {
			if (err instanceof Error) {
				switch (err.message) {
					case "Firebase: Error (auth/invalid-email).":
						setError("Érvénytelen email!");
						break;
					case "Firebase: Error (auth/missing-password).":
						setError("Hiányzó jelszó!");
						break;
					case "Firebase: Error (auth/user-not-found).":
						setError("Nincs ilyen felhasználó!");
						break;
					case "Firebase: Error (auth/wrong-password).":
						setError("Téves jelszó!");
						break;
					default:
						setError(err.message);
						break;
				}
			} else {
				setError("Ismeretlen hiba történt!");
			}
		}
	};

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="absolute top-5 right-5">
				<ModeToggle />
			</div>
			<div className="flex items-center text-[2rem] mb-10">
				<p className="mr-1">Matek Pontáblázat</p>
				<p className="bg-foreground text-background ml-1 px-2.5 rounded-md dark:bg-foreground">
					Web
				</p>
			</div>
			<div>
				<Card className="w-[30rem] h-[28rem]">
					<CardHeader>
						<CardTitle className="text-[1.5rem] mb-5">Bejelentkezés</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleLogin}>
							<div className="grid w-full items-center gap-4 mb-7">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
							</div>
							<div className="grid w-full items-center gap-4">
								<div className="flex flex-col space-y-1.5">
									<Label htmlFor="password">Jelszó</Label>
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</div>
							</div>
							<div className="items-top flex space-x-2 mt-10">
								<Checkbox
									id="password_cb"
									checked={showPassword}
									onCheckedChange={() => setShowPassword(!showPassword)}
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="password_cb"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Jelszó mutatása
									</label>
								</div>
							</div>
							<div className="items-top flex space-x-2 mt-4 mb-9">
								<Checkbox
									id="login_cb"
									checked={stayLoggedIn}
									onCheckedChange={() => setStayLoggedIn(!stayLoggedIn)}
								/>
								<div className="grid gap-1.5 leading-none">
									<label
										htmlFor="login_cb"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
									>
										Bejelentkezve maradok
									</label>
								</div>
							</div>
							<div className="flex items-center mt-7">
								<Button type="submit">Bejelentkezés</Button>
								{error && <p className="text-red-500 ml-4">{error}</p>}
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
