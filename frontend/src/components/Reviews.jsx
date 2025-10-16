import React, { useEffect, useState } from "react";
import Rating from "./Rating";
import RatingTemp from "./RatingTemp";
import Pagination from "./Pagination";
import { Link } from "react-router-dom";
import RatingReact from "react-rating";
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { useDispatch } from "react-redux";
import {
  customer_review,
  get_reviews,
  messageClear,
  product_details,
} from "../store/reducers/homeReducer";
import toast from "react-hot-toast";
import { useAuthState, useHomeState } from "../hooks/useSafeSelector";

const Reviews = ({ product }) => {
  const dispatch = useDispatch();
  const [parPage, setParPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  const { userInfo } = useAuthState();
  const { successMessage, reviews, rating_review, totalReview } =
    useHomeState();

  const [rat, setRat] = useState("");
  const [re, setRe] = useState("");

  const review_submit = (e) => {
    e.preventDefault();
    const obj = {
      name: userInfo.name,
      review: re,
      rating: rat,
      productId: product._id,
    };
    dispatch(customer_review(obj));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        })
      );
      dispatch(product_details(product.slug));
      setRat("");
      setRe("");
      dispatch(messageClear());
    }
  }, [successMessage]);

  useEffect(() => {
    if (product._id) {
      dispatch(
        get_reviews({
          productId: product._id,
          pageNumber,
        })
      );
    }
  }, [pageNumber, product]);

  return (
    <div className="space-y-8">
      {/* Overall Rating Section */}
      <div className="flex gap-12 md-lg:flex-col md-lg:gap-8">
        <div className="flex flex-col gap-4 justify-start items-start py-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-8">
          <div>
            <span className="text-5xl font-bold text-primary">{product.rating}</span>
            <span className="text-2xl font-semibold text-gray-600">/5</span>
          </div>
          <div className="flex text-2xl">
            <Rating ratings={product.rating} />
          </div>
          <p className="text-base text-gray-600 font-medium">({totalReview}) Reviews</p>
        </div>

        <div className="flex gap-3 flex-col py-4 space-y-3">
          <div className="flex justify-start items-center gap-6">
            <div className="text-lg flex gap-1 w-[100px]">
              <RatingTemp rating={5} />
            </div>
            <div className="w-[250px] h-[16px] bg-gray-200 rounded-full relative overflow-hidden">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (rating_review[0]?.sum || 0)) / totalReview
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-semibold min-w-[30px]">
              {rating_review[0]?.sum || 0}
            </p>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="text-lg flex gap-1 w-[100px]">
              <RatingTemp rating={4} />
            </div>
            <div className="w-[250px] h-[16px] bg-gray-200 rounded-full relative overflow-hidden">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (rating_review[1]?.sum || 0)) / totalReview
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-semibold min-w-[30px]">
              {rating_review[1]?.sum || 0}
            </p>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="text-lg flex gap-1 w-[100px]">
              <RatingTemp rating={3} />
            </div>
            <div className="w-[250px] h-[16px] bg-gray-200 rounded-full relative overflow-hidden">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (rating_review[2]?.sum || 0)) / totalReview
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-semibold min-w-[30px]">
              {rating_review[2]?.sum || 0}
            </p>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="text-lg flex gap-1 w-[100px]">
              <RatingTemp rating={2} />
            </div>
            <div className="w-[250px] h-[16px] bg-gray-200 rounded-full relative overflow-hidden">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (rating_review[3]?.sum || 0)) / totalReview
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-semibold min-w-[30px]">
              {rating_review[3]?.sum || 0}
            </p>
          </div>

          <div className="flex justify-start items-center gap-6">
            <div className="text-lg flex gap-1 w-[100px]">
              <RatingTemp rating={1} />
            </div>
            <div className="w-[250px] h-[16px] bg-gray-200 rounded-full relative overflow-hidden">
              <div
                style={{
                  width: `${Math.floor(
                    (100 * (rating_review[4]?.sum || 0)) / totalReview
                  )}%`,
                }}
                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-semibold min-w-[30px]">
              {rating_review[4]?.sum || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-dark mb-6 text-gradient">
          Customer Reviews ({totalReview})
        </h2>

        <div className="space-y-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {r.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark text-lg">{r.name}</h4>
                    <div className="flex gap-1 text-lg">
                      <RatingTemp rating={r.rating} />
                    </div>
                  </div>
                </div>
                <span className="text-gray-500 text-sm font-medium">{r.date}</span>
              </div>
              
              {r.title && (
                <h5 className="font-semibold text-dark text-lg mb-2">{r.title}</h5>
              )}
              
              <p className="text-gray-700 text-base leading-relaxed mb-4">{r.review}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {r.verifiedPurchase && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified Purchase
                    </span>
                  )}
                  {r.isVerified && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified Review
                    </span>
                  )}
                </div>
                
                <button className="text-gray-500 hover:text-primary transition-colors duration-300 text-sm font-medium">
                  Helpful ({r.helpful || 0})
                </button>
              </div>

              {r.sellerResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border-l-4 border-primary">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-primary">Seller Response</span>
                    <span className="text-xs text-gray-500">{r.sellerResponse.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{r.sellerResponse.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          {totalReview > 5 && (
            <Pagination
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              totalItem={totalReview}
              parPage={parPage}
              showItem={Math.floor(totalReview / 3)}
            />
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        {userInfo ? (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-dark mb-6">Write a Review</h3>
            
            <form onSubmit={review_submit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rate this product
                </label>
                <div className="flex gap-1">
                  <RatingReact
                    onChange={(e) => setRat(e)}
                    initialRating={rat}
                    emptySymbol={
                      <span className="text-gray-300 text-4xl hover:text-yellow-400 transition-colors cursor-pointer">
                        <CiStar />
                      </span>
                    }
                    fullSymbol={
                      <span className="text-yellow-400 text-4xl hover:text-yellow-500 transition-colors cursor-pointer">
                        <FaStar />
                      </span>
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Your Review
                </label>
                <textarea
                  value={re}
                  onChange={(e) => setRe(e.target.value)}
                  required
                  placeholder="Share your experience with this product..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors duration-300 resize-none"
                  rows="6"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-dark mb-4">Want to write a review?</h3>
              <p className="text-gray-600 mb-6">Please login to share your experience with this product.</p>
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-block"
              >
                Login to Review
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
