import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerReviewsSection: React.FC = () => {
  const { reviews, addReview, paintings } = useStore();
  const [isWritingReview, setIsWritingReview] = useState(false);

  // Form states
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [paintingId, setPaintingId] = useState(paintings[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim() || comment.length < 10) {
      setError('Please provide your name and a genuine review (minimum 10 characters).');
      return;
    }

    const selectedP = paintings.find((p) => p.id === paintingId);

    addReview({
      paintingId,
      paintingTitle: selectedP ? selectedP.title : 'Custom Mithila Artwork',
      author,
      city: city || 'India',
      rating,
      comment,
    });

    setAuthor('');
    setCity('');
    setComment('');
    setIsWritingReview(false);
    setError('');
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C85A32] font-semibold block mb-2 font-sans">
              PATRON EXPERIENCES
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1E2D22] mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-[#D4943E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#1E2D22]">
                {averageRating} out of 5.0
              </span>
              <span className="text-xs text-[#8E7B6C]">
                ({reviews.length} Verified Patrons)
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsWritingReview(true)}
            className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-[#E5DAC8] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-[#D4943E]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8E7B6C]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#4A3E34] leading-relaxed mb-4 font-light italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4EFE6]">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2D22]">
                  <span>{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span title="Verified Purchase" className="inline-flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8E7B6C]">{rev.city}</p>
                <p className="text-[10px] text-[#C85A32] font-medium mt-1 line-clamp-1">
                  Artwork: {rev.paintingTitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* WRITE A REVIEW MODAL */}
      {isWritingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E5DAC8] relative">
            <button
              onClick={() => setIsWritingReview(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-medium text-[#1E2D22] mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-[#6B5B4E] mb-5">
              Your feedback honors our master artists in Bihar and helps fellow art connoisseurs.
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shalini Roy"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-[#E2D7C5] rounded-lg outline-none focus:border-[#C85A32]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-sm px-3.5 py-2 border border-[#E2D7C5] rounded-lg outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full text-sm px-3.5 py-2 border border-[#E2D7C5] rounded-lg outline-none focus:border-[#C85A32] bg-white cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                    <option value={2}>⭐⭐ (2 - Below Expectations)</option>
                    <option value={1}>⭐ (1 - Needs Improvement)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                  Purchased Artwork
                </label>
                <select
                  value={paintingId}
                  onChange={(e) => setPaintingId(e.target.value)}
                  className="w-full text-sm px-3.5 py-2 border border-[#E2D7C5] rounded-lg outline-none focus:border-[#C85A32] bg-white cursor-pointer"
                >
                  {paintings.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5B4E] mb-1">
                  Your Written Review *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the craft details, paper texture, mineral colors, framing quality, and delivery experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm p-3 border border-[#E2D7C5] rounded-lg outline-none focus:border-[#C85A32]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="px-5 py-2 text-xs font-medium text-[#7A6B5D] hover:text-[#1E2D22]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E2D22] hover:bg-[#C85A32] text-white px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Submit Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
