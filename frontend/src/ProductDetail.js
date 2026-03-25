
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ addToCart }) {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    // Review states
    const [reviews, setReviews] = useState([]);
    const [userName, setUserName] = useState("");
    const [comment, setComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null); // ဘယ် comment id ကို reply ပြန်မလဲ သိဖို့

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`https://e-shop-npm.vercel.app/reviews/${id}`);
            setReviews(res.data);
        } catch (err) {
            console.log("Error fetching reviews:", err);
        }
    };

    const [rating, setRating] = useState(5); // Default ကို ၅ ပွင့် ထားမယ်

    // အရင်ရှိပြီးသား handleReviewSubmit ရဲ့ အောက်မှာ ဒါလေး ထည့်ပါ
    const handleReplySubmit = async (e, parentId) => {
        e.preventDefault();
        try {
            await axios.post('https://e-shop-npm.vercel.app/reviews', {
                product_id: id,
                user_name: userName,
                comment: comment,
                parent_id: parentId // Reply ဖြစ်လို့ parent id ထည့်ပေးရမယ်
            });
            setComment(""); // စာရိုက်တဲ့ box ကို ရှင်းမယ်
            setReplyingTo(null); // Reply box ကို ပြန်ပိတ်မယ်
            fetchReviews(); // Review အသစ်တွေကို ပြန်ခေါ်မယ်
        } catch (err) {
            console.log("Error posting reply:", err);
        }
    };

    useEffect(() => {
        console.log("Fetching product with ID:", id);
        axios.get(`https://e-shop-npm.vercel.app/products/${id}`)
            .then(res => {
                setProduct(res.data);
                fetchReviews(); // ပစ္စည်းရတာနဲ့ review ပါ တစ်ခါတည်းခေါ်မယ်
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setError("Product not found or Server Error");
            });
           // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);
   

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://e-shop-npm.vercel.app/reviews', {
                product_id: id,
                user_name: userName,
                comment: comment,
                rating: rating,
                parent_id: null
            });
            setComment("");
            setUserName("")
            fetchReviews();
        } catch (err) {
            console.log(err);
        }
    };

    if (error) return <div className="container my-5 text-danger">{error}</div>;
    if (!product) return <div className="container my-5">Loading...</div>;

    // ပျမ်းမျှ rating တွက်တဲ့ logic
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, rev) => acc + (rev.rating || 5), 0) / reviews.length).toFixed(1)
        : 0;


    return (
        <div className="container my-5">
            {/* Main Row: ပုံနဲ့ အချက်အလက်တွေကို ဘေးချင်းကပ်ရန် */}
            <div className="row mb-5">

                {/* --- (၁) ဘယ်ဘက်ခြမ်း - ပစ္စည်း၏ပုံ (col-md-6) --- */}
                <div className="col-md-6 mb-4">
                    <img
                        src={product.image || "https://via.placeholder.com/500"}
                        alt={product.name}
                        className="img-fluid rounded shadow-lg w-100"
                        style={{ objectFit: 'cover', maxHeight: '500px' }}
                    />
                </div>

                {/* --- (၂) ညာဘက်ခြမ်း - အချက်အလက်များ (col-md-6) --- */}
                <div className="col-md-6">

                    {/* Rating အပိုင်း */}
                    <div className="d-flex align-items-center mb-3">
                        <div className="text-warning me-2">
                            {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
                        </div>
                        <span className="fw-bold">{averageRating} / 5</span>
                        <span className="text-muted ms-2">({reviews ? reviews.length : 0} reviews)</span>
                    </div>

                    {/* နာမည်နှင့် ဈေးနှုန်း */}
                    <h1 className="fw-bold mb-2">{product.name}</h1>
                    <h3 className="text-primary fw-bold mb-4">${product.price}</h3>

                    {/* Specifications & Description Box */}
                    <div className="p-4 bg-light rounded-4 border mb-4 shadow-sm">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">Specifications & Description</h5>
                        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.7', color: '#555' }}>
                            {product.description || "No detailed description provided."}
                        </p>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="d-grid gap-2 d-md-block">
                        <button
                            className="btn btn-dark btn-lg px-5 shadow-sm w-100 w-md-auto"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>

            </div>
            {/* ဒီနေရာမှာ Review list တွေရှိရင် ဆက်ရေးလို့ရပါတယ် */}


            <hr />




            {/* Review Section - Row ရဲ့ အပြင်ဘက်ကို ထုတ်လိုက်ပါပြီ */}


            <div className="mt-5">
                <h3 className="mb-4">Customer Reviews ({reviews.length})</h3>

                <div className="row">
                    <div className="col-lg-8">
                        {/* Review Form (မူလအတိုင်း) */}
                        <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
                            <h5 className="mb-3">Leave a Review</h5>
                            <form onSubmit={handleReviewSubmit}>
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="form-control"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="fw-bold mb-1">Your Rating:</label>
                                    <div className="text-warning fs-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setRating(star)}
                                            >
                                                {star <= rating ? '★' : '☆'}
                                            </span>
                                        ))}
                                        <span className="ms-2 text-dark fs-6">({rating} Stars)</span>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <textarea
                                        placeholder="Write your feedback here..."
                                        className="form-control"
                                        rows="4"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-dark px-4">Post Comment</button>
                            </form>
                        </div>

                        {/* Review List (ဒီနေရာမှာ Reply Logic တွေ ညှပ်ထည့်ထားပါတယ်) */}
                        <div className="review-list">
                            {reviews.length > 0 ? (
                                reviews.map((rev) => (
                                    /* ၁။ မူရင်း Comment တွေကိုပဲ အရင်စစ်ထုတ်ပြီး ပြမယ် */
                                    !rev.parent_id && (
                                        <div key={rev.id} className="mb-4">
                                            {/* Parent Comment Card */}
                                            <div className="card p-3 shadow-sm border-0 bg-light">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <h6 className="fw-bold mb-0 text-primary">{rev.user_name}</h6>
                                                    <small className="text-muted">
                                                        {new Date(rev.created_at).toLocaleDateString()}
                                                    </small>
                                                </div>

                                                <div className="mb-1 text-warning">
                                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                </div>
                                                <p className="mb-2 text-secondary">{rev.comment}</p>

                                                <button
                                                    className="btn btn-sm btn-link text-decoration-none p-0"
                                                    onClick={() => setReplyingTo(rev.id)}
                                                >
                                                    Reply
                                                </button>

                                                {/* Reply Form - Reply ခလုတ်နှိပ်မှ ပေါ်လာမယ် */}
                                                {replyingTo === rev.id && (
                                                    <div className="mt-3 p-3 border-start border-4 border-primary bg-white shadow-sm">
                                                        <h6 className="small fw-bold">Replying to {rev.user_name}</h6>
                                                        <form onSubmit={(e) => handleReplySubmit(e, rev.id)}>
                                                            <input
                                                                type="text"
                                                                placeholder="Your Name"
                                                                className="form-control form-control-sm mb-2"
                                                                value={userName}
                                                                onChange={(e) => setUserName(e.target.value)}
                                                                required
                                                            />
                                                            <textarea
                                                                placeholder="Write your reply..."
                                                                className="form-control form-control-sm mb-2"
                                                                value={comment}
                                                                onChange={(e) => setComment(e.target.value)}
                                                                required
                                                            ></textarea>
                                                            <div className="d-flex gap-2">
                                                                <button type="submit" className="btn btn-primary btn-sm">Submit Reply</button>
                                                                <button type="button" className="btn btn-light btn-sm" onClick={() => setReplyingTo(null)}>Cancel</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ၂။ ဒီ Comment ရဲ့အောက်မှာ ရှိသမျှ Reply တွေကို အတွင်းဘက်တိုးပြီး ပြပေးမယ် */}
                                            <div className="ms-5 mt-2">
                                                {reviews
                                                    .filter((reply) => reply.parent_id === rev.id)
                                                    .map((reply) => (
                                                        <div key={reply.id} className="card p-2 mb-2 border-0 bg-white shadow-sm" style={{ borderLeft: '3px solid #dee2e6' }}>
                                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                                <h6 className="small fw-bold mb-0 text-dark">{reply.user_name}</h6>
                                                                <small className="text-muted" style={{ fontSize: '11px' }}>
                                                                    {new Date(reply.created_at).toLocaleDateString()}
                                                                </small>
                                                            </div>
                                                            <p className="small mb-0 text-secondary">{reply.comment}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )
                                ))
                            ) : (
                                <p className="text-muted">No reviews yet. Be the first to review!</p>
                            )}
                        </div>

                    </div>
                </div>
            </div>


        </div>
    );
}

export default ProductDetail;