import RightCalender from "./RightCalaender";
import RightSuggestion from "./RightSuggestion";

function RightNavbar() {
    return (
        <div className="fixed right-0 top-[10vh] h-[90vh] w-80 flex flex-col gap-3">

            {/* Calendar */}
            <div className="h-[47%] bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
                <RightCalender />
            </div>

            {/* Suggestion */}
            <div className="h-[47%] bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
                <RightSuggestion />
            </div>

        </div>
    );
}

export default RightNavbar;