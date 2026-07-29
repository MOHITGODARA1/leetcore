import { Link } from "react-router-dom";
function MainBoxes() {
  return (
    <div className="w-[calc(100%-1.5rem)] ml-6 overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 min-w-max scrollbar-hide">

        {/* Card 1 */}
        <Link to="/dashboard/what's-next-on-leetcore" className="w-80 h-40 flex-shrink-0 rounded-xl cursor-pointer hover:scale-101 transition-all duration-300">
          <img
            src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1784921958/Untitled_design_zz3kwg.png"
            alt="What's new on Leetcore"
            className="w-full h-full  rounded-xl"
          />
        </Link>

        

        {/* Card 2 */}

        <Link to="/dashboard/what's-new-on-leetcore" className="w-80 h-40 flex-shrink-0 rounded-xl cursor-pointer hover:scale-101 transition-all duration-300">
          <img
            src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1784921322/What_s_New_on_Leetcore_1_lzr62h.png"
            alt="What's new on Leetcore"
            className="w-full h-full  rounded-xl"
           />
        </Link>


        {/* Card 3 */}

        <Link to="/dashboard/Career-oppertunity-on-leetcore" className="w-80 h-40 flex-shrink-0 rounded-xl cursor-pointer hover:scale-101 transition-all duration-300">
          <img
            src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1784922863/Untitled_design_1_lygwsx.png"
            alt="What's new on Leetcore"
            className="w-full h-full  rounded-xl"
           />
          
        </Link>
        {/* Card 4 */}
        <Link to="/dashboard/Social-media-footprint" className="w-80 h-40 flex-shrink-0 rounded-xl cursor-pointer hover:scale-101 transition-all duration-300">
          <img
            src="https://res.cloudinary.com/dznwqaqjw/image/upload/v1784924874/ChatGPT_Image_Jul_25_2026_01_57_32_AM_qc4qu2.png"
            alt="What's new on Leetcore"
            className="w-full h-full  rounded-xl"
           />
          
        </Link>
        

      </div>
    </div>
  );
}

export default MainBoxes;