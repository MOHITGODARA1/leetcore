import RightCalender from "./RightCalaender";
import RightSuggestion from "./RightSuggestion";

function RightNavbar() {
    return (
        <div className="fixed right-0 top-[10vh] h-[90vh] w-80 flex flex-col mr-4">

            {/* Calendar Section */}
            <div className="h-[49%] border-gray-700 bg-[#1f1f1f] rounded-lg">
                <RightCalender />
            </div>

            {/* Suggestion Section */}
            <div className="h-[47%] bg-[#1f1f1f] rounded-lg mt-2">
                <RightSuggestion />
            </div>

        </div>
    );
}

export default RightNavbar;