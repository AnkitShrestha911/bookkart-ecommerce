import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { RWebShare } from "react-web-share";

console.log("Share called")

interface RWebShareProps {
	url: string;
	title: string;
	text: string;
}

export const ShareButton: React.FC<RWebShareProps> = ({ url, title, text }) => {
	return (
		<RWebShare
			data={{
				text,
				url,
				title,
			}}
			onClick={() => console.log("shared successfully.")}
		>
			<Button size="sm" variant="outline" className="cursor-pointer">
				<Share2 className="w-4 h-4 mr-2" />
				Share
			</Button>
		</RWebShare>
	);
};
