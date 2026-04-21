import RightCalender from "./RightCalaender";
import RightSuggestion from "./RightSuggestion";
function RightNavbar() {
    return (
        <div className="
            fixed right-0 top-[10vh] h-[90vh]
            w-72 sm:w-80
            flex flex-col gap-3
            overflow-y-auto
        ">

            {/* Calendar */}
            <div className="h-[47%] min-h-[220px] bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
                <RightCalender />
            </div>

            {/* Suggestion */}
            <div className="h-[47%] min-h-[220px] bg-[#1f1f1f] rounded-xl overflow-hidden border border-gray-800">
                <RightSuggestion />
            </div>

        </div>
    );
}

export default RightNavbar;