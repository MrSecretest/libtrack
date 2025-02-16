import Feature from "./Feature";
import Notes from "../../media/landing/features/notes.png";
import Books from "../../media/landing/features/books.png";
import Rating from "../../media/landing/features/rating.png";
import Readinglist from "../../media/landing/features/reading-list.png";
import track from "../../media/landing/features/track.png";
import Recommendations from "../../media/landing/features/recommendations.png";

import "./Features.css"

export default function Features(){
    return(
        <>
            <div className="features-grid">
                <Feature Image={Notes} Text={"Make Notes and Record Your Thoughts as You Read"}></Feature>
                <Feature Image={Books} Text={"40+ Million Books in Database"}></Feature>
                <Feature Image={Rating} Text={"Give Your Favorite Books a Rating"}></Feature>

                <Feature Image={Readinglist} Text={"Build Your Personal Reading List"}></Feature>
                <Feature Image={track} Text={"Track Your Progress for Every Book You’re Reading"}></Feature>
                <Feature Image={Recommendations} Text={"Get Tailored Book Recommendations"}></Feature>


            </div>
        </>
    )
}