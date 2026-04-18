import RightProgressbar from "./RightProgressbar";
import RightTips from "./RightTips";
function ContentrightNav() {
    return (
        <div className="h-full flex flex-col gap-4">

            {/* Calendar Section */}
            <div className="border border-gray-800 bg-[#1f1f1f] rounded-xl flex-shrink-0">
                <RightProgressbar />
            </div>

            {/* Suggestion Section */}
            <div className="bg-[#1f1f1f] border border-gray-800 rounded-xl flex-1 overflow-hidden min-h-0">
                <RightTips />
            </div>

        </div>
    )
}
export default ContentrightNav;