import KezeloClientComponent from "@/app/kezelo/components/KezeloClientComponent";
import {ModeToggle} from "@/components/mode-toggle";

export default function KezeloPage() {
	return (
		<div>
			<div className="absolute top-5 right-5">
				<ModeToggle/>
			</div>
			<KezeloClientComponent />
		</div>
	);
}
